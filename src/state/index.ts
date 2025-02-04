import { TodoItem } from "@/app/types";
import { Layout } from "@prisma/client";
import { atom } from "jotai";

export const showTagsAtom = atom(false);
export const disableAnimationsAtom = atom(false);

export const sectionOpen = atom({
  done: true,
  future: true,
  inProgress: true,
});

export const todosAtom = atom<TodoItem[]>([]);

export const isDailyDoneAtom = atom(false);

/**
 * col - 1 column
 * row - 1 row
 */
export const rawLayoutAtom = atom<Layout>(Layout.row);

export const layoutAtom = atom(
  (get) => get(rawLayoutAtom),
  (get, set) => {
    const cur = get(rawLayoutAtom);
    const newLayout = {
      [Layout.col]: Layout.row,
      [Layout.row]: Layout.col,
    }[cur];
    set(rawLayoutAtom, newLayout);
    return newLayout;
  }
);
