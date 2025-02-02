import type { PropsWithChildren } from "react";
import { motion } from "motion/react";

interface AnimatedItemProps extends PropsWithChildren {
  disable?: boolean;
}

export const AnimatedItem = ({
  children,
  disable = false,
}: AnimatedItemProps) => (
  <motion.div
    initial={{ height: 0, opacity: 0 }}
    animate={{ height: "auto", opacity: 1 }}
    exit={{ height: 0, opacity: 0 }}
    transition={{ duration: disable ? 0 : 0.2, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);
