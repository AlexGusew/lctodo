"use client";

import type { TodoItem } from "@/app/types";
import { atom } from "jotai";

export const showTagsAtom = atom(false);

export const sectionOpen = atom({
  done: true,
  future: true,
  inProgress: true,
});

export const todosAtom = atom<TodoItem[]>([]);

export const isDailyDoneAtom = atom(false);
