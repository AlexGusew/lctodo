import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { ShowTags } from "@/components/BoardSettings/ShowTags";
import { CollapseAll } from "@/components/BoardSettings/CollapseAll";

export const BoardSettings = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size={"icon"}>
          <Cog6ToothIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-36">
        <ShowTags />
        <CollapseAll />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
