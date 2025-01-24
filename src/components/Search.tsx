import { cn } from "@/lib/utils";
import { Command as CommandPrimitive } from "cmdk";
import { Check } from "lucide-react";
import { useMemo, useState, type FocusEventHandler } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "./ui/command";
import { Input } from "./ui/input";
import { Popover, PopoverAnchor, PopoverContent } from "./ui/popover";
import { Skeleton } from "./ui/skeleton";
import { DifficultyChip } from "@/components/ui/DifficultyChip";

interface DefaultItem {
  id: string;
  label: string;
  data: any;
}

type Props<T extends DefaultItem> = {
  selectedId: string;
  onSelectedValueChange: (value: T | null) => void;
  searchValue: string;
  onSearchValueChange: (value: string) => void;
  items: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  placeholder?: string;
  onInputBlur?: FocusEventHandler<HTMLInputElement>;
  renderOption?: (item: T) => React.ReactNode;
};

export function AutoComplete<T extends DefaultItem>({
  selectedId,
  onSelectedValueChange,
  searchValue,
  onSearchValueChange,
  items = [],
  isLoading,
  renderOption,
  emptyMessage = "No items.",
  placeholder = "Search...",
}: Props<T>) {
  const [open, setOpen] = useState(false);

  const labels = useMemo(
    () =>
      items.reduce((acc, item) => {
        acc[item.id] = item;
        return acc;
      }, {} as Record<string, T>),
    [items]
  );

  const reset = () => {
    onSelectedValueChange(null);
    onSearchValueChange("");
  };

  const onSelectItem = (inputValue: string) => {
    if (inputValue === selectedId) {
      reset();
    } else {
      onSelectedValueChange(labels[inputValue] ?? null);
      onSearchValueChange(labels[inputValue]?.label ?? "");
    }
    setOpen(false);
  };

  return (
    <div className="flex items-center w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <Command shouldFilter={false}>
          <PopoverAnchor asChild>
            <CommandPrimitive.Input
              asChild
              value={searchValue}
              onValueChange={onSearchValueChange}
              onKeyDown={(e) => setOpen(e.key !== "Escape")}
              onMouseDown={() => setOpen((open) => !!searchValue || !open)}
              onFocus={() => setOpen(true)}
            >
              <Input
                placeholder={placeholder}
                className="!ring-0 font-normal !outline-none border-none text-ellipsis"
              />
            </CommandPrimitive.Input>
          </PopoverAnchor>
          {!open && <CommandList aria-hidden="true" className="hidden" />}
          <PopoverContent
            asChild
            onOpenAutoFocus={(e) => e.preventDefault()}
            onInteractOutside={(e) => {
              if (
                e.target instanceof Element &&
                e.target.hasAttribute("cmdk-input")
              ) {
                e.preventDefault();
              }
            }}
            // className="p-0"
            className="sm:w-[--radix-popover-trigger-width] w-[calc(100vw-20px)] p-0"
          >
            <CommandList>
              {isLoading && (
                <CommandPrimitive.Loading>
                  <div className="p-1">
                    <Skeleton className="h-6 w-full" />
                  </div>
                </CommandPrimitive.Loading>
              )}
              {items.length > 0 && !isLoading ? (
                <CommandGroup>
                  {items.map((option) => (
                    <CommandItem
                      key={option.id}
                      value={option.id}
                      onMouseDown={(e) => e.preventDefault()}
                      onSelect={onSelectItem}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedId === option.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <span className="mr-auto">{option.label}</span>
                      <DifficultyChip difficulty={option.data.difficulty} />
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : null}
              {!isLoading ? (
                <CommandEmpty>{emptyMessage ?? "No items."}</CommandEmpty>
              ) : null}
            </CommandList>
          </PopoverContent>
        </Command>
      </Popover>
    </div>
  );
}
