"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef } from "react";
import { artifactDefinitions, ArtifactKind } from "./artifact";
import { initialArtifactData, useArtifact } from "@/hooks/use-artifact";

const ARTIFACT_DELTA_TYPES = [
  "text-delta",
  "code-delta",
  "sheet-delta",
  "image-delta",
  "title",
  "id",
  "clear",
  "finish",
  "kind",
];

export type DataStreamDelta = {
  type:
    | "text-delta"
    | "code-delta"
    | "sheet-delta"
    | "image-delta"
    | "title"
    | "id"
    | "clear"
    | "finish"
    | "kind"
    | "remaining-tokens";
  content: string;
};

export function DataStreamHandler({ id }: { id: string }) {
  const { data: dataStream } = useChat({ id });
  const { artifact, setArtifact, setMetadata } = useArtifact();
  const lastProcessedIndex = useRef(-1);

  useEffect(() => {
    if (!dataStream?.length) return;

    const newDeltas = dataStream.slice(lastProcessedIndex.current + 1);
    lastProcessedIndex.current = dataStream.length - 1;

    (newDeltas as DataStreamDelta[]).forEach((delta: DataStreamDelta) => {
      if (!ARTIFACT_DELTA_TYPES.includes(delta.type)) {
        return;
      }

      const artifactDefinition = artifactDefinitions.find(
        (artifactDefinition) => artifactDefinition.kind === artifact.kind
      );

      if (artifactDefinition?.onStreamPart) {
        artifactDefinition.onStreamPart({
          streamPart: delta,
          setArtifact,
          setMetadata,
        });
      }

      setArtifact((draftArtifact) => {
        if (!draftArtifact) {
          return {
            ...initialArtifactData,
            status: "streaming",
            isVisible: true,
          };
        }

        switch (delta.type) {
          case "id":
            return {
              ...draftArtifact,
              documentId: delta.content as string,
              status: "streaming",
              isVisible: true,
            };

          case "title":
            return {
              ...draftArtifact,
              title: delta.content as string,
              status: "streaming",
              isVisible: true,
            };

          case "kind":
            return {
              ...draftArtifact,
              kind: delta.content as ArtifactKind,
              status: "streaming",
              isVisible: true,
            };

          case "clear":
            return {
              ...draftArtifact,
              content: "",
              status: "streaming",
              isVisible: true,
            };

          case "finish":
            return {
              ...draftArtifact,
              status: "idle",
            };

          default:
            return draftArtifact;
        }
      });
    });
  }, [dataStream, setArtifact, setMetadata, artifact.kind]);

  return null;
}
