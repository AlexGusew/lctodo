"use server";

import type { Question, TodoItem } from "@/app/types";
import Fuse from "fuse.js";
import allQuestions from "@/../public/questions.json";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type ProblemDto = {
  value: string;
  label: string;
}[];

const fuse = new Fuse<Question>(allQuestions as Question[], {
  keys: ["QID", "title", "titleSlug", "difficulty", "topicTags"],
  shouldSort: true,
});

export async function getProblems(search: string): Promise<ProblemDto> {
  return fuse.search(search, { limit: 5 }).map((result) => ({
    value: result.item.QID,
    label: `${result.item.QID}. ${result.item.title}`,
  }));
}

export async function saveTodo(todos: TodoItem[]): Promise<void> {
  const session = await auth();

  if (!session?.user?.email) return;

  const res = await prisma.user.update({
    where: { email: session.user.email },
    data: { todos },
  });
}
