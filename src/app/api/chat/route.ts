import {
  appendClientMessage,
  appendResponseMessages,
  createDataStream,
  LanguageModel,
  smoothStream,
  streamText,
} from "ai";
import { postRequestBodySchema, type PostRequestBody } from "./schema";
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
import { systemPrompt } from "@/lib/models/prompts";
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
    },
    { token }
  );

  if (todaysMessagesCount >= maxMessagesPerDay) {
    return new ChatError("rate_limit:chat").toResponse();
  }

  try {
    const { id, message, selectedChatModel, searchEnabled, canvasEnabled } =
      requestBody;

    const thread = await fetchQuery(
      api.threads.getThreadById,
      { id },
      { token }
    );

    if (!thread) {
      const title = await generateTitleFromUserMessage({
        message,
      });

      await fetchMutation(
        api.threads.createThread,
        {
          id: id,
          title,
          userId: userConfig.userId,
        },
        { token }
      );
    }

    const previousMessages = await fetchQuery(
      api.messages.getMessagesForThread,
      {
        threadId: id,
      },
      { token }
    );

    const messages = appendClientMessage({
      // @ts-expect-error: todo add type conversion from DBMessage[] to UIMessage[]
      messages: previousMessages.filter((m) => m.content !== ""),
      message,
    });

    const modelDefinition = getModelDefinition(selectedChatModel);
    if (!modelDefinition) {
      throw new Error(`Model ${selectedChatModel} not found`);
    }

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
          free: !modelDefinition?.byok,
        },
      },
      { token }
    );

    if (modelDefinition.byok && !userConfig.openRouterKey) {
      // todo show on frontend
      throw new Error("OpenRouter key not found");
    }

    const streamId = generateUUID();
    await fetchMutation(
      api.streams.createStream,
      {
        id: streamId,
        threadId: id,
      },
      { token }
    );

    const activeTools =
      modelDefinition.tools && canvasEnabled
        ? ["createCanvasArtifact", "updateCanvasArtifact"]
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
            searchEnabled,
            userConfig,
            canvasEnabled,
          }),
          messages,
          maxSteps: 5,
          experimental_activeTools: activeTools as any,
          experimental_generateMessageId: generateUUID,
          maxTokens: 1000,
          temperature: 0.7,
          experimental_transform: smoothStream(),
          tools:
            modelDefinition.tools && canvasEnabled
              ? {
                  createCanvasArtifact: createDocument({
                    userConfig,
                    dataStream,
                  }),
                  updateCanvasArtifact: updateDocument({
                    dataStream,
                  }),
                  webSearch,
                }
              : undefined,
          onError: (error) => {
            console.log({ error });
          },
          onFinish: async ({ response }) => {
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
              await fetchMutation(
                api.messages.saveMessage,
                {
                  message: {
                    id: assistantId,
                    userId: userConfig.userId,
                    threadId: id,
                    role: "assistant",
                    content: assistantMessage.content,
                    attachments: [],
                    parts: assistantMessage.parts ?? [],
                    free: !modelDefinition.byok,
                  },
                },
                { token }
              );

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

        result.mergeIntoDataStream(dataStream, {
          sendReasoning: true,
        });
      },
      onError: () => {
        return "Oops, an error occurred!";
      },
    });

    const streamContext = getStreamContext();

    const headers = new Headers({
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
      "Transfer-Encoding": "chunked",
    });

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
        return new Response(stream, { headers });
      }
    } else {
      return new Response(stream, { headers });
    }
  } catch (error) {
    console.log("error");
    throw error;
  }
}

export async function GET(request: Request) {
  const token = await getAuthToken();

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
    thread = await fetchQuery(
      api.threads.getThreadById,
      { id: threadId },
      { token }
    );
  } catch {
    return new ChatError("not_found:chat").toResponse();
  }

  if (!thread) {
    return new ChatError("not_found:chat").toResponse();
  }

  const streamIds = await fetchQuery(
    api.streams.getStreamIdsByThreadId,
    {
      threadId,
    },
    { token }
  );

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
    const messages = await fetchQuery(
      api.messages.getMessagesForThread,
      {
        threadId,
      },
      { token }
    );

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
