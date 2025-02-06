"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { Cog6ToothIcon as Cog6ToothIconSolid } from "@heroicons/react/24/solid";
import { ShowTags } from "@/components/BoardSettings/ShowTags";
import { CollapseAll } from "@/components/BoardSettings/CollapseAll";
import { ColumnLayout } from "@/components/BoardSettings/ColumnLayout";
import { DisableAnimations } from "@/components/BoardSettings/DisableAnimations";
import { useReducer } from "react";

export const BoardSettings = () => {
  const [open, toggle] = useReducer((s) => !s, false);

  return (
    <DropdownMenu open={open} onOpenChange={toggle}>
      <DropdownMenuTrigger asChild>
        <Button
          variant={open ? "default" : "outline"}
          size={"icon"}
          aria-label="Board settings"
        >
          {open ? <Cog6ToothIconSolid /> : <Cog6ToothIcon />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-44">
        <ShowTags />
        <CollapseAll />
        <ColumnLayout />
        <DisableAnimations />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
