import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

export const useInitialRender = () => {
  return useSyncExternalStore(
    subscribe,
    () => false,
    () => true
  );
};
