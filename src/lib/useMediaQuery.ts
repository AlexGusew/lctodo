import { useSyncExternalStore } from "react";

const useMediaQuery = (query: string) => {
  return useSyncExternalStore(
    (callback) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", callback);
      return () => media.removeEventListener("change", callback);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
};

export default useMediaQuery;
