"use client";

import { useColumnLayout } from "@/lib/useColumnLayout";
import { sectionOpen } from "@/state";
import { useAtomValue } from "jotai";
import { useEffect, useRef, type PropsWithChildren } from "react";

export const TodosLayout = ({ children }: PropsWithChildren) => {
  const isColumnLayout = useColumnLayout();
  const sectionOpenValue = useAtomValue(sectionOpen);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && isColumnLayout) {
      const getCol = (open: boolean) => (open ? "minmax(auto, 1fr)" : "auto");
      const props = [
        sectionOpenValue.inProgress,
        sectionOpenValue.future,
        sectionOpenValue.done,
      ];
      const allClosed = !props.reduce((acc, i) => acc || i);

      let cols = [
        getCol(sectionOpenValue.inProgress),
        getCol(sectionOpenValue.future),
        getCol(sectionOpenValue.done),
      ].join(" ");

      if (allClosed) {
        cols = "auto auto 1fr";
      }

      ref.current.style.gridTemplateColumns = cols;
    }
  }, [isColumnLayout, sectionOpenValue]);

  if (isColumnLayout) {
    return (
      <div
        ref={ref}
        className={`mt-12 grid gap-8 ${isColumnLayout ? "column-layout" : ""}`}
      >
        {children}
      </div>
    );
  } else {
    return <div className="mt-12 gap-12 flex flex-col">{children}</div>;
  }
};
