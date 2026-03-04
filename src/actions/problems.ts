"use server";

import type { Question, TodoItem } from "@/app/types";
import Fuse, { type FuseResult } from "fuse.js";
import allQuestions from "@/../public/questions.json";
import { prisma } from "@/db/prisma";
import { cache } from "react";
import type { Layout, Prisma } from "@/generated/prisma/client";
import { get } from "@vercel/edge-config";
import { getCurrentSession } from "@/lib/auth";

const questionsById = (allQuestions as Question[]).reduce((acc, question) => {
  acc[question.QID] = question;
  return acc;
}, {} as Record<Question["QID"], Question>);

export type SuggestionDto = {
  data: Question;
  label: string;
  id: string;
}[];

const fuse = new Fuse<Question>(allQuestions as Question[], {
  keys: [
    { name: "QID", weight: 1 },
    { name: "title", weight: 0.5 },
    { name: "titleSlug", weight: 0.5 },
    { name: "difficulty", weight: 0.5 },
    { name: "topicTags", weight: 0.5 },
    {
      name: "fullName",
      getFn: (q) => `${q.QID}. ${q.title}`,
      weight: 0.5,
    },
  ],
  shouldSort: true,
});

export const getAllQuestions = cache(async () => questionsById);

export const getSuggestions = cache(
  async (search: string): Promise<SuggestionDto> => {
    search = search.trim();
    let searchResult: FuseResult<Question>[] = [];

    /* Optimize search by URL. To make it faster, search by exact path, not whole URL */
    if (search.startsWith("https://")) {
      const url = new URL(search);
      const path = url.pathname;
      const questionPath = path.split("/")[2];
      searchResult = await fuse.search(questionPath, { limit: 10 });
    }
    if (!searchResult || !searchResult.length) {
      searchResult = fuse.search(search, { limit: 10 });
    }
    return searchResult.map((result) => ({
      id: result.item.QID,
      label: `${result.item.QID}. ${result.item.title}`,
      data: result.item,
    }));
  }
);

export async function saveTodo(
  todos: TodoItem[]
): Promise<{ error: string } | undefined> {
  try {
    if (!Array.isArray(todos)) {
      return { error: "Invalid todos data" };
    }
    const { user } = await getCurrentSession();
    if (!user) return { error: "Not authenticated" };

    await prisma.user.update({
      where: { id: user.id },
      data: { todos: todos as unknown as Prisma.JsonArray },
    });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to save todos" };
  }
}

export async function changeShowTags(
  showTags: boolean
): Promise<{ error: string } | undefined> {
  try {
    const { user } = await getCurrentSession();
    if (!user) return { error: "Not authenticated" };

    await prisma.user.update({
      where: { id: user.id },
      data: { showTags },
    });
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : "Failed to update show tags",
    };
  }
}

export async function changeLayout(
  layout: Layout
): Promise<{ error: string } | undefined> {
  try {
    const { user } = await getCurrentSession();
    if (!user) return { error: "Not authenticated" };

    await prisma.user.update({
      where: { id: user.id },
      data: { layout },
    });
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : "Failed to update layout",
    };
  }
}

export async function getDailyQuestion() {
  const QID = await get<string>("dailyQID");
  if (!QID) return null;
  return questionsById[QID] ?? null;
}

export async function changeDisableAnimations(
  disableAnimations: boolean
): Promise<{ error: string } | undefined> {
  try {
    const { user } = await getCurrentSession();
    if (!user) return { error: "Not authenticated" };

    await prisma.user.update({
      where: { id: user.id },
      data: { disableAnimations },
    });
  } catch (e) {
    return {
      error:
        e instanceof Error ? e.message : "Failed to update animation settings",
    };
  }
}
