import {
  appendClientMessage,
  appendResponseMessages,
  createDataStream,
  smoothStream,
  streamText,
} from "ai";
// import { type RequestHints, systemPrompt } from '@/lib/ai/prompts';

// import { createDocument } from '@/lib/ai/tools/create-document';
// import { updateDocument } from '@/lib/ai/tools/update-document';
// import { requestSuggestions } from "@/lib/ai/tools/request-suggestions";
// import { getWeather } from '@/lib/ai/tools/get-weather';
// import { isProductionEnvironment } from '@/lib/constants';
// import { entitlementsByUserType } from '@/lib/ai/entitlements';
import { postRequestBodySchema, type PostRequestBody } from "./schema";
import { geolocation } from "@vercel/functions";
import {
  createResumableStreamContext,
  type ResumableStreamContext,
} from "resumable-stream";
import { after } from "next/server";
// import type { Chat } from '@/lib/db/schema';
// import { differenceInSeconds } from 'date-fns';
// import { ChatError } from "@/lib/errors";
// import { getThreadById } from "../../../../convex/threads";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";

import { getMessagesForThread } from "../../../../convex/messages";
import { updateDocument } from "../../../../ai-chatbot/lib/ai/tools/update-document";
import { auth } from "@clerk/nextjs/server";
import { generateTitleFromUserMessage } from "@/app/chat/actions";
import { createThread, getThreadById } from "../../../../convex/threads";
import { generateUUID, getTrailingMessageId } from "@/lib/utils";
import { getModelInstance } from "@/lib/models/models";
import { ChatError } from "@/lib/errors";
import { Doc } from "../../../../convex/_generated/dataModel";
import { differenceInSeconds } from "date-fns";
import { ReasoningUIPart } from "@ai-sdk/ui-utils";
import { xai } from "@ai-sdk/xai";

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
        console.log("errlkjwerlkj");
        console.error(error);
      }
    }
  }

  return globalStreamContext;
}

export async function POST(request: Request) {
  let requestBody: PostRequestBody;

  // todo fix auth
  const authData = await auth();
  const token = await authData.getToken({ template: "convex" });

  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const json = await request.json();
    requestBody = postRequestBodySchema.parse(json);
  } catch (error) {
    // return new ChatError("bad_request:api").toResponse();
    throw error;
  }

  try {
    // const { id, message, selectedChatModel, selectedVisibilityType } =
    //   requestBody;
    const { id, message, selectedChatModel } = requestBody;

    // TODO: add auth, rate limiting

    // const messageCount = await getMessageCountByUserId({
    //   id: session.user.id,
    //   differenceInHours: 24,
    // });

    // if (messageCount > entitlementsByUserType[userType].maxMessagesPerDay) {
    //   return new ChatError("rate_limit:chat").toResponse();
    // }

    const thread = await fetchQuery(api.threads.getThreadById, { id });
    if (!thread) {
      // TODO: handle no chat case
      const title = await generateTitleFromUserMessage({
        message,
      });
      // todo fix user id being passed as empty
      await fetchMutation(api.threads.createThread, {
        id: id,
        title,
        userId: authData.userId ?? "",
      });
      // } else {
      //   if (chat.userId !== session.user.id) {
      //     return new ChatError("forbidden:chat").toResponse();
      //   }
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

    // const requestHints: RequestHints = {
    //   longitude,
    //   latitude,
    //   city,
    //   country,
    // };

    await fetchMutation(
      api.messages.saveMessage,
      {
        message: {
          id: message.id,
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

    const streamId = generateUUID();
    await fetchMutation(api.streams.createStream, {
      id: streamId,
      threadId: id,
    });

    console.log({ messages });
    const stream = createDataStream({
      execute: (dataStream) => {
        const result = streamText({
          model: xai("grok-3-mini"),
          system:
            "You are a friendly assistant! Keep your responses concise and helpful.",
          messages,
          maxSteps: 5,
          // experimental_activeTools:
          //   selectedChatModel === "chat-model-reasoning"
          //     ? []
          //     : [
          //         "getWeather",
          //         "createDocument",
          //         "updateDocument",
          //         "requestSuggestions",
          //       ],
          experimental_transform: smoothStream({ chunking: "word" }),
          experimental_generateMessageId: generateUUID,
          // tools: {
          //   getWeather,
          //   createDocument: createDocument({ session, dataStream }),
          //   updateDocument: updateDocument({ session, dataStream }),
          //   requestSuggestions: requestSuggestions({
          //     session,
          //     dataStream,
          //   }),
          // },
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
                  threadId: id,
                  role: "assistant",
                  content: assistantMessage.content,
                  attachments: [],
                  parts: assistantMessage.parts ?? [],
                },
              });
            } catch (error) {
              console.log({ error });
              throw error;
            }
            // }
          },
          // experimental_telemetry: {
          //   isEnabled: isProductionEnvironment,
          //   functionId: "stream-text",
          // },
        });

        result.consumeStream();

        result.mergeIntoDataStream(dataStream, {
          sendReasoning: true,
        });
      },
      onError: () => {
        return "Oops, an error occurred!";
      },
    });

    const streamContext = getStreamContext();

    if (streamContext) {
      return new Response(
        await streamContext.resumableStream(streamId, () => stream)
      );
    } else {
      return new Response(stream);
    }
  } catch (error) {
    console.log("error");
    throw error;
  }
}

export async function GET(request: Request) {
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

  // const session = await auth();

  // if (!session?.user) {
  //   return new ChatError("unauthorized:chat").toResponse();
  // }

  let thread: Doc<"threads"> | null;

  try {
    thread = await fetchQuery(api.threads.getThreadById, { id: threadId });
  } catch {
    return new ChatError("not_found:chat").toResponse();
  }

  if (!thread) {
    return new ChatError("not_found:chat").toResponse();
  }

  // if (chat.visibility === "private" && chat.userId !== session.user.id) {
  //   return new ChatError("forbidden:chat").toResponse();
  // }

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
