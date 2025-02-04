import { ResponsiveLayout } from "@/components/ResponsiveLayout";
import { TopBar } from "@/components/TopBar";
import Image from "next/image";

export default async function Home() {
  return (
    <ResponsiveLayout>
      <div className="flex items-center justify-between align-middle mt-4 mb-8 max-sm:mt-0">
        <h1 className="inline-block">
          <Image
            className="inline-block mr-2 h-[revert-layer]"
            src="/logo-dark.svg"
            width={20}
            height={20}
            alt="LeetCode logo"
          />
          LC Todo
        </h1>
        <TopBar />
      </div>
    </ResponsiveLayout>
  );
}
