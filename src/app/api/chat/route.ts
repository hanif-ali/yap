import {
  appendClientMessage,
  appendResponseMessages,
  createDataStream,
  LanguageModel,
  streamText,
} from "ai";
import { postRequestBodySchema, type PostRequestBody } from "./schema";
import { geolocation } from "@vercel/functions";
import {
  createResumableStreamContext,
  type ResumableStreamContext,
} from "resumable-stream";
import { after } from "next/server";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";

import { generateTitleFromUserMessage } from "@/app/(chat)/chat/actions";
import { generateUUID, getTrailingMessageId } from "@/lib/utils";
import { getModelDefinition, getModelInstance } from "@/lib/models/models";
import { ChatError } from "@/lib/errors";
import { Doc } from "../../../../convex/_generated/dataModel";
import { differenceInSeconds } from "date-fns";
import { createDocument } from "@/lib/documents/create-document";
import { RequestHints, systemPrompt } from "@/lib/models/prompts";
import { updateDocument } from "@/lib/documents/update-document";
import { webSearch } from "@/lib/models/web-search";
import { getAuthToken, getCurrentUserConfig } from "@/lib/auth";
import { MAX_MESSAGES_PER_DAY } from "@/lib/rate-limiting";

let globalStreamContext: ResumableStreamContext | null = null;

function getStreamContext() {
  if (!globalStreamContext) {
    try {
      globalStreamContext = createResumableStreamContext({
        waitUntil: after,
      });
    } catch (error: any) {
      if (error.message.includes("REDIS_URL")) {
        console.log(
          " > Resumable streams are disabled due to missing REDIS_URL"
        );
      } else {
        console.error(error);
      }
    }
  }

  return globalStreamContext;
}

export async function POST(request: Request) {
  let requestBody: PostRequestBody;

  const token = await getAuthToken();
  const userConfig = await getCurrentUserConfig();

  try {
    const json = await request.json();
    requestBody = postRequestBodySchema.parse(json);
  } catch (error) {
    // return new ChatError("bad_request:api").toResponse();
    throw error;
  }

  const maxMessagesPerDay = userConfig.isAnonymous
    ? MAX_MESSAGES_PER_DAY.anonymous
    : MAX_MESSAGES_PER_DAY.signedIn;

  const todaysMessagesCount = await fetchQuery(
    api.messages.todaysMessagesCount,
    {
      userId: userConfig.userId,
    }
  );

  if (todaysMessagesCount >= maxMessagesPerDay) {
    return new ChatError("rate_limit:chat").toResponse();
  }

  try {
    const { id, message, selectedChatModel, searchEnabled } = requestBody;

    const thread = await fetchQuery(api.threads.getThreadById, { id });

    if (!thread) {
      const title = await generateTitleFromUserMessage({
        message,
      });

      await fetchMutation(api.threads.createThread, {
        id: id,
        title,
        userId: userConfig.userId,
      });
    }

    const previousMessages = await fetchQuery(
      api.messages.getMessagesForThread,
      {
        threadId: id,
      }
    );

    const messages = appendClientMessage({
      // @ts-expect-error: todo add type conversion from DBMessage[] to UIMessage[]
      messages: previousMessages.filter((m) => m.content !== ""),
      message,
    });

    const { longitude, latitude, city, country } = geolocation(request);

    const requestHints: RequestHints = {
      longitude,
      latitude,
      city,
      country,
    };

    await fetchMutation(
      api.messages.saveMessage,
      {
        message: {
          id: message.id,
          userId: userConfig.userId,
          threadId: id,
          role: "user",
          content: message.content,
          attachments:
            message.experimental_attachments?.map((attachment) => ({
              id: attachment.id,
              url: attachment.url,
              contentType: attachment.contentType,
            })) ?? [],
          parts: message.parts,
        },
      },
      { token }
    );

    const modelDefinition = getModelDefinition(selectedChatModel);
    if (!modelDefinition) {
      throw new Error(`Model ${selectedChatModel} not found`);
    }

    if (modelDefinition.byok && !userConfig.openRouterKey) {
      // todo show on frontend
      throw new Error("OpenRouter key not found");
    }

    const streamId = generateUUID();
    await fetchMutation(api.streams.createStream, {
      id: streamId,
      threadId: id,
    });

    const activeTools = modelDefinition.tools
      ? ["createDocument", "updateDocument"]
      : [];
    if (searchEnabled) {
      activeTools.push("webSearch");
    }

    const stream = createDataStream({
      execute: (dataStream) => {
        const result = streamText({
          model: getModelInstance(modelDefinition, userConfig) as LanguageModel,
          system: systemPrompt({
            modelDefinition,
            requestHints,
            searchEnabled,
          }),
          messages,
          maxSteps: 5,
          // todo disable for reasoning models
          experimental_activeTools: activeTools as any,
          experimental_generateMessageId: generateUUID,
          maxTokens: 1000,
          // Add streaming optimizations
          // experimental_telemetry: {
          //   isEnabled: false,
          // },
          // Optimize for real-time streaming
          temperature: 0.6,
          tools: modelDefinition.tools
            ? {
                createDocument: createDocument({
                  userConfig,
                  dataStream,
                }),
                updateDocument: updateDocument({
                  dataStream,
                }),
                webSearch,
              }
            : undefined,
          onError: (error) => {
            console.log({ error });
          },
          onFinish: async ({ response }) => {
            // if (session.user?.id) {
            try {
              const assistantId = getTrailingMessageId({
                messages: response.messages.filter(
                  (message) => message.role === "assistant"
                ),
              });

              if (!assistantId) {
                throw new Error("No assistant message found!");
              }

              const [, assistantMessage] = appendResponseMessages({
                messages: [message],
                responseMessages: response.messages,
              });
              await fetchMutation(api.messages.saveMessage, {
                message: {
                  id: assistantId,
                  userId: userConfig.userId,
                  threadId: id,
                  role: "assistant",
                  content: assistantMessage.content,
                  attachments: [],
                  parts: assistantMessage.parts ?? [],
                },
              });

              dataStream.writeData({
                type: "remaining-tokens",
                content: maxMessagesPerDay - todaysMessagesCount - 1,
              });
            } catch (error) {
              console.log({ error });
              throw error;
            }
            // }
          },
        });

        // Don't consume the stream - let it flow through naturally
        // result.consumeStream();

        result.mergeIntoDataStream(dataStream, {
          sendReasoning: true,
        });
      },
      onError: () => {
        return "Oops, an error occurred!";
      },
    });

    const streamContext = getStreamContext();

    // Create proper streaming headers with additional optimizations
    const headers = new Headers({
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no", // Disable nginx buffering
      "Transfer-Encoding": "chunked", // Enable chunked transfer encoding
    });

    // Prefer direct streaming for better real-time performance
    if (streamContext) {
      try {
        return new Response(
          await streamContext.resumableStream(streamId, () => stream),
          { headers }
        );
      } catch (error) {
        console.warn(
          "Resumable stream failed, falling back to direct stream:",
          error
        );
        // Fall back to direct streaming
        return new Response(stream, { headers });
      }
    } else {
      // Direct streaming when resumable context is not available
      return new Response(stream, { headers });
    }
  } catch (error) {
    console.log("error");
    throw error;
  }
}

