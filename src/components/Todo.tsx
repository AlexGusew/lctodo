"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CheckCircleIcon as CheckCircleIconSolid } from "@heroicons/react/24/solid";
import { CheckCircleIcon as CheckCircleIconOutline } from "@heroicons/react/24/outline";
import TodoDatePicker from "@/components/TodoDatePicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TodoItem {
  id: string;
  title: string;
  done: boolean;
  date?: Date;
  changing: boolean;
}

const Todo = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const datesWrapperRef = useRef<HTMLParagraphElement>(null);

  const addTodo = useCallback((initialItem: Partial<TodoItem> = {}) => {
    const newTodo: TodoItem = {
      id: crypto.randomUUID(),
      title: "",
      done: false,
      changing: false,
      ...initialItem,
    };
    setTodos((todos) => [...todos, newTodo]);
  }, []);

  const changeTodo = (id: string, title: string) => {
    setTodos(
      todos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, title };
        }
        return todo;
      })
    );
  };
  const toggleChangeTodo = (id: string) => {
    setTodos((todos) =>
      todos.map((todo) =>
        todo.id === id ? { ...todo, changing: !todo.changing } : todo
      )
    );
    const anyChanging = todos.some((todo) => {
      if (todo.id === id) {
        return !todo.changing;
      }

      return todo.changing;
    });

    if (!anyChanging && todos[todos.length - 1].title) {
      addTodo({ changing: true });
    }
  };

  const toggleTodo = (id: string) => {
    setTodos((todos) => {
      const newTodos = todos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, done: !todo.done };
        }
        return todo;
      });
      newTodos.sort((a, b) => {
        if (!a.title) {
          return 1;
        }
        if (!b.title) {
          return -1;
        }
        if (a.done && !b.done) {
          return 1;
        }
        if (!a.done && b.done) {
          return -1;
        }
        return 0;
      });
      return newTodos;
    });
  };
  console.log(todos);
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

  useEffect(() => {
    if (todos.length === 0) {
      addTodo({ changing: true });
    }
  }, [addTodo, todos.length]);

  function addDate(id: string, value: number): void {
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
  }

  return (
    <>
      <ul className="grid grid-cols-1 gap-4">
        {todos.map((todo) => (
          <li key={todo.id.toString()} className="">
            <div className="flex space-x-2">
              <Button
                variant={"ghost"}
                onClick={() => toggleTodo(todo.id)}
                disabled={!todo.title}
                size={"icon"}
                className="disabled:opacity-40 rounded-full"
              >
                {todo.done ? (
                  <CheckCircleIconSolid className="text-green-500 !size-8" />
                ) : (
                  <CheckCircleIconOutline className="text-gray-500 dark:text-gray-400 !size-8" />
                )}
              </Button>
              {todo.changing ? (
                <form
                  className="w-full"
                  onSubmit={(e) => {
                    e.preventDefault();
                    toggleChangeTodo(todo.id);
                  }}
                >
                  <Input
                    placeholder="Problem number or link"
                    onFocus={(e) => e.target.select()}
                    type="text"
                    value={todo.title}
                    onBlur={() => toggleChangeTodo(todo.id)}
                    onChange={(e) => changeTodo(todo.id, e.target.value)}
                    className="border-none !ring-0 !text-base"
                    autoFocus
                  />
                </form>
              ) : (
                <p
                  tabIndex={0}
                  onKeyUp={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      toggleChangeTodo(todo.id);
                    }
                  }}
                  onClick={() => toggleChangeTodo(todo.id)}
                  className={`w-full text-black dark:text-white px-3 py-1 [transform:translateY(0.15rem)] cursor-pointer !text-base ${
                    !todo.title ? "opacity-40" : ""
                  }`}
                >
                  {todo.title || "Problem number or link"}
                </p>
              )}
            </div>
            <p
              className="text-gray-500 dark:text-gray-400 text-sm flex flex-row space-x-1 items-center"
              ref={datesWrapperRef}
            >
              <TodoDatePicker
                selected={todo.date}
                onSelect={handleDateChange(todo.id)}
                datesWrapperRef={
                  datesWrapperRef as React.RefObject<HTMLParagraphElement>
                }
              />
              {(
                [
                  ["+1d", 1],
                  ["+3d", 3],
                  ["+1w", 7],
                ] as const
              ).map(([label, value]) => (
                <Button
                  key={value}
                  variant={`outline`}
                  size={"sm"}
                  onClick={() => addDate(todo.id, value)}
                  className={!todo.date ? "opacity-0 pointer-events-none" : ""}
                >
                  {label}
                </Button>
              ))}
            </p>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Todo;
