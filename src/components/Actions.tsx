"use client";

import type { Question, TodoItem } from "@/app/types";
import { BoardSettings } from "@/components/BoardSettings";
import { ResponsiveLayout } from "@/components/ResponsiveLayout";
import { Button } from "@/components/ui/button";
import { isDailyDoneAtom, todosAtom } from "@/state";
import { FireIcon as FilledFireIcon } from "@heroicons/react/24/solid";
import { startOfToday } from "date-fns";
import { useAtom, useAtomValue } from "jotai";

interface ActionsProps {
  dailyQuestion?: Question;
}

export const Actions = ({ dailyQuestion }: ActionsProps) => {
  const [, setTodos] = useAtom(todosAtom);
  const isDailyDone = useAtomValue(isDailyDoneAtom);

  const onClick = () => {
    if (!dailyQuestion) return;
    const newTodo = {
      id: crypto.randomUUID(),
      done: false,
      date: startOfToday(),
      title: dailyQuestion.title,
      tags: dailyQuestion.topicTags,
      difficulty: dailyQuestion.difficulty,
      QID: dailyQuestion.QID,
      titleSlug: dailyQuestion.titleSlug,
    } satisfies TodoItem;
    setTodos((todos) => [newTodo, ...todos]);
  };

  return (
    <ResponsiveLayout>
      <div className="flex justify-end">
        <BoardSettings />
        <Button className="ml-auto" variant={"outline"} onClick={onClick}>
          Add daily
          <FilledFireIcon
            className={`transition-all ${
              isDailyDone
                ? "animate-bounce animate-custom-bounce fill-orange-500"
                : "opacity-50"
            }`}
          />
        </Button>
      </div>
    </ResponsiveLayout>
  );
};