export async function GET(request: Request) {
  // todo ensure that user can only resume their own streams
  // todo auth basically
  const streamContext = getStreamContext();
  const resumeRequestedAt = new Date();

  if (!streamContext) {
    return new Response(null, { status: 204 });
  }

  const { searchParams } = new URL(request.url);
  const threadId = searchParams.get("chatId");

  if (!threadId) {
    return new ChatError("bad_request:api").toResponse();
  }

  let thread: Doc<"threads"> | null;

  try {
    thread = await fetchQuery(api.threads.getThreadById, { id: threadId });
  } catch {
    return new ChatError("not_found:chat").toResponse();
  }

  if (!thread) {
    return new ChatError("not_found:chat").toResponse();
  }

  const streamIds = await fetchQuery(api.streams.getStreamIdsByThreadId, {
    threadId,
  });

  if (!streamIds.length) {
    return new ChatError("not_found:stream").toResponse();
  }

  const recentStreamId = streamIds.at(-1);

  if (!recentStreamId) {
    return new ChatError("not_found:stream").toResponse();
  }

  const emptyDataStream = createDataStream({
    execute: () => {},
  });

  const stream = await streamContext.resumableStream(
    recentStreamId,
    () => emptyDataStream
  );

  /*
   * For when the generation is streaming during SSR
   * but the resumable stream has concluded at this point.
   */
  if (!stream) {
    const messages = await fetchQuery(api.messages.getMessagesForThread, {
      threadId,
    });

    const mostRecentMessage = messages.at(-1);

    if (!mostRecentMessage) {
      return new Response(emptyDataStream, { status: 200 });
    }

    if (mostRecentMessage.role !== "assistant") {
      return new Response(emptyDataStream, { status: 200 });
    }

    const messageCreatedAt = new Date(mostRecentMessage.createdAt);

    if (differenceInSeconds(resumeRequestedAt, messageCreatedAt) > 15) {
      return new Response(emptyDataStream, { status: 200 });
    }

    const restoredStream = createDataStream({
      execute: (buffer) => {
        buffer.writeData({
          type: "append-message",
          message: JSON.stringify(mostRecentMessage),
        });
      },
    });

    return new Response(restoredStream, { status: 200 });
  }

  return new Response(stream, { status: 200 });
}
