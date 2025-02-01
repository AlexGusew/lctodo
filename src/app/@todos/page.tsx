import { getDailyQuestion } from "@/actions/problems";
import type { Question, Session } from "@/app/types";
import { Actions } from "@/components/Actions";
import { InitialLoad } from "@/components/InitialLoad";
import Todo from "@/components/Todo";
import { auth } from "@/lib/auth";

export default async function Todos() {
  const [dailyQuestion, session] = (await Promise.all([
    getDailyQuestion(),
    auth(),
  ])) as [Question, Session];

  session?.user?.todos.forEach((todo) => {
    todo.date = todo.date ? new Date(todo.date) : undefined;
  });

  return (
    <>
      <InitialLoad
        todos={session?.user?.todos}
        showTags={session?.user?.showTags}
        layout={session?.user?.layout}
      />
      <Actions dailyQuestion={dailyQuestion ?? undefined} />
      <Todo isAuth={!!session} dailyQuestion={dailyQuestion ?? undefined} />
    </>
  );
}
