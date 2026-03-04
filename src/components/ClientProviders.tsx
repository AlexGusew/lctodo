"use client";

import dynamic from "next/dynamic";
import "jotai-devtools/styles.css";
import type { PropsWithChildren } from "react";

const DevTools =
  process.env.NODE_ENV !== "production"
    ? dynamic(() => import("jotai-devtools").then((mod) => mod.DevTools), {
        ssr: false,
      })
    : () => null;

export const ClientProviders = ({ children }: PropsWithChildren) => {
  return (
    <>
      <DevTools />
      {children}
    </>
  );
};
