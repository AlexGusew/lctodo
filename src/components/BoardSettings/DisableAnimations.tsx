"use client";

import { disableAnimationsAtom } from "@/state";
import { useAtom } from "jotai";
import { CheckIcon } from "@heroicons/react/24/outline";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { changeDisableAnimations } from "@/actions/problems";

export const DisableAnimations = () => {
  const [disableAnimations, setDisableAnimations] = useAtom(
    disableAnimationsAtom
  );

  return (
    <DropdownMenuItem
      onClick={async () => {
        setDisableAnimations((disabled) => !disabled);
        changeDisableAnimations(!disableAnimations);
      }}
    >
      Disable animations
      {disableAnimations && <CheckIcon className="ml-auto" />}
    </DropdownMenuItem>
  );
};
