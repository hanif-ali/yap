import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import { groq } from "@ai-sdk/groq";
import {
  appendClientMessage,
  appendResponseMessages,
  createDataStream,
  smoothStream,
  streamText,
} from "ai";
// import { auth, type UserType } from '@/app/(auth)/auth';
// import { type RequestHints, systemPrompt } from '@/lib/ai/prompts';

// import {
// createStreamId,
// deleteChatById,
// getChatById,
// getMessageCountByUserId,
// getMessagesByChatId,
// getStreamIdsByChatId,
// saveChat,
// saveMessages,
// } from "@/lib/db/queries";

// import { generateUUID, getTrailingMessageId } from "@/lib/utils";

// import { generateTitleFromUserMessage } from "../../actions";
// import { createDocument } from '@/lib/ai/tools/create-document';
// import { updateDocument } from '@/lib/ai/tools/update-document';
// import { requestSuggestions } from "@/lib/ai/tools/request-suggestions";
// import { getWeather } from '@/lib/ai/tools/get-weather';
// import { isProductionEnvironment } from '@/lib/constants';
// import { myProvider } from '@/lib/ai/providers';
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
// import { ChatSDKError } from "@/lib/errors";
// import { getThreadById } from "../../../../convex/threads";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";

import { getMessagesForThread } from "../../../../convex/messages";
import { updateDocument } from "../../../../ai-chatbot/lib/ai/tools/update-document";
import { auth } from "@clerk/nextjs/server";

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

  // todo fix auth
  // const { getToken } = await auth();
  // const token = await getToken();
  const token = undefined;

  // if (!token) {
  //   return new Response("Unauthorized", { status: 401 });
  // }

  try {
    const json = await request.json();
    requestBody = postRequestBodySchema.parse(json);
  } catch (error) {
    // return new ChatSDKError("bad_request:api").toResponse();
    throw error;
  }

  try {
    // const { id, message, selectedChatModel, selectedVisibilityType } =
    //   requestBody;
    const { id, message } = requestBody;

    // TODO: add auth, rate limiting

    // const messageCount = await getMessageCountByUserId({
    //   id: session.user.id,
    //   differenceInHours: 24,
    // });

    // if (messageCount > entitlementsByUserType[userType].maxMessagesPerDay) {
    //   return new ChatSDKError("rate_limit:chat").toResponse();
    // }

    const thread = await fetchQuery(api.threads.getThreadById, { id });

    if (!thread) {
      // TODO: handle no chat case
      //   const title = await generateTitleFromUserMessage({
      //     message,
      //   });
      //   await saveChat({
      //     id,
      //     userId: session.user.id,
      //     title,
      //     visibility: selectedVisibilityType,
      //   });
      // } else {
      //   if (chat.userId !== session.user.id) {
      //     return new ChatSDKError("forbidden:chat").toResponse();
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
          threadId: id,
          role: "user",
          content: message.content,
        },
      },
      { token }
    );

    const responseMessageId = await fetchMutation(
      api.messages.saveMessage,
      {
        message: {
          threadId: id,
          role: "assistant",
          content: "",
        },
      },
      { token }
    );

    // const streamId = generateUUID();
    // await createStreamId({ streamId, chatId: id });

    const streamId = await fetchMutation(api.streams.createStream, {
      threadId: id,
    });

    console.log({ messages });
    const stream = createDataStream({
      execute: (dataStream) => {
        const result = streamText({
          // model: groq("gemma2-9b-it"),
          model: google("gemini-2.0-flash"),
          // model: myProvider.languageModel(selectedChatModel),
          // system: systemPrompt({ selectedChatModel, requestHints }),
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
          // experimental_transform: smoothStream({ chunking: "word" }),
          // experimental_generateMessageId: generateUUID,
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
              // const assistantId = getTrailingMessageId({
              //   messages: response.messages.filter(
              //     (message) => message.role === "assistant"
              //   ),
              // });

              // if (!assistantId) {
              //   throw new Error("No assistant message found!");
              // }

              const [, assistantMessage] = appendResponseMessages({
                messages: [message],
                responseMessages: response.messages,
              });
              console.log({ responseMessageId, assistantMessage });
              await fetchMutation(api.messages.updateMessage, {
                message: {
                  id: responseMessageId,
                  content: assistantMessage.content,
                },
              });
              console.log("saved")
              //
              // await saveMessages({
              //   messages: [
              //     {
              //       id: assistantId,
              //       chatId: id,
              //       role: assistantMessage.role,
              //       parts: assistantMessage.parts,
              //       attachments:
              //         assistantMessage.experimental_attachments ?? [],
              //       createdAt: new Date(),
              //     },
              //   ],
              // });
            } catch (error) {
              console.log({error})
              throw error;
              console.error("Failed to save chat");
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

    return new Response(stream);
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
    // if (error instanceof ChatSDKError) {
    //   return error.toResponse();
    // }
  }
}
