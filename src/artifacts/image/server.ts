import { createDocumentHandler } from "@/lib/artifacts/server";
import { xai } from "@ai-sdk/xai";
import { customProvider, experimental_generateImage } from "ai";

export const imageDocumentHandler = createDocumentHandler<"image">({
  kind: "image",
  onCreateDocument: async ({ title, dataStream }) => {
    let draftContent = "";

    const { image } = await experimental_generateImage({
      // todo fix and make configurable
      model: xai.image("grok-2-image"),
      prompt: title,
      n: 1,
    });

    draftContent = image.base64;

    dataStream.writeData({
      type: "image-delta",
      content: image.base64,
    });

    return draftContent;
  },
  onUpdateDocument: async ({ description, dataStream }) => {
    let draftContent = "";

    const { image } = await experimental_generateImage({
      model: xai.image("grok-2-image"),
      prompt: description,
      n: 1,
    });

    draftContent = image.base64;

    dataStream.writeData({
      type: "image-delta",
      content: image.base64,
    });

    return draftContent;
  },
});
