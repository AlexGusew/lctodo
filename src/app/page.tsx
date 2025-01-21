import Todo from "@/components/Todo";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-inter)]">
      <main className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-10">
          <Image
            className="inline-block mr-2"
            src="/lc-logo.webp"
            width={24}
            height={24}
            alt="LeetCode logo"
          />
          LcTodo
        </h1>
        <Todo />
      </main>
    </div>
  );
}
