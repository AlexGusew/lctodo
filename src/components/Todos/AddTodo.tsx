import { Button } from "@/components/ui/button";
import { useResponsive } from "@/lib/useResponsive";
import { PlusIcon } from "@heroicons/react/24/outline";

export const AddTodo = ({ onClick }: { onClick: () => void }) => {
  const { isMobile } = useResponsive();
  return (
    <Button
      variant={isMobile ? "outline" : "ghost"}
      className={isMobile ? "ml-auto" : ""}
      size="icon"
      onClick={onClick}
    >
      <PlusIcon />
    </Button>
  );
};
