"use server";

import type { Question, TodoItem } from "@/app/types";
import Fuse from "fuse.js";
import allQuestions from "@/../public/questions.json";
import { neon } from "@neondatabase/serverless";

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

export async function getAllTodos(): Promise<TodoItem[]> {
  // Connect to the Neon database
  const sql = neon(process.env.DATABASE_URL as string);
  // Insert the comment from the form into the Postgres database
  const data = await sql("SELECT * FROM TodoList");
  return (data?.[0]?.todos ?? []) as TodoItem[];
}

export async function saveTodo(todos: TodoItem[]): Promise<void> {
  const sql = neon(process.env.DATABASE_URL as string);
  console.log("123", JSON.stringify(todos), null, 2);

  const data = await sql(
    `SELECT upsert_todos('${JSON.stringify(todos)}'::jsonb)`
  );
  console.log(data);
}
