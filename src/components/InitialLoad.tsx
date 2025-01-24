"use client";

import { showTagsAtom } from "@/state";
import { useAtom } from "jotai";
import { useEffect } from "react";

export const InitialLoad = ({ showTags }: { showTags: boolean }) => {
  const [, setShowTags] = useAtom(showTagsAtom);

  useEffect(() => {
    setShowTags(showTags);
  }, [setShowTags, showTags]);

  return null;
};
