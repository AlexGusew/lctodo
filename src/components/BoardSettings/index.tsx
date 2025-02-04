import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { ShowTags } from "@/components/BoardSettings/ShowTags";
import { CollapseAll } from "@/components/BoardSettings/CollapseAll";
import { ColumnLayout } from "@/components/BoardSettings/ColumnLayout";
import { DisableAnimations } from "@/components/BoardSettings/DisableAnimations";

export const BoardSettings = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size={"icon"} aria-label="Board settings">
          <Cog6ToothIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-44">
        <ShowTags />
        <CollapseAll />
        <ColumnLayout />
        <DisableAnimations />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
