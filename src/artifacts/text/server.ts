// import { smoothStream, streamText } from "ai";
import { streamText } from "ai";
import { createDocumentHandler } from "@/lib/artifacts/server";
import { google } from "@ai-sdk/google";
import { updateDocumentPrompt } from "@/lib/models/prompts";

export const textDocumentHandler = createDocumentHandler<"text">({
  kind: "text",
  onCreateDocument: async ({ title, dataStream }) => {
    let draftContent = "";

    const { fullStream } = streamText({
      // todo fix and make configurable
      model: google("gemini-2.0-flash-lite"),
      system:
        "Write about the given topic. Markdown is supported. Use headings wherever appropriate.",
      prompt: title,
    });

    for await (const delta of fullStream) {
      const { type } = delta;

      if (type === "text-delta") {
        const { textDelta } = delta;

        if (textDelta && typeof textDelta === "string") {
          draftContent += textDelta;

          dataStream.writeData({
            type: "text-delta",
            content: textDelta,
          });
        }
      }
    }

    return draftContent;
  },
  onUpdateDocument: async ({ document, description, dataStream }) => {
    let draftContent = "";

    const { fullStream } = streamText({
      model: google("gemini-2.0-flash-lite"),
      system: updateDocumentPrompt(document.content ?? "", "text"),
      prompt: description,
      // experimental_providerMetadata: {
      //   // todo what is openai doing here?
      //   openai: {
      //     prediction: {
      //       type: "content",
      //       content: document.content,
      //     },
      //   },
      // },
    });

    for await (const delta of fullStream) {
      const { type } = delta;

      if (type === "text-delta") {
        const { textDelta } = delta;

        if (textDelta && typeof textDelta === "string") {
          draftContent += textDelta;
          dataStream.writeData({
            type: "text-delta",
            content: textDelta,
          });
        }
      }
    }

    return draftContent;
  },
});
