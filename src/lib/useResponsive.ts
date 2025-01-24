// Source from https://learnersbucket.com/examples/interview/useresponsive-hook-in-react/

import { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";

export const useResponsive = () => {
  const [state, setState] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
  });

  useEffect(() => {
    onResizeHandler();
    Setup();
    return () => {
      Cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onResizeHandler = () => {
    const isMobile = window.innerWidth <= 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth <= 990;
    const isDesktop = window.innerWidth > 990;

    setState({ isMobile, isTablet, isDesktop });
  };

  const debouncedCall = useDebounceCallback(onResizeHandler, 500);

  const Setup = () => {
    window.addEventListener("resize", debouncedCall, false);
  };

  const Cleanup = () => {
    window.removeEventListener("resize", debouncedCall, false);
  };

  return state;
};
