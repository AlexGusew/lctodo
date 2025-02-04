import type { GithubUser, PreparedUser, TodoItem } from "@/app/types";
import { prisma } from "@/db/prisma";
import type { User } from "@prisma/client";

export async function createGithubUser(githubUser: GithubUser) {
  return prisma.user.create({
    data: githubUser,
  });
}

export async function getUserFromGitHubId(githubUserId: User["githubId"]) {
  return prisma.user.findUnique({
    where: {
      githubId: githubUserId,
    },
  });
}

export function prepareUser(user: User): PreparedUser {
  let todos: TodoItem[] = [];

  if (Array.isArray(user.todos)) {
    todos = (user.todos as unknown as TodoItem[]).map((todo) => {
      let date = undefined;
      if (todo.date) {
        date = new Date(todo.date);
      }
      return { ...todo, date };
    });
  }

  return { ...user, todos };
}
