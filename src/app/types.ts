import type { DefaultSession } from "next-auth";

export interface Session extends DefaultSession {
  userId: string;
  user?: {
    showTags: boolean;
    todos: TodoItem[];
  } & DefaultSession["user"];
}

export interface TodoItem {
  id: string;
  title: string;
  done: boolean;
  date?: Date;
  difficulty?: Question["difficulty"];
  tags: string[];
  titleSlug?: string;
  QID?: string;
}

export interface Question {
  QID: string;
  title: string;
  titleSlug: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topicTags: string[];
}
