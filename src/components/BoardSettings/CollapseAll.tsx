"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { sectionOpen } from "@/state";
import { CheckIcon } from "@heroicons/react/24/solid";
import { useAtom } from "jotai";

export const CollapseAll = () => {
  const [sectionOpenValue, setSectionOpen] = useAtom(sectionOpen);

  const isAllCollapsed = !Object.values(sectionOpenValue).reduce(
    (acc, value) => acc || value
  );

  const onClick = () => {
    setSectionOpen({
      done: isAllCollapsed,
      future: isAllCollapsed,
      inProgress: isAllCollapsed,
    });
  };

  return (
    <DropdownMenuItem onClick={onClick}>
      Collapse all
      {isAllCollapsed && <CheckIcon className="ml-auto" />}
    </DropdownMenuItem>
  );
};
