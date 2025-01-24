import type { Session } from "@/app/types";
import { Footer } from "@/components/Footer";
import { InitialLoad } from "@/components/InitialLoad";
import Todo from "@/components/Todo";
import { TopBar } from "@/components/TopBar";
import { auth } from "@/lib/auth";
import Image from "next/image";

export default async function Home() {
  const session = (await auth()) as Session;
  console.log({ session });

  session?.user?.todos.forEach((todo) => {
    todo.date = todo.date ? new Date(todo.date) : undefined;
  });

  return (
    <>
      <InitialLoad showTags={session.user?.showTags ?? false} />
      <div className="min-h-screen p-8 sm:pt-2 sm:p-20 font-[family-name:var(--font-inter)]">
        <main className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between align-middle mb-10 mt-4">
            <h1 className="inline-block">
              <Image
                className="inline-block mr-2"
                src="/lc-logo.webp"
                width={24}
                height={24}
                alt="LeetCode logo"
              />
              LcTodo
            </h1>
            <TopBar />
          </div>
          <Todo todos={session?.user?.todos} isAuth={!!session} />
        </main>
      </div>
      <hr className="mb-2" />
      <Footer />
    </>
  );
}
