"use client";

import { format } from "date-fns";
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
import { useState } from "react";
import useMediaQuery from "@/lib/useMediaQuery";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { CalendarIcon } from "@heroicons/react/24/outline";
import { CalendarIcon as SolidCalendarIcon } from "@heroicons/react/24/solid";

export const getDisplayDate = (date: Date | undefined) => {
  if (!date) return "";
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  if (format(date, "yyyy-MM-dd") === format(today, "yyyy-MM-dd")) {
    return "Today";
  } else if (format(date, "yyyy-MM-dd") === format(tomorrow, "yyyy-MM-dd")) {
    return "Tomorrow";
  } else {
    return format(date, "eee, dd MMMM");
  }
};

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
  const isMobile = useMediaQuery("(max-width: 640px)");

  const handleSelect: DayPickerSingleProps["onSelect"] = (...props) => {
    onSelect?.(...props);
    setIsOpen(false);
  };

  const calendar = (
    <Calendar
      mode="single"
      selected={selected}
      onSelect={handleSelect}
      initialFocus
      fromDate={new Date()}
    />
  );

  return (
    <>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverAnchor virtualRef={datesWrapperRef} />
        <PopoverTrigger asChild>
          <Button
            aria-label="Set deadline"
            variant="ghost"
            className={cn(
              "w-full flex-1 justify-start text-left font-normal pl-[0.5rem] text-sm",
              !selected && "text-muted-foreground"
            )}
          >
            {!!selected ? (
              <SolidCalendarIcon className="rm-2 h4 w-4" />
            ) : (
              <CalendarIcon className="mr-2 h-4 w-4" />
            )}
            {!!selected && getDisplayDate(selected)}
          </Button>
        </PopoverTrigger>
        {isMobile ? (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className={`w-auto p-0`}>
              <DialogTitle className="hidden">Calendar date picker</DialogTitle>
              {calendar}
            </DialogContent>
          </Dialog>
        ) : (
          <PopoverContent className={`w-auto p-0`}>{calendar}</PopoverContent>
        )}
      </Popover>
    </>
  );
};

export default TodoDatePicker;
