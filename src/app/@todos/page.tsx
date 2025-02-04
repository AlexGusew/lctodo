import { getDailyQuestion } from "@/actions/problems";
import { Actions } from "@/components/Actions";
import { InitialLoad } from "@/components/InitialLoad";
import Todos from "@/components/Todos";
import { getCurrentSession } from "@/lib/auth";

export default async function TodosPage() {
  const [dailyQuestion, { user, session }] = await Promise.all([
    getDailyQuestion(),
    getCurrentSession(),
  ]);

  return (
    <>
      <InitialLoad
        todos={user?.todos}
        showTags={user?.showTags}
        layout={user?.layout}
        disableAnimations={user?.disableAnimations}
      />
      <Actions dailyQuestion={dailyQuestion ?? undefined} />
      <Todos isAuth={!!session} dailyQuestion={dailyQuestion ?? undefined} />
    </>
  );
}
