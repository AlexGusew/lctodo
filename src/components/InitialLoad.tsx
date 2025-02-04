"use client";

import type { TodoItem } from "@/app/types";
import { prepareUser } from "@/db/User";
import {
  disableAnimationsAtom,
  rawLayoutAtom,
  showTagsAtom,
  todosAtom,
} from "@/state";
import { Layout } from "@prisma/client";
import { useSetAtom } from "jotai";
import { useHydrateAtoms } from "jotai/utils";
import { useEffect } from "react";

interface InitialLoadProps {
  todos?: TodoItem[];
  showTags?: boolean;
  layout?: Layout;
  disableAnimations?: boolean;
}

export const InitialLoad = ({
  showTags = false,
  todos: serverTodos = [],
  layout = Layout.row,
  disableAnimations = false,
}: InitialLoadProps) => {
  const setTodos = useSetAtom(todosAtom);

  useHydrateAtoms([
    [showTagsAtom, showTags],
    [rawLayoutAtom, layout],
    [disableAnimationsAtom, disableAnimations],
  ] as const);

  useEffect(() => {
    const rawTodos = localStorage.getItem("todos");
    if (!serverTodos.length && rawTodos) {
      const todos = JSON.parse(rawTodos);
      todos.forEach((todo: TodoItem) => {
        if (todo.date) {
          todo.date = new Date(todo.date);
        }
      });
      setTodos(todos);
      localStorage.removeItem("todos");
    } else {
      setTodos(serverTodos);
    }
  }, []);

  return null;
};
