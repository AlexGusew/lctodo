"use client";

import { DevTools } from "jotai-devtools";
import "jotai-devtools/styles.css";
import type { PropsWithChildren } from "react";

export const ClientProviders = ({ children }: PropsWithChildren) => {
  return (
    <>
      <DevTools />
      {children}
    </>
  );
};
