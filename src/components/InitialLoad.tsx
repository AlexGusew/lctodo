"use client";

import type { TodoItem } from "@/app/types";
import { layoutAtom, showTagsAtom, todosAtom } from "@/state";
import { Layout } from "@prisma/client";
import { useHydrateAtoms } from "jotai/utils";

interface InitialLoadProps {
  todos?: TodoItem[];
  showTags?: boolean;
  layout?: Layout;
}

export const InitialLoad = ({
  showTags = false,
  todos = [],
  layout = Layout.row,
}: InitialLoadProps) => {
  useHydrateAtoms([
    [todosAtom, todos],
    [showTagsAtom, showTags],
    [layoutAtom, layout],
  ] as const);

  return null;
};
