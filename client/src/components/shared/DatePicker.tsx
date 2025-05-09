"use client";

import { format, getMonth, getYear, setMonth, setYear } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface DatePickerProps {
  startYear?: number;
  endYear?: number;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  className?: string;
  error?: boolean;
  minDate?: Date;
}

export function DatePicker({
  startYear = getYear(new Date()) - 100,
  endYear = getYear(new Date()) + 100,
  date,
  setDate,
  className,
  error,
  minDate,
}: DatePickerProps) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const years = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => startYear + i,
  );

  const handleMonthChange = (month: string) => {
    if (!date) return;

    const newDate = setMonth(date, months.indexOf(month));
    setDate(newDate);
  };

  const handleYearChange = (year: string) => {
    if (!date) return;

    const newDate = setYear(date, parseInt(year));
    setDate(newDate);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "h-12 justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className,
          )}
          aria-invalid={error}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        {!minDate && (
          <div className="flex justify-between gap-2 p-2">
            <Select
              onValueChange={handleMonthChange}
              value={date ? months[getMonth(date)] : undefined}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              onValueChange={handleYearChange}
              value={date ? getYear(date).toString() : undefined}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {minDate ? (
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            fromDate={minDate}
            initialFocus
          />
        ) : (
          <Calendar
            mode="single"
            month={date}
            selected={date}
            onSelect={setDate}
            initialFocus
            onMonthChange={(newMonth) => {
              if (date) setDate(setMonth(date, getMonth(newMonth)));
            }}
          />
        )}
      </PopoverContent>
    </Popover>
  );
}
