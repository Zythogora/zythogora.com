"use client";

import { CalendarIcon } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import {
  useCallback,
  useState,
  type ChangeEvent,
  type ComponentProps,
  type KeyboardEvent,
} from "react";

import Button from "@/app/_components/ui/button";
import Calendar from "@/app/_components/ui/calendar";
import Input from "@/app/_components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/_components/ui/popover";

interface DatePickerProps
  extends Omit<ComponentProps<typeof Input>, "value" | "onChange"> {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
}

const DatePicker = ({
  value,
  onChange,
  placeholder,
  disabled,
  ...restProps
}: DatePickerProps) => {
  const t = useTranslations();
  const formatter = useFormatter();

  const formatDate = useCallback(
    (date: Date | undefined) =>
      date ? formatter.dateTime(date, { dateStyle: "short" }) : "",
    [formatter],
  );

  const [open, setOpen] = useState(false);

  const [inputValue, setInputValue] = useState(formatDate(value));
  const [month, setMonth] = useState<Date | undefined>(value);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    const date = new Date(newValue);
    if (date && !isNaN(date.getTime())) {
      onChange?.(date);
      setMonth(date);
    } else if (newValue === "") {
      onChange?.(undefined);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
    }
  };

  return (
    <div className="relative">
      <Input
        value={inputValue}
        placeholder={placeholder ?? formatDate(new Date())}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        {...restProps}
      />

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            disabled={disabled}
            className="absolute inset-y-0 right-3 my-auto size-8 items-center justify-center p-0"
          >
            <CalendarIcon className="size-6 shrink-0" />

            <span className="sr-only">
              {t("form.fields.datePicker.ariaLabel")}
            </span>
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-auto overflow-hidden p-0"
          align="end"
          alignOffset={-8}
          sideOffset={10}
        >
          <Calendar
            mode="single"
            selected={value}
            captionLayout="dropdown"
            month={month}
            onMonthChange={setMonth}
            onSelect={(date) => {
              onChange?.(date);
              setInputValue(formatDate(date));
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DatePicker;
