import { TodoItem } from "@/app/types";
import { atomWithToggle } from "@/lib/utils";
import { Layout } from "@prisma/client";
import { atom, type ExtractAtomValue } from "jotai";

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

  return todos.filter((todo) => {
    let isValid = true;
    if (selected.difficulty.size) {
      isValid &&= selected.difficulty.has(todo.difficulty!);
    }
    if (selected.tags.size) {
      isValid &&= !!selected.tags.intersection(new Set(todo.tags)).size;
    }
    return isValid;
  });
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
  const filtered = get(filteredTodosAtom);
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

export const selectedFiltersAtom = atom({
  tags: new Set<string>(),
  difficulty: new Set<NonNullable<TodoItem["difficulty"]>>(),
});

export const anyFilterSelectedAtom = atom((get) => {
  const selected = get(selectedFiltersAtom);
  return !!selected.difficulty.size || !!selected.tags.size;
});

export type FilterType = keyof ExtractAtomValue<typeof selectedFiltersAtom>;

export const addFilterAtom = atom(
  null,
  (get, set, filterToAdd: string, type: FilterType) => {
    const currentFilters = get(selectedFiltersAtom);
    const newSet = new Set(currentFilters[type]);
    newSet.add(filterToAdd);
    const newFilters = { ...currentFilters, [type]: newSet };
    set(selectedFiltersAtom, newFilters);
  }
);

export const removeFilterAtom = atom(
  null,
  (get, set, filterToRemove: string, type: FilterType) => {
    const currentFilters = get(selectedFiltersAtom);
    const newSet = new Set(currentFilters[type]);
    newSet.delete(filterToRemove);
    const newFilters = { ...currentFilters, [type]: newSet };
    set(selectedFiltersAtom, newFilters);
  }
);

export const resetFiltersAtom = atom(null, (_, set) => {
  set(selectedFiltersAtom, {
    tags: new Set<string>(),
    difficulty: new Set<NonNullable<TodoItem["difficulty"]>>(),
  });
});
