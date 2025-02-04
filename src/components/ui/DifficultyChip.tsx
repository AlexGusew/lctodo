import type { Question } from "@/app/types";
import { cn } from "@/lib/utils";
import React from "react";

const getBackgroundColorClass = (difficulty: Question["difficulty"]) =>
  ({
    Easy: "bg-green-500",
    Medium: "bg-orange-500",
    Hard: "bg-rose-500",
  }[difficulty] ?? "bg-gray-500");

export const DifficultyChip = ({
  difficulty,
}: {
  difficulty: Question["difficulty"];
}) => {
  return (
    <span
      className={cn(
        getBackgroundColorClass(difficulty),
        "text-zinc-900 px-2 rounded-full py-0.5 text-xs flex items-center justify-center"
      )}
    >
      {difficulty}
    </span>
  );
};
