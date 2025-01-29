import { getDailyQuestion } from "@/actions/problems";
import type { Session } from "@/app/types";
import { Actions } from "@/components/Actions";
import { InitialLoad } from "@/components/InitialLoad";
import Todo from "@/components/Todo";
import { auth } from "@/lib/auth";

export default async function Todos() {
  const session = (await auth()) as Session;

  session?.user?.todos.forEach((todo) => {
    todo.date = todo.date ? new Date(todo.date) : undefined;
  });

  const dailyQuestion = await getDailyQuestion();

  return (
    <>
      <InitialLoad showTags={session?.user?.showTags ?? false} />
      <Actions dailyQuestion={dailyQuestion ?? undefined} />
      <Todo
        todos={session?.user?.todos ?? []}
        isAuth={!!session}
        dailyQuestion={dailyQuestion ?? undefined}
      />
    </>
  );
}
