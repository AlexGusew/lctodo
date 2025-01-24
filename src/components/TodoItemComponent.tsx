import { CheckCircleIcon as CheckCircleIconSolid } from "@heroicons/react/24/solid";
import { CheckCircleIcon as CheckCircleIconOutline } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/24/outline";
import TodoDatePicker from "@/components/TodoDatePicker";
import { Button } from "@/components/ui/button";
import { AutoComplete } from "@/components/Search";
import type { TodoItem } from "@/app/types";
import { getSuggestions, type ProblemDto } from "@/actions/problems";
import { useEffect, useRef, useState } from "react";
import { useDebounceValue } from "usehooks-ts";

interface TodoItemComponentProps {
  todo: TodoItem;
  toggleTodo: () => void;
  handleDateChange: (date?: Date) => void;
  addDate: (value: number) => void;
  onSetSelectedValue: (value: string) => void;
  removeTodo: () => void;
  onSetSearchValue: (value: string) => void;
}

const TodoItemComponent = ({
  todo,
  toggleTodo,
  handleDateChange,
  addDate,
  onSetSelectedValue,
  removeTodo,
  onSetSearchValue,
}: TodoItemComponentProps) => {
  const datesWrapperRef = useRef<HTMLParagraphElement>(null);
  const [selectedValue, setSelectedValue] = useState<string>("");

  const [searchValue, setSearchValue] = useState(todo.title);
  const [items, setItems] = useState<ProblemDto>([]);
  const [debSearchValue, setDebSearchValue] = useDebounceValue<string>("", 300);
  const [isLoading, setIsLoading] = useState(false);

  const _onSetSearchValue = (value: string) => {
    setSearchValue(value);
    onSetSearchValue(value);
    setDebSearchValue(value);
  };

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      const data = await getSuggestions(searchValue);
      setIsLoading(false);
      setItems(data);
    };

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debSearchValue]);

  return (
    <li className="">
      <div className="flex space-x-2">
        <Button
          variant={"ghost"}
          onClick={toggleTodo}
          disabled={!todo.title}
          size={"icon"}
          className="disabled:opacity-40 rounded-full shrink-0"
        >
          {todo.done ? (
            <CheckCircleIconSolid className="text-green-500 !size-8" />
          ) : (
            <CheckCircleIconOutline className="text-gray-500 dark:text-gray-400 !size-8" />
          )}
        </Button>
        <AutoComplete
          searchValue={searchValue}
          onSearchValueChange={_onSetSearchValue}
          items={items}
          onSelectedValueChange={(s) => {
            setSelectedValue(s);
            onSetSelectedValue(s);
          }}
          selectedValue={selectedValue}
          emptyMessage="Search by problem number or title"
          isLoading={isLoading}
        />
        <Button
          variant={"ghost"}
          size={"icon"}
          disabled={!todo.title}
          className="disabled:opacity-40 rounded-full shrink-0 size-8"
          onClick={removeTodo}
        >
          <XMarkIcon className=" dark:text-gray-400" />
        </Button>
      </div>
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
              ["+1d", 1],
              ["+1w", 7],
            ] as const
          ).map(([label, value]) => (
            <Button
              key={value}
              variant={`ghost`}
              size={"icon"}
              onClick={() => addDate(value)}
              className={
                (!todo.date ? "opacity-0 pointer-events-none" : "") + ""
              }
            >
              {label}
            </Button>
          ))}
      </p>
    </li>
  );
};

export default TodoItemComponent;
