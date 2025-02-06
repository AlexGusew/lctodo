import { TodoItem } from "@/app/types";
import { atomWithToggle } from "@/lib/utils";
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

export const filteredTodosAtom = atom((get) => {
  const selected = get(selectedFiltersAtom);
  const todos = get(todosAtom);

  if (!selected.size) {
    return todos;
  }

  return todos.filter(
    (todo) =>
      selected.has(todo.difficulty!) ||
      selected.intersection(new Set(todo.tags)).size
  );
});

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

export const filtersAtom = atom((get) => {
  const todos = get(todosAtom);
  const selected = get(selectedFiltersAtom);

  let filtered = todos;
  if (selected.size) {
    filtered = todos.filter(
      (todo) =>
        selected.intersection(new Set(todo.tags)).size ||
        selected.has(todo.difficulty!)
    );
  }
  const acc = filtered.reduce(
    (acc, todo) => {
      todo.tags.forEach((tag) => {
        acc[0].add(tag);
      });
      acc[1].add(todo.difficulty);
      return acc;
    },
    [new Set<string>(), new Set<TodoItem["difficulty"]>()] as const
  );
  const tags = [...acc[0]];
  tags.sort();
  acc[1].delete(undefined);
  const diff = [...acc[1]] as NonNullable<TodoItem["difficulty"]>[];
  diff.sort();
  return [tags, diff] as const;
});

export const filtersOpenAtom = atomWithToggle(false);

export const selectedFiltersAtom = atom(new Set<string>());

export const addFilterAtom = atom(null, (get, set, filterToAdd: string) => {
  const currentFilters = new Set(get(selectedFiltersAtom));
  currentFilters.add(filterToAdd);
  set(selectedFiltersAtom, currentFilters);
});

export const removeFilterAtom = atom(
  null,
  (get, set, filterToRemove: string) => {
    const currentFilters = new Set(get(selectedFiltersAtom));
    currentFilters.delete(filterToRemove);
    set(selectedFiltersAtom, currentFilters);
  }
);
