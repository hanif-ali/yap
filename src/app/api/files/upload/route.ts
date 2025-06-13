import { auth } from "@clerk/nextjs/server";
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { z } from "zod";
import { generateUUID } from "@/lib/utils";
import { fetchMutation } from "convex/nextjs";
import { api } from "../../../../../convex/_generated/api";

// Use Blob instead of File since File is not available in Node.js environment
const FileSchema = z.object({
  file: z
    .instanceof(Blob)
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "File size should be less than 5MB",
    })
    // Update the file type based on the kind of files you want to accept
    .refine((file) => ["image/jpeg", "image/png"].includes(file.type), {
      message: "File type should be JPEG or PNG",
    }),
});

export async function POST(request: Request) {
  // todo fix auth
  const authData = await auth();

  if (!authData.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (request.body === null) {
    return new Response("Request body is empty", { status: 400 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as Blob;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }
    const validatedFile = FileSchema.safeParse({ file });

    if (!validatedFile.success) {
      const errorMessage = validatedFile.error.errors
        .map((error) => error.message)
        .join(", ");

      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    const originalFilename = (formData.get("file") as File).name;
    const originalFilenameWithoutExtension = originalFilename.substring(
      0,
      originalFilename.lastIndexOf(".")
    );
    const fileExtension = originalFilename.split(".").pop();
    const uniqueFilename = `${generateUUID()}-${originalFilenameWithoutExtension}.${fileExtension}`;
    const fileBuffer = await file.arrayBuffer();

    const attachmentId = await fetchMutation(api.attachments.createAttachment, {
      userId: authData.userId,
      attachmentType: file.type,
      fileName: uniqueFilename,
      mimeType: file.type,
      fileSize: file.size,
    });

    try {
      const data = await put(uniqueFilename, fileBuffer, {
        access: "public",
      });

      return NextResponse.json({ attachmentId, ...data });
    } catch (error) {
      throw error;
      return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
  } catch (error) {
    throw error;
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
