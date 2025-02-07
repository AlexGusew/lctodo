import { Button } from "@/components/ui/button";
import { CollapsibleTrigger } from "@/components/ui/collapsible";
import { useColumnLayout } from "@/lib/useColumnLayout";
import { cn } from "@/lib/utils";
import { ChevronUpDownIcon, HashtagIcon } from "@heroicons/react/24/outline";
import type { PropsWithChildren } from "react";

export const ColumnHeader = ({
  collapsed,
  label,
  amount,
  children,
}: PropsWithChildren<{
  collapsed: boolean;
  label: string;
  amount: number;
}>) => {
  const isColumnLayout = useColumnLayout();

  const header = (
    <div
      className={`flex items-center gap-2 mb-4 ${
        collapsed && isColumnLayout ? "[writing-mode:vertical-lr]" : ""
      }`}
    >
      <CollapsibleTrigger className={cn({ "opacity-60": collapsed })} asChild>
        <Button
          variant={"ghost"}
          className="font-bold text-xl flex items-center gap-3 p-0 hover:bg-[none] [justify-content:flex-start]"
        >
          <ChevronUpDownIcon
            className={`size-4 -mr-2 opacity-70 ${
              collapsed ? "" : "scale-110"
            }`}
          />
          {label}
          <span className="text-[0.7rem] ml-[-0.4rem] flex items-center opacity-60 translate-y-[4px] w-8">
            <HashtagIcon className="!size-3" />
            <span className="font-normal ml-0">{amount}</span>
          </span>
        </Button>
      </CollapsibleTrigger>
      {children}
    </div>
  );
  return header;
};
