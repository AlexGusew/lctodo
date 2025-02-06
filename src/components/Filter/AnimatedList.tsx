import React, { type ReactNode } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";

type Item = unknown;

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: "anticipate",
    },
  },
  exit: {
    opacity: 0,
    transition: {
      ease: "anticipate",
      duration: 0.4,
    },
  },
};

interface AnimatedListProps<T> {
  items: T[];
  getValue: (item: T) => ReactNode;
  className?: string;
  getKey: (item: T) => string;
}

export const AnimatedList = <T extends Item>({
  items,
  getValue,
  className,
  getKey,
}: AnimatedListProps<T>) => {
  return (
    <ul className={className}>
      <AnimatePresence initial={false}>
        {items.map((item) => (
          <motion.li
            layout
            key={getKey(item)}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {getValue(item)}
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
};
