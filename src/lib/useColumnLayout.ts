"use client";

import { useResponsive } from "@/lib/useResponsive";
import { layoutAtom } from "@/state";
import { useAtomValue } from "jotai";

export const useColumnLayout = () => {
  const layout = useAtomValue(layoutAtom);
  const { isDesktop } = useResponsive();
  return layout === "col" && isDesktop;
};
