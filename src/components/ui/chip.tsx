import { cn } from "@/lib/utils";

type ChipProps = {
  label: string;
  className?: string;
};

const Chip = ({ label, className }: ChipProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800",
        className
      )}
    >
      {label}
    </span>
  );
};

export default Chip;
