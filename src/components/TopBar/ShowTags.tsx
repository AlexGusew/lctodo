"use client";

import { showTagsAtom } from "@/state";
import { useAtom } from "jotai";
import { CheckIcon } from "@heroicons/react/24/outline";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { changeShowTags } from "@/actions/problems";

export const ShowTags = () => {
  const [isShowTags, setShowTags] = useAtom(showTagsAtom);
  console.log({ isShowTags });

  return (
    <DropdownMenuItem
      onClick={async () => {
        setShowTags((isShown) => !isShown);
        await changeShowTags(!isShowTags);
      }}
    >
      Show tags
      {isShowTags && <CheckIcon className="ml-auto" />}
    </DropdownMenuItem>
  );
};
