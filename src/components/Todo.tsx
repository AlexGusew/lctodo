"use client";

import { useCallback, useEffect, useState } from "react";
import type { Question, TodoItem } from "@/app/types";
import TodoItemComponent from "@/components/TodoItemComponent";
import { saveTodo, type SuggestionDto } from "@/actions/problems";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronUpDownIcon } from "@heroicons/react/24/solid";
import { useDebouncedEffect } from "@/lib/useDebouncedEffect";
import { endOfToday, isAfter, isBefore, startOfTomorrow } from "date-fns";
import { useAtom, useAtomValue, type ExtractAtomValue } from "jotai";
import { sectionOpen } from "@/state";

interface TodoProps {
  todos?: TodoItem[];
  isAuth: boolean;
  questionsById?: Record<string, Question>;
}

const Todo = ({ todos: initialTodos = [], isAuth }: TodoProps) => {
  const [todos, setTodos] = useState<TodoItem[]>(initialTodos);
  const [sectionOpenValue, setSectionOpen] = useAtom(sectionOpen);

  const onOpenChange =
    (prop: keyof ExtractAtomValue<typeof sectionOpen>) => (isOpen: boolean) => {
      setSectionOpen((s) => ({
        ...s,
        [prop]: isOpen,
      }));
    };

  useDebouncedEffect(
    () => {
      const save = async () => {
        await saveTodo(todos);
      };
      if (isAuth) {
        save();
      }
    },
    [todos],
    2000
  );

  const addTodo = useCallback(
    async (initialItem: Partial<TodoItem> = {}) => {
      const newTodo: TodoItem = {
        id: crypto.randomUUID(),
        title: "",
        done: false,
        tags: [],
        ...initialItem,
      };

      setTodos((todos) => [...todos, newTodo]);
    },
    [setTodos]
  );

  const onSetSelectedValue =
    (id: string) => async (suggestion: SuggestionDto[number] | null) => {
      setTodos((todos) =>
        todos.map((todo) => {
          if (todo.id === id) {
            if (!suggestion) {
              return {
                ...todo,
                title: "",
                difficulty: undefined,
              };
            }
            return {
              ...todo,
              title: suggestion.label,
              difficulty: suggestion.data.difficulty,
              tags: suggestion.data.topicTags,
              titleSlug: suggestion.data.titleSlug,
              selectedProblemId: suggestion.id,
            };
          }
          return todo;
        })
      );
    };

  const onSetSearchValue = (id: string) => async (title: string) => {
    setTodos((todos) =>
      todos.map((todo) => {
        if (todo.id === id) {
          return {
            ...todo,
            title,
          };
        }
        return todo;
      })
    );
  };

  const toggleTodo = (id: string) => () => {
    setTodos((todos) => {
      const newTodos = todos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, done: !todo.done };
        }
        return todo;
      });

      return newTodos;
    });
  };

  useEffect(() => {
    if (todos.length === 0 || todos.at(-1)?.title) {
      addTodo();
    }
  }, [addTodo, todos]);

  const addDate = (id: string) => (value: number) => {
    setTodos((todos) => {
      const newTodos = todos.map((todo) => {
        if (todo.id === id && todo.date) {
          const newDate = new Date(todo.date);
          newDate.setDate(newDate.getDate() + value);
          return { ...todo, date: newDate };
        }
        return todo;
      });
      return newTodos;
    });
  };

  const handleDateChange = (id: string) => (date?: Date) => {
    setTodos((todos) => {
      const newTodos = todos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, date };
        }
        return todo;
      });
      return newTodos;
    });
  };

  /**
   * - Not done
   * - No date or date today or in past
   */
  const inProgressTodos = todos.filter(
    (todo) =>
      !todo.done && (!todo.date || isBefore(todo.date, startOfTomorrow()))
  );
  /**
   * - Date is tomorrow or later
   */
  const futureTodos = todos.filter(
    (todo) => todo.date && isAfter(todo.date, endOfToday())
  );
  /**
   * - Done
   * - Date is not set or in past
   */
  const doneTodos = todos.filter(
    (todo) =>
      todo.done && (!todo.date || isBefore(todo.date, startOfTomorrow()))
  );

  function removeTodo(id: string): void {
    setTodos((todos) => todos.filter((todo) => todo.id !== id));
  }

  const allTodos = [
    [
      inProgressTodos,
      "In Progress",
      sectionOpenValue.inProgress,
      onOpenChange("inProgress"),
    ],
    [futureTodos, "Planned", sectionOpenValue.future, onOpenChange("future")],
    [doneTodos, "Done", sectionOpenValue.done, onOpenChange("done")],
  ] as const;

  return (
    <>
      {allTodos.map(([todos, label, isOpen, onOpen]) => (
        <Collapsible open={isOpen} key={label} onOpenChange={onOpen}>
          <CollapsibleTrigger>
            <h2 className="text-lg font-bold mt-14 mb-4 flex items-center gap-2">
              {label}
              <ChevronUpDownIcon className="size-4 translate-y-[0.07rem] opacity-70" />
            </h2>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <ul className="grid grid-cols-1 gap-8">
              {todos.map((todo) => (
                <TodoItemComponent
                  key={todo.id.toString()}
                  todo={todo}
                  toggleTodo={toggleTodo(todo.id)}
                  handleDateChange={handleDateChange(todo.id)}
                  addDate={addDate(todo.id)}
                  onSetSelectedValue={onSetSelectedValue(todo.id)}
                  removeTodo={() => removeTodo(todo.id)}
                  onSetSearchValue={onSetSearchValue(todo.id)}
                />
              ))}
            </ul>
          </CollapsibleContent>
        </Collapsible>
      ))}
    </>
  );
};

export default Todo;
