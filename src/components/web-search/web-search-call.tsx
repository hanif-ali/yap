import { FileIcon, LoaderIcon, MessageIcon, PencilEditIcon } from "../icons";

export const WebSearchCall = ({
  state,
  result,
}: {
  state: "call" | "result";
  result: any[];
}) => {
	if (state === "result") {
		return (
    <div className="w-fit border py-2 px-3 rounded-xl flex flex-row items-start justify-between gap-3">
      <div className="flex flex-row gap-3 items-start">
        <div className="text-zinc-500 mt-1">
          <FileIcon />
        </div>

        <div className="text-left">Found {result.length} results on the web</div>
      </div>
    </div>
		)
	}

  return (
    <div className="w-fit border py-2 px-3 rounded-xl flex flex-row items-start justify-between gap-3">
      <div className="flex flex-row gap-3 items-start">
        <div className="text-zinc-500 mt-1">
          <FileIcon />
        </div>

        <div className="text-left">Searching the web...</div>
      </div>

      <div className="animate-spin mt-1">{<LoaderIcon />}</div>
    </div>
  );
};
