"use client";

import { useCallback, type PropsWithChildren } from "react";
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
import {
  useAtom,
  useAtomValue,
  useSetAtom,
  type ExtractAtomValue,
} from "jotai";
import {
  disableAnimationsAtom,
  filteredTodosAtom,
  isDailyDoneAtom,
  sectionOpen,
  todosAtom,
} from "@/state";
import { TodosByDate } from "@/components/TodosByDate";
import { AnimatedItem } from "@/components/AnimatedItem";
import { AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { HashtagIcon, PlusIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import { useColumnLayout } from "@/lib/useColumnLayout";
import { useResponsive } from "@/lib/useResponsive";

interface TodoProps {
  isAuth: boolean;
  dailyQuestion?: Question;
}

const ColumnHeader = ({
  collapsed,
  label,
  amount,
  children,
}: PropsWithChildren<{
  collapsed: boolean;
  label: string;
  amount: number;
}>) => {
  const isColumnLayout = useColumnLayout();

  const header = (
    <div
      className={`flex items-center gap-2 mb-4 ${
        collapsed && isColumnLayout ? "[writing-mode:vertical-lr]" : ""
      }`}
    >
      <CollapsibleTrigger className={cn({ "opacity-60": collapsed })} asChild>
        <Button
          variant={"ghost"}
          className="font-bold text-xl flex items-center gap-3 p-0 hover:bg-[none] [justify-content:flex-start]"
        >
          <ChevronUpDownIcon
            className={`size-4 -mr-2 opacity-70 ${
              collapsed ? "" : "scale-110"
            }`}
          />
          {label}
          <span className="text-[0.7rem] ml-[-0.4rem] flex items-center opacity-60 translate-y-[4px] w-8">
            <HashtagIcon className="!size-3" />
            <span className="font-normal ml-0">{amount}</span>
          </span>
        </Button>
      </CollapsibleTrigger>
      {children}
    </div>
  );
  return header;
};

const AddTodo = ({ onClick }: { onClick: () => void }) => {
  const { isMobile } = useResponsive();
  return (
    <Button
      variant={isMobile ? "outline" : "ghost"}
      className={isMobile ? "ml-auto" : ""}
      size="icon"
      onClick={onClick}
    >
      <PlusIcon />
    </Button>
  );
};

const Todos = ({ isAuth, dailyQuestion }: TodoProps) => {
  const filteredTodos = useAtomValue(filteredTodosAtom);
  const allTodos = useAtomValue(todosAtom);
  const setTodos = useSetAtom(todosAtom);
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
        await saveTodo(allTodos);
      };
      if (isAuth) {
        save();
      }
    },
    [allTodos],
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

      setTodos((todos) => [newTodo, ...todos]);
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
  const inProgressTodos = filteredTodos.filter(
    (todo) =>
      !todo.done && (!todo.date || isBefore(todo.date, startOfTomorrow()))
  );
  /**
   * - Date is tomorrow or later
   */
  const futureTodos = filteredTodos.filter(
    (todo) => !todo.done && todo.date && isAfter(todo.date, endOfToday())
  );

  /**
   * - Done
   */
  const doneTodos = filteredTodos.filter((todo) => todo.done);

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
        amount={inProgressTodos.length}
      >
        {sectionOpenValue.inProgress && (
          <AddTodo onClick={() => addTodo({ date: startOfToday() })} />
        )}
      </ColumnHeader>
      <CollapsibleContent>
        <ul
          className={`${
            inProgressTodos.length ? "grid" : ""
          } grid-cols-1 gap-2`}
        >
          <AnimatePresence initial={false}>
            {inProgressTodos.map((todo) => (
              <AnimatedItem
                key={todo.id.toString()}
                disable={disableAnimations}
              >
                <TodoItemComponent
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
      <ColumnHeader
        label="Planned"
        collapsed={!sectionOpenValue.future}
        amount={futureTodos.length}
      >
        {sectionOpenValue.future && (
          <AddTodo onClick={() => addTodo({ date: startOfTomorrow() })} />
        )}
      </ColumnHeader>
      <CollapsibleContent>
        <TodosByDate
          todos={futureTodos}
          renderTodo={(todo) => (
            <AnimatedItem key={todo.id.toString()} disable={disableAnimations}>
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
      <ColumnHeader
        label="Done"
        collapsed={!sectionOpenValue.done}
        amount={doneTodos.length}
      />
      <CollapsibleContent>
        <TodosByDate
          todos={doneTodos}
          increasing={false}
          renderTodo={(todo) => (
            <AnimatedItem key={todo.id.toString()} disable={disableAnimations}>
              <TodoItemComponent
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
