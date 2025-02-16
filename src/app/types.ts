import type { selectedFiltersAtom } from "@/state";
import type { User } from "@prisma/client";
import type { ExtractAtomValue } from "jotai";

export interface TodoItem {
  id: string;
  title: string;
  done: boolean;
  date?: Date;
  difficulty?: Question["difficulty"];
  tags: string[];
  titleSlug?: string;
  QID?: string;
  description: string;
}

export interface Question {
  QID: string;
  title: string;
  titleSlug: string;
  difficulty: QuestionDifficulty;
  topicTags: string[];
}

export type FilterType = keyof ExtractAtomValue<typeof selectedFiltersAtom>;
export type FilterState = "done" | "future" | "inProgress";
export type QuestionDifficulty = "Easy" | "Medium" | "Hard";

export type GithubUser = Pick<
  User,
  | "githubId"
  | "githubAvatarUrl"
  | "githubEmail"
  | "githubName"
  | "githubUsername"
>;

export interface PreparedUser extends Omit<User, "todos"> {
  todos: TodoItem[];
}
