import type { PropsWithChildren } from "react";
import { motion } from "motion/react";

export const AnimatedItem = ({ children }: PropsWithChildren) => (
  <motion.div
    initial={{ height: 0, opacity: 0 }}
    animate={{ height: "auto", opacity: 1 }}
    exit={{ height: 0, opacity: 0 }}
    transition={{ duration: 0.2, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);
