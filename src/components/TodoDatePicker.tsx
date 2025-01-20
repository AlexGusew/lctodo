"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { DayPickerSingleProps } from "react-day-picker";
import { PopoverAnchor } from "@radix-ui/react-popover";

type TodoDatePickerProps = Pick<
  DayPickerSingleProps,
  "selected" | "onSelect"
> & { datesWrapperRef: React.RefObject<HTMLParagraphElement> };

const TodoDatePicker = ({
  onSelect,
  selected,
  datesWrapperRef,
}: TodoDatePickerProps) => {
  return (
    <Popover>
      <PopoverAnchor virtualRef={datesWrapperRef} />
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "w-full flex-1 justify-start text-left font-normal pl-2 text-sm",
            !selected && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {!!selected && format(selected, "eee, dd MMMM")}
        </Button>
      </PopoverTrigger>
      <PopoverContent className={`w-auto p-0`}>
        <Calendar
          mode="single"
          selected={selected}
          onSelect={onSelect}
          initialFocus
          fromDate={new Date()}
        />
      </PopoverContent>
    </Popover>
  );
};

export default TodoDatePicker;
