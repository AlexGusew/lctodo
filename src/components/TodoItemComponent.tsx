import { CheckCircleIcon as CheckCircleIconSolid } from "@heroicons/react/24/solid";
import {
  CheckCircleIcon as CheckCircleIconOutline,
  ChevronDoubleRightIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/24/outline";
import TodoDatePicker from "@/components/TodoDatePicker";
import { Button } from "@/components/ui/button";
import { AutoComplete } from "@/components/Search";
import type { TodoItem } from "@/app/types";
import { getSuggestions, type SuggestionDto } from "@/actions/problems";
import { useRef, useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import { useDebouncedEffect } from "@/lib/useDebouncedEffect";
import { useInitialRender } from "@/lib/useInitialRender";
import { cn } from "@/lib/utils";
import { DifficultyChip } from "@/components/ui/DifficultyChip";
import { useResponsive } from "@/lib/useResponsive";
import { useAtomValue } from "jotai";
import { showTagsAtom } from "@/state";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TodoItemComponentProps {
  todo: TodoItem;
  toggleTodo: () => void;
  handleDateChange: (date?: Date) => void;
  addDate: (value: number) => void;
  onSetSelectedValue: (value: SuggestionDto[number] | null) => void;
  removeTodo: () => void;
  onSetSearchValue: (value: string) => void;
  closeDisabled: boolean;
  showDatePicker?: boolean;
}

const TodoItemComponent = ({
  todo,
  toggleTodo,
  handleDateChange,
  addDate,
  onSetSelectedValue,
  removeTodo,
  onSetSearchValue,
  closeDisabled,
  showDatePicker = true,
}: TodoItemComponentProps) => {
  const datesWrapperRef = useRef<HTMLParagraphElement>(null);
  const { isMobile } = useResponsive();
  const [searchValue, setSearchValue] = useState(todo.title);
  const [items, setItems] = useState<SuggestionDto>([]);
  const [debSearchValue, setDebSearchValue] = useDebounceValue<string>("", 300);
  const [isLoading, setIsLoading] = useState(false);
  const initialRender = useInitialRender();
  const isShowTags = useAtomValue(showTagsAtom);

  const _onSetSearchValue = (value: string) => {
    setSearchValue(value);
    onSetSearchValue(value);
    setDebSearchValue(value);
  };

  const load = async () => {
    if (initialRender || isLoading || searchValue.length < 3) return;

    setIsLoading(true);
    const data = await getSuggestions(searchValue);
    setIsLoading(false);
    setItems(data);
  };

  useDebouncedEffect(
    () => {
      load();
    },
    [debSearchValue],
    300
  );

  const link = todo.titleSlug ? (
    <Button
      size={"icon"}
      variant={"ghost"}
      className="max-sm:h-8 flex-shrink-0"
      aria-label="Go to the problem on LeetCode"
      asChild
    >
      <a
        href={`https://leetcode.com/problems/${todo.titleSlug}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <ArrowTopRightOnSquareIcon className="size-4" />
      </a>
    </Button>
  ) : null;

  return (
    <div className="border rounded-2xl p-4">
      <div className="flex gap-2 items-center">
        <Button
          variant={"ghost"}
          onClick={toggleTodo}
          disabled={!todo.title}
          size={"icon"}
          className="disabled:opacity-40 rounded-full shrink-0"
          aria-label="Toggle done"
        >
          {todo.done ? (
            <CheckCircleIconSolid className="text-green-500 !size-6" />
          ) : (
            <CheckCircleIconOutline className="text-gray-500 dark:text-gray-400 !size-6" />
          )}
        </Button>
        <div className="w-full flex justify-start items-center">
          <AutoComplete
            searchValue={searchValue}
            onSearchValueChange={_onSetSearchValue}
            items={items}
            onSelectedValueChange={(s) => {
              onSetSelectedValue(s);
            }}
            selectedId={todo.QID}
            emptyMessage="Search by problem number, title or URL"
            isLoading={isLoading}
          />
          {!isMobile && link}
        </div>
        {!closeDisabled && (
          <Button
            variant={"ghost"}
            size={"icon"}
            className="disabled:opacity-40 shrink-0"
            onClick={removeTodo}
            aria-label="Remove problem"
          >
            <XMarkIcon />
          </Button>
        )}
      </div>
      {!!todo.difficulty && todo.tags.length && (
        <div className="flex items-center gap-2 mx-1 my-2 flex-wrap">
          {!!todo.titleSlug && isMobile && link}
          {!!todo.difficulty && <DifficultyChip difficulty={todo.difficulty} />}
          {isShowTags &&
            todo.tags?.map((tag) => (
              <span
                key={tag}
                className={cn(
                  "bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-2 rounded-full py-0.5 text-xs",
                  "flex items-center justify-center"
                )}
              >
                {tag}
              </span>
            ))}
        </div>
      )}

      {showDatePicker && (
        <p
          className="text-gray-500 dark:text-gray-400 text-sm flex flex-row space-x-1 items-center"
          ref={datesWrapperRef}
        >
          <TodoDatePicker
            selected={todo.date}
            onSelect={handleDateChange}
            datesWrapperRef={
              datesWrapperRef as React.RefObject<HTMLParagraphElement>
            }
          />
          {todo.date &&
            (
              [
                [<ChevronRightIcon key={1} />, "Delay problem for 1 day", 1],
                [
                  <ChevronDoubleRightIcon key={2} />,
                  "Delay problem for 1 week",
                  7,
                ],
              ] as const
            ).map(([icon, tooltip, value]) => (
              <Tooltip key={tooltip + value}>
                <TooltipTrigger asChild>
                  <Button
                    key={value}
                    variant={`ghost`}
                    size={"icon"}
                    onClick={() => addDate(value)}
                    aria-label={tooltip}
                  >
                    {icon}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{tooltip}</TooltipContent>
              </Tooltip>
            ))}
        </p>
      )}
    </div>
  );
};

export default TodoItemComponent;
