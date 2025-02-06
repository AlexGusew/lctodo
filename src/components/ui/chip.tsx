import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type { PropsWithChildren } from "react";

const chipVariants = cva("whitespace-nowrap", {
  variants: {
    variant: {
      default:
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800",
      tag: "bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-2 rounded-full py-0.5 text-xs flex items-center justify-center",
      difficulty:
        "text-white px-2 rounded-full py-0.5 text-xs flex items-center justify-center bg-gray-500",
    },
    difficulty: {
      Easy: "dark:bg-green-700 bg-green-500",
      Medium: "dark:bg-orange-600 bg-orange-500",
      Hard: "dark:bg-rose-700 bg-rose-500",
    },
    outline: {
      selected: "outline outline-2 dark:outline-white-500 outline-black-500",
    },
    asButton: {
      set: "hover:opacity-80 transition-opacity duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface ChipProps
  extends PropsWithChildren<React.HTMLAttributes<HTMLButtonElement>>,
    VariantProps<typeof chipVariants> {
  button?: boolean;
}

const Chip = ({
  children,
  className,
  variant,
  difficulty,
  button,
  outline,
  ...rest
}: ChipProps) => {
  const props = {
    ...rest,
    className: cn(
      chipVariants({
        variant,
        difficulty,
        className,
        asButton: button ? "set" : undefined,
        outline,
      })
    ),
    children,
  };
  if (button) {
    return <button {...props} />;
  }
  return <span {...props} />;
};

export default Chip;
