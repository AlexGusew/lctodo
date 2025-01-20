"use client";

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
import Chip from "@/components/ui/chip"; // Import Chip component
import { useState } from "react";

type TodoDatePickerProps = Pick<
  DayPickerSingleProps,
  "selected" | "onSelect"
> & { datesWrapperRef: React.RefObject<HTMLParagraphElement> };

const TodoDatePicker = ({
  onSelect,
  selected,
  datesWrapperRef,
}: TodoDatePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect: DayPickerSingleProps["onSelect"] = (...props) => {
    onSelect?.(...props);
    setIsOpen(false);
  };

  const getDisplayDate = (date: Date | undefined) => {
    if (!date) return "";
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (format(date, "yyyy-MM-dd") === format(today, "yyyy-MM-dd")) {
      return <Chip label="Today" />;
    } else if (format(date, "yyyy-MM-dd") === format(tomorrow, "yyyy-MM-dd")) {
      return <Chip label="Tomorrow" />;
    } else {
      return format(date, "eee, dd MMMM");
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverAnchor virtualRef={datesWrapperRef} />
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "w-full flex-1 justify-start text-left font-normal pl-[0.5rem] text-sm",
            !selected && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {!!selected && getDisplayDate(selected)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className={`w-auto p-0`}>
        <Calendar
          mode="single"
          selected={selected}
          onSelect={handleSelect}
          initialFocus
          fromDate={new Date()}
        />
      </PopoverContent>
    </Popover>
  );
};

export default TodoDatePicker;
