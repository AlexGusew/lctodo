import type { User } from "@prisma/client";

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
