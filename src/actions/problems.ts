"use server";

import type { Question } from "@/app/types";
import Fuse from "fuse.js";
import allQuestions from "@/../public/questions.json";

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
