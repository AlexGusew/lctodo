import { TopBar } from "@/components/TopBar";
import Image from "next/image";

export default async function Home() {
  return (
    <div className="flex items-center justify-between align-middle mt-4 mb-8 max-sm:mt-0">
      <h1 className="inline-block">
        <Image
          className="inline-block mr-2"
          src="/logo.svg"
          width={20}
          height={20}
          alt="LeetCode logo"
        />
        Lc Todo
      </h1>
      <TopBar />
    </div>
  );
}
