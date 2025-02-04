"use client";

import { Button } from "@/components/ui/button";
import { todosAtom } from "@/state";
import { useAtomValue } from "jotai";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useState } from "react";

export default function SignIn() {
  const todos = useAtomValue(todosAtom);
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setIsLoading(true);
        localStorage.setItem("todos", JSON.stringify(todos));
        window.location.href = "/api/login/github";
      }}
    >
      <Button
        aria-label="Sign in with GitHub"
        type="submit"
        variant={"link"}
        className={isLoading ? "animate-pulse" : ""}
      >
        <Image
          src={
            theme.resolvedTheme === "light"
              ? "github-mark.svg"
              : "/github-mark-white.svg"
          }
          alt="GitHub logo"
          width={24}
          height={24}
        />
        Sign in with GitHub
      </Button>
    </form>
  );
}
