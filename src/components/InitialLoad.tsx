"use client";

import type { TodoItem } from "@/app/types";
import {
  disableAnimationsAtom,
  rawLayoutAtom,
  showTagsAtom,
  todosAtom,
} from "@/state";
import { Layout } from "@prisma/client";
import { useHydrateAtoms } from "jotai/utils";

interface InitialLoadProps {
  todos?: TodoItem[];
  showTags?: boolean;
  layout?: Layout;
  disableAnimations?: boolean;
}

export const InitialLoad = ({
  showTags = false,
  todos = [],
  layout = Layout.row,
  disableAnimations = false,
}: InitialLoadProps) => {
  useHydrateAtoms([
    [todosAtom, todos],
    [showTagsAtom, showTags],
    [rawLayoutAtom, layout],
    [disableAnimationsAtom, disableAnimations],
  ] as const);

  return null;
};
