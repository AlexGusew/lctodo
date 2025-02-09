import {
  TodoItem,
  type FilterState,
  type FilterType,
  type QuestionDifficulty,
} from "@/app/types";
import { atomWithToggle } from "@/lib/utils";
import { Layout } from "@prisma/client";
import { endOfToday, isAfter, isBefore, startOfTomorrow } from "date-fns";
import { atom } from "jotai";

export const showTagsAtom = atom(false);
export const disableAnimationsAtom = atom(false);

export const sectionOpen = atom({
  done: true,
  future: true,
  inProgress: true,
});

export const todosAtom = atom<TodoItem[]>([]);

const difficultyPriority = {
  Easy: 1e1,
  Medium: 1e2,
  Hard: 1e3,
} satisfies Record<QuestionDifficulty, number>;

const filterStatePriority = {
  done: 1e3,
  future: 1e2,
  inProgress: 1e1,
} satisfies Record<FilterState, number>;

const difficultyComparator = (a: QuestionDifficulty, b: QuestionDifficulty) => {
  return difficultyPriority[a] - difficultyPriority[b];
};

const filterStateComparator = (a: FilterState, b: FilterState) => {
  return filterStatePriority[a] - filterStatePriority[b];
};

const getState = (todo: TodoItem): FilterState => {
  if (todo.done) return "done";
  if (!todo.date || isBefore(todo.date, startOfTomorrow())) return "inProgress";
  if (todo.date && isAfter(todo.date, endOfToday())) return "future";
  return "inProgress";
};

export const filteredTodosAtom = atom((get) => {
  const selected = get(selectedFiltersAtom);
  const todos = get(todosAtom);

  return todos.filter((todo) => {
    let isValid = true;

    if (selected.difficulty.size) {
      isValid &&=
        selected.difficulty.intersection(new Set([todo.difficulty])).size ===
        selected.difficulty.size;
    }
    if (selected.tags.size) {
      isValid &&=
        selected.tags.intersection(new Set(todo.tags)).size ===
        selected.tags.size;
    }
    if (selected.state.size) {
      const state = getState(todo);
      isValid &&=
        selected.state.intersection(new Set([state])).size ===
        selected.state.size;
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
      acc[2].add(getState(todo));
      return acc;
    },
    [
      new Set<string>(),
      new Set<TodoItem["difficulty"]>(),
      new Set<FilterState>(),
    ] as const
  );
  acc[1].delete(undefined);

  const tags = [...acc[0]];
  const diff = [...acc[1]] as NonNullable<TodoItem["difficulty"]>[];
  const state = [...acc[2]];

  tags.sort();
  diff.sort(difficultyComparator);
  state.sort(filterStateComparator);

  return [tags, diff, state] as const;
});

export const filtersOpenAtom = atomWithToggle(false);

export const selectedFiltersAtom = atom({
  tags: new Set<string>(),
  difficulty: new Set<NonNullable<TodoItem["difficulty"]>>(),
  state: new Set<FilterState>(),
});

export const anyFilterSelectedAtom = atom((get) => {
  const selected = get(selectedFiltersAtom);
  return (
    !!selected.difficulty.size || !!selected.tags.size || !!selected.state.size
  );
});

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
    state: new Set<FilterState>(),
  });
});
