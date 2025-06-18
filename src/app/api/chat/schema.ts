import { modelKeys } from "@/lib/models/models";
import { z } from "zod";
import { zid } from "convex-helpers/server/zod";

const textPartSchema = z.object({
  text: z.string().min(1).max(2000),
  type: z.enum(["text"]),
});

export const postRequestBodySchema = z.object({
  id: z.string(),
  message: z.object({
    id: z.string(),
    createdAt: z.coerce.date(),
    role: z.enum(["user"]),
    content: z.string().min(1).max(2000),
    parts: z.array(textPartSchema),
    experimental_attachments: z
      .array(
        z.object({
          id: zid("attachments"),
          url: z.string().url(),
          name: z.string().min(1).max(2000),
          contentType: z.enum(["image/png", "image/jpg", "image/jpeg"]),
        })
      )
      .optional(),
  }),
  selectedChatModel: z.enum(modelKeys as [string, ...string[]]),
  searchEnabled: z.boolean(),
});

export type PostRequestBody = z.infer<typeof postRequestBodySchema>;
