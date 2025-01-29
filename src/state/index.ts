"use client";

import { atom } from "jotai";

export const showTagsAtom = atom(true);

export const sectionOpen = atom({
  done: true,
  future: true,
  inProgress: true,
});
