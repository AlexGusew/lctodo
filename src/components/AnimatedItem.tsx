import type { PropsWithChildren } from "react";
import { motion } from "motion/react";

interface AnimatedItemProps extends PropsWithChildren {
  disable?: boolean;
}

export const AnimatedItem = ({
  children,
  disable = false,
}: AnimatedItemProps) => (
  <motion.li
    initial={{ scale: 0.9, height: 0, opacity: 0 }}
    animate={{ scale: 1, height: "auto", opacity: 1 }}
    exit={{ scale: 0.9, height: 0, opacity: 0 }}
    transition={{ duration: disable ? 0 : 0.2, ease: "easeOut", zoom: 1 }}
  >
    {children}
  </motion.li>
);
