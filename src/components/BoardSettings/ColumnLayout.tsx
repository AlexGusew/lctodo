"use client";

import { changeLayout } from "@/actions/problems";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useResponsive } from "@/lib/useResponsive";
import { layoutAtom } from "@/state";
import { CheckIcon } from "@heroicons/react/24/solid";
import { Layout } from "@prisma/client";
import { useAtom } from "jotai";

export const ColumnLayout = () => {
  const [layout, setLayout] = useAtom(layoutAtom);
  const { isDesktop } = useResponsive();

  const onClick = () => {
    setLayout((layout) => {
      const newLayout = {
        [Layout.col]: Layout.row,
        [Layout.row]: Layout.col,
      }[layout];
      changeLayout(newLayout);
      return newLayout;
    });
  };

  if (!isDesktop) return null;

  return (
    <DropdownMenuItem onClick={onClick}>
      Columns layout
      {layout === Layout.col && <CheckIcon className="ml-auto" />}
    </DropdownMenuItem>
  );
};
