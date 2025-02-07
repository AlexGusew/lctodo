import { getDailyQuestion } from "@/actions/problems";
import { Actions } from "@/components/Actions";
import { InitialLoad } from "@/components/InitialLoad";
import { ResponsiveLayout } from "@/components/ResponsiveLayout";
import Todos from "@/components/Todos";
import { TodosLayout } from "@/components/TodosLayout";
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
        isAuth={!!session}
      />
      <ResponsiveLayout>
        <Actions dailyQuestion={dailyQuestion ?? undefined} />
        <TodosLayout>
          <Todos
            isAuth={!!session}
            dailyQuestion={dailyQuestion ?? undefined}
          />
        </TodosLayout>
      </ResponsiveLayout>
    </>
  );
}
