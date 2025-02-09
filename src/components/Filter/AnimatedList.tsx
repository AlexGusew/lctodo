import React, { type ReactNode } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";

type Item = unknown;

const itemVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

interface AnimatedListProps<T> {
  items: T[];
  getValue: (item: T) => ReactNode;
  getKey: (item: T) => string;
  disableAnimations?: boolean;
  rootProps?: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLUListElement>,
    HTMLUListElement
  >;
}

export const AnimatedList = <T extends Item>({
  items,
  getValue,
  getKey,
  disableAnimations,
  rootProps,
}: AnimatedListProps<T>) => {
  return (
    <ul {...rootProps}>
      <AnimatePresence initial={false}>
        {items.map((item) => (
          <motion.li
            layout
            key={getKey(item)}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{
              ease: "anticipate",
              duration: disableAnimations ? 0 : 0.4,
            }}
          >
            {getValue(item)}
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
};
