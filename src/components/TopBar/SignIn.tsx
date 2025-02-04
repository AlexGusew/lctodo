"use client";

import { Button } from "@/components/ui/button";
import { todosAtom } from "@/state";
import { useAtomValue } from "jotai";
import Image from "next/image";

export default function SignIn() {
  const todos = useAtomValue(todosAtom);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        localStorage.setItem("todos", JSON.stringify(todos));
        window.location.href = "/api/login/github";
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
