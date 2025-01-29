import type { Session } from "@/app/types";
import { InitialLoad } from "@/components/InitialLoad";
import Todo from "@/components/Todo";
import { auth } from "@/lib/auth";

export default async function Todos() {
  const session = (await auth()) as Session;
  await new Promise((res) => {
    setTimeout(res, 1e3);
  });
  session?.user?.todos.forEach((todo) => {
    todo.date = todo.date ? new Date(todo.date) : undefined;
  });

  return (
    <>
      <InitialLoad showTags={session?.user?.showTags ?? false} />
      <Todo todos={session?.user?.todos ?? []} isAuth={!!session} />
    </>
  );
}
