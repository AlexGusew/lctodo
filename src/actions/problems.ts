"use server";

import type { Question, TodoItem } from "@/app/types";
import Fuse from "fuse.js";
import allQuestions from "@/../public/questions.json";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cache } from "react";

const questionsById = (allQuestions as Question[]).reduce((acc, question) => {
  acc[question.QID] = question;
  return acc;
}, {} as Record<Question["QID"], Question>);

export type ProblemDto = {
  value: string;
  label: string;
}[];

const fuse = new Fuse<Question>(allQuestions as Question[], {
  keys: ["QID", "title", "titleSlug", "difficulty", "topicTags"],
  shouldSort: true,
});

export const getAllQuestions = cache(async () => questionsById);

export const getSuggestions = cache(
  async (search: string): Promise<ProblemDto> =>
    fuse.search(search, { limit: 10 }).map((result) => ({
      value: result.item.QID,
      label: `${result.item.QID}. ${result.item.title}`,
    }))
);

export async function saveTodo(todos: TodoItem[]): Promise<void> {
  const session = await auth();

  if (!session?.user?.email) return;

  const res = await prisma.user.update({
    where: { email: session.user.email },
    data: { todos },
  });
}
