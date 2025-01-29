import { TopBar } from "@/components/TopBar";
import Image from "next/image";

export default async function Home() {
  return (
    <div className="flex items-center justify-between align-middle mt-4 max-sm:mb-[-20] max-sm:mt-0">
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
  );
}
