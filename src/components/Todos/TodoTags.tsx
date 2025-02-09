import type { FilterType, TodoItem } from "@/app/types";
import Chip from "@/components/ui/chip";
import {
  addFilterAtom,
  removeFilterAtom,
  selectedFiltersAtom,
  showTagsAtom,
} from "@/state";
import { useAtomValue, useSetAtom } from "jotai";
import type { FC } from "react";

interface TodoTagsProps {
  todo: TodoItem;
}

export const TodoTags: FC<TodoTagsProps> = ({ todo }) => {
  const isShowTags = useAtomValue(showTagsAtom);
  const selectedFilters = useAtomValue(selectedFiltersAtom);
  const addFilter = useSetAtom(addFilterAtom);
  const removeFilter = useSetAtom(removeFilterAtom);

  const onClick =
    <T extends FilterType>(value: string, type: T) =>
    () => {
      if ((selectedFilters[type] as Set<string>).has(value)) {
        removeFilter(value, type);
      } else {
        addFilter(value, type);
      }
    };

  const isOutline = (value: string, type: FilterType) =>
    (selectedFilters[type] as Set<string>).has(value) ? "selected" : undefined;

  return (
    <>
      {!!todo.difficulty && (
        <Chip
          outline={isOutline(todo.difficulty, "difficulty")}
          difficulty={todo.difficulty}
          variant="difficulty"
          onClick={onClick(todo.difficulty, "difficulty")}
          button
        >
          {todo.difficulty}
        </Chip>
      )}
      {isShowTags &&
        todo.tags?.map((tag) => (
          <Chip
            key={tag}
            outline={isOutline(tag, "tags")}
            variant="tag"
            onClick={onClick(tag, "tags")}
            button
          >
            {tag}
          </Chip>
        ))}
    </>
  );
};
