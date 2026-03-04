"use client";

import type { TodoItem } from "@/app/types";
import {
  authUserAtom,
  disableAnimationsAtom,
  rawLayoutAtom,
  showTagsAtom,
  todosAtom,
} from "@/state";
import { Layout } from "@/generated/prisma/enums";
import { useSetAtom } from "jotai";
import { useHydrateAtoms } from "jotai/utils";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface InitialLoadProps {
  todos?: TodoItem[];
  showTags?: boolean;
  layout?: Layout;
  disableAnimations?: boolean;
  isAuth?: boolean;
  userName?: string;
}

export const InitialLoad = ({
  showTags = false,
  todos: serverTodos = [],
  layout = Layout.row,
  disableAnimations = false,
  isAuth,
  userName,
}: InitialLoadProps) => {
  const setTodos = useSetAtom(todosAtom);
  const { toast } = useToast();

  useHydrateAtoms([
    [showTagsAtom, showTags],
    [rawLayoutAtom, layout],
    [disableAnimationsAtom, disableAnimations],
    [authUserAtom, userName ?? null],
  ] as const);

  useEffect(() => {
    const rawTodos = localStorage.getItem("todos");
    if (!serverTodos.length && rawTodos && isAuth) {
      let todos: TodoItem[];
      try {
        todos = JSON.parse(rawTodos);
      } catch {
        localStorage.removeItem("todos");
        setTodos(serverTodos);
        return;
      }
      todos.forEach((todo: TodoItem) => {
        if (todo.date) {
          todo.date = new Date(todo.date);
        }
      });
      setTodos(todos);
      localStorage.removeItem("todos");
      toast({
        title: "Todos were saved",
        description: "Welcome to LC Todo!",
      });
    } else {
      setTodos(serverTodos);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuth]);

  return null;
};
