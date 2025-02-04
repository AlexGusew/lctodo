"use client";

import { Button } from "@/components/ui/button";
import { todosAtom } from "@/state";
import { useAtomValue } from "jotai";
import Image from "next/image";
import { redirect } from "next/navigation";

export default function SignIn() {
  const todos = useAtomValue(todosAtom);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        localStorage.setItem("todos", JSON.stringify(todos));
        redirect("/api/login/github");
      }}
    >
      <Button type="submit" variant={"link"}>
        <Image
          src="/github-mark-white.svg"
          alt="GitHub logo"
          width={24}
          height={24}
        />
        Sign in with GitHub
      </Button>
    </form>
  );
}
