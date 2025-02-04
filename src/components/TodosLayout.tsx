"use client";

import { useColumnLayout } from "@/lib/useColumnLayout";
import type { PropsWithChildren } from "react";

export const TodosLayout = ({ children }: PropsWithChildren) => {
  const isColumnLayout = useColumnLayout();

  if (isColumnLayout) {
    return <div className="grid grid-cols-3 gap-8">{children}</div>;
  } else {
    return children;
  }
};
