"use client";

import { useColumnLayout } from "@/lib/useColumnLayout";
import type { ReactNode } from "react";

export const ResponsiveLayout = ({ children }: { children: ReactNode }) => {
  const isColumnLayout = useColumnLayout();

  return (
    <div className={isColumnLayout ? "max-w-7xl mx-auto" : "max-w-2xl mx-auto"}>
      {children}
    </div>
  );
};
