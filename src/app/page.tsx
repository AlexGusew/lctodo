import Todo from "@/components/Todo";
import { TopBar } from "@/components/TopBar";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <TopBar />
      <div className="min-h-screen p-8 sm:pt-2 sm:p-20 font-[family-name:var(--font-inter)]">
        <main className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-10">
            <Image
              className="inline-block mr-2"
              src="/lc-logo.webp"
              width={24}
              height={24}
              alt="LeetCode logo"
            />
            LeetCode Todo
          </h1>
          <Todo />
        </main>
      </div>
    </>
  );
}
