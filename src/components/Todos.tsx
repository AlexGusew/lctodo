"use client";

import { useCallback, useEffect } from "react";
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
import {
  endOfToday,
  isAfter,
  isBefore,
  startOfToday,
  startOfTomorrow,
} from "date-fns";
import { useAtom, useAtomValue, type ExtractAtomValue } from "jotai";
import {
  disableAnimationsAtom,
  isDailyDoneAtom,
  sectionOpen,
  todosAtom,
} from "@/state";
import { TodosByDate } from "@/components/TodosByDate";
import { AnimatedItem } from "@/components/AnimatedItem";
import { AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";

interface TodoProps {
  isAuth: boolean;
  dailyQuestion?: Question;
}

const ColumnHeader = ({
  collapsed,
  label,
}: {
  collapsed: boolean;
  label: string;
}) => (
  <CollapsibleTrigger className={collapsed ? "opacity-60" : ""} asChild>
    <Button
      variant={"ghost"}
      className="font-bold text-xl mt-12 mb-4 flex items-center gap-2 p-0 hover:bg-none"
    >
      {label}
      <ChevronUpDownIcon className="size-4 translate-y-[0.07rem] opacity-70" />
    </Button>
  </CollapsibleTrigger>
);

const Todos = ({ isAuth, dailyQuestion }: TodoProps) => {
  const [todos, setTodos] = useAtom(todosAtom);
  const [sectionOpenValue, setSectionOpen] = useAtom(sectionOpen);
  const [, setIsDailyDone] = useAtom(isDailyDoneAtom);
  const disableAnimations = useAtomValue(disableAnimationsAtom);

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
              QID: suggestion.id,
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
          if (todo.QID === dailyQuestion?.QID) {
            setIsDailyDone(true);
          }
          return {
            ...todo,
            done: !todo.done,
            date: startOfToday(),
          };
        }
        return todo;
      });

      return newTodos;
    });
  };

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
    (todo) => !todo.done && todo.date && isAfter(todo.date, endOfToday())
  );

  /**
   * - Done
   */
  const doneTodos = todos.filter((todo) => todo.done);

  useEffect(() => {
    setTodos((todos) => {
      // const futureTodos = todos.filter(
      //   (todo) => todo.date && isAfter(todo.date, endOfToday())
      // );
      const inProgressTodos = todos.filter(
        (todo) =>
          !todo.done && (!todo.date || isBefore(todo.date, startOfTomorrow()))
      );
      if (inProgressTodos.length === 0 || inProgressTodos.at(-1)?.title) {
        todos = [
          ...todos,
          {
            id: crypto.randomUUID(),
            title: "",
            done: false,
            tags: [],
          },
        ];
      }
      // if (futureTodos.length === 0 || futureTodos.at(-1)?.title) {
      //   todos = [
      //     ...todos,
      //     {
      //       id: crypto.randomUUID(),
      //       title: "",
      //       done: false,
      //       tags: [],
      //       date: startOfTomorrow(),
      //     },
      //   ];
      // }
      return todos;
    });
  }, [addTodo, setTodos, todos]);

  function removeTodo(id: string): void {
    setTodos((todos) => todos.filter((todo) => todo.id !== id));
  }

  const inProgressNode = (
    <Collapsible
      open={sectionOpenValue.inProgress}
      onOpenChange={onOpenChange("inProgress")}
    >
      <ColumnHeader
        label="In Progress"
        collapsed={!sectionOpenValue.inProgress}
      />
      <CollapsibleContent>
        <ul className="grid grid-cols-1 gap-2">
          <AnimatePresence initial={false}>
            {inProgressTodos.map((todo) => (
              <AnimatedItem
                key={todo.id.toString()}
                disable={disableAnimations}
              >
                <TodoItemComponent
                  closeDisabled={
                    !todo.title &&
                    inProgressTodos.filter((todo) => !todo.title).length < 2
                  }
                  todo={todo}
                  toggleTodo={toggleTodo(todo.id)}
                  handleDateChange={handleDateChange(todo.id)}
                  addDate={addDate(todo.id)}
                  onSetSelectedValue={onSetSelectedValue(todo.id)}
                  removeTodo={() => removeTodo(todo.id)}
                  onSetSearchValue={onSetSearchValue(todo.id)}
                />
              </AnimatedItem>
            ))}
          </AnimatePresence>
        </ul>
      </CollapsibleContent>
    </Collapsible>
  );

  const futureNodes = (
    <Collapsible
      open={sectionOpenValue.future}
      onOpenChange={onOpenChange("future")}
    >
      <ColumnHeader label="Planned" collapsed={!sectionOpenValue.future} />
      <CollapsibleContent>
        <TodosByDate
          todos={futureTodos}
          renderTodo={(todo) => (
            <AnimatedItem key={todo.id.toString()} disable={disableAnimations}>
              <TodoItemComponent
                closeDisabled={
                  !todo.title &&
                  futureTodos.filter((todo) => !todo.title).length < 2
                }
                key={todo.id.toString()}
                todo={todo}
                toggleTodo={toggleTodo(todo.id)}
                handleDateChange={handleDateChange(todo.id)}
                addDate={addDate(todo.id)}
                onSetSelectedValue={onSetSelectedValue(todo.id)}
                removeTodo={() => removeTodo(todo.id)}
                onSetSearchValue={onSetSearchValue(todo.id)}
              />
            </AnimatedItem>
          )}
        />
      </CollapsibleContent>
    </Collapsible>
  );

  const doneNodes = (
    <Collapsible
      open={sectionOpenValue.done}
      onOpenChange={onOpenChange("done")}
    >
      <ColumnHeader label="Done" collapsed={!sectionOpenValue.done} />
      <CollapsibleContent>
        <TodosByDate
          todos={doneTodos}
          increasing={false}
          renderTodo={(todo) => (
            <AnimatedItem key={todo.id.toString()} disable={disableAnimations}>
              <TodoItemComponent
                closeDisabled
                showDatePicker={false}
                key={todo.id.toString()}
                todo={todo}
                toggleTodo={toggleTodo(todo.id)}
                handleDateChange={handleDateChange(todo.id)}
                addDate={addDate(todo.id)}
                onSetSelectedValue={onSetSelectedValue(todo.id)}
                removeTodo={() => removeTodo(todo.id)}
                onSetSearchValue={onSetSearchValue(todo.id)}
              />
            </AnimatedItem>
          )}
        />
      </CollapsibleContent>
    </Collapsible>
  );

  return (
    <>
      {inProgressNode}
      {futureNodes}
      {doneNodes}
    </>
  );
};

export default Todos;
