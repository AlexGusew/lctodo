"use client";

import { MarkdownEditor } from "@/components/MarkdownEditor/Index";
import { TodoAutocomplete } from "@/components/Todos/TodoAutocomlete";
import { Button } from "@/components/ui/button";
import Chip from "@/components/ui/chip";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { selectedTodoAtom, selectedTodoIdAtom, todosAtom } from "@/state";
import { TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useAtom, useAtomValue, useSetAtom } from "jotai";

export const Panel = () => {
  const [todoId, setTodoId] = useAtom(selectedTodoIdAtom);
  const todo = useAtomValue(selectedTodoAtom);
  const setTodos = useSetAtom(todosAtom);

  if (!todo) return null;

  function removeTodo(id: string): void {
    setTodos((todos) => todos.filter((todo) => todo.id !== id));
  }

  return (
    <Sheet open={!!todoId} onOpenChange={() => setTodoId(null)}>
      <SheetContent
        aria-describedby="todo data"
        className="flex flex-col gap-4 overflow-x-auto"
      >
        <SheetHeader className="flex flex-col gap-4">
          <SheetTitle>
            <TodoAutocomplete todo={todo} />
          </SheetTitle>
          <div className="flex gap-2 flex-wrap">
            {!!todo.difficulty && (
              <Chip difficulty={todo.difficulty} variant="difficulty">
                {todo.difficulty}
              </Chip>
            )}
            {todo.tags.map((tag) => (
              <Chip key={tag} variant="tag">
                {tag}
              </Chip>
            ))}
          </div>
        </SheetHeader>
        <MarkdownEditor />
        <Button
          onClick={() => {
            removeTodo(todo.id);
            setTodoId(null);
          }}
          variant="link"
          className="pl-0 justify-self-start text-xs text-red-500 mt-auto self-start flex gap-2 items-center"
        >
          <TrashIcon className="size-4" /> Remove Todo
        </Button>
      </SheetContent>
    </Sheet>
  );
};
