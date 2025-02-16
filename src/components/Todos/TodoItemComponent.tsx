import { CheckCircleIcon as CheckCircleIconSolid } from "@heroicons/react/24/solid";
import {
  CheckCircleIcon as CheckCircleIconOutline,
  ChevronDoubleRightIcon,
  ChevronRightIcon,
  EllipsisHorizontalCircleIcon,
} from "@heroicons/react/24/outline";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import TodoDatePicker from "@/components/TodoDatePicker";
import { Button } from "@/components/ui/button";
import type { TodoItem } from "@/app/types";
import { useRef } from "react";
import { useResponsive } from "@/lib/useResponsive";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TodoTags } from "@/components/Todos/TodoTags";
import { TodoAutocomplete } from "@/components/Todos/TodoAutocomlete";

interface TodoItemComponentProps {
  todo: TodoItem;
  toggleTodo: () => void;
  handleDateChange: (date?: Date) => void;
  addDate: (value: number) => void;
  showDatePicker?: boolean;
  openPanel: () => void;
}

const TodoItemComponent = ({
  todo,
  toggleTodo,
  handleDateChange,
  addDate,
  openPanel,
  showDatePicker = true,
}: TodoItemComponentProps) => {
  const datesWrapperRef = useRef<HTMLParagraphElement>(null);
  const { isMobile } = useResponsive();

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
          <TodoAutocomplete todo={todo} />
          {!isMobile && link}
        </div>
        <Button
          variant={"ghost"}
          size={"icon"}
          className="shrink-0"
          onClick={openPanel}
          aria-label="Open todo data"
        >
          <EllipsisHorizontalCircleIcon />
        </Button>
        {/* <Button
          variant={"ghost"}
          size={"icon"}
          className="disabled:opacity-40 shrink-0"
          onClick={removeTodo}
          aria-label="Remove problem"
        >
          <XMarkIcon />
        </Button> */}
      </div>
      {(!!todo.difficulty || !!todo.tags.length) && (
        <div className="flex items-center gap-2 mx-1 my-2 flex-wrap">
          {!!todo.titleSlug && isMobile && link}
          <TodoTags todo={todo} />
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
