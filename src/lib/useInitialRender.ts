import { useEffect, useState } from "react";

export const useInitialRender = () => {
  const [initialRender, setInitialRender] = useState(true);
  useEffect(() => {
    setInitialRender(false);
  }, []);
  return initialRender;
};
