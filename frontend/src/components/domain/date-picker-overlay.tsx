"use client";

import { X } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Column = {
  title: string;
  value: number;
  options: number[];
  onChange: (value: number) => void;
};

function daysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

function setDatePart(
  nextYear: number,
  nextMonth: number,
  nextDay: number,
) {
  return `${nextYear}-${String(nextMonth).padStart(2, "0")}-${String(nextDay).padStart(2, "0")}`;
}

export function DatePickerOverlay({
  open,
  onClose,
  columns,
}: {
  open: boolean;
  onClose: () => void;
  columns: Column[];
}) {
  const refs = useRef<Record<string, Record<number, HTMLButtonElement | null>>>({});

  const key = useMemo(() => columns.map((column) => `${column.title}:${column.value}`).join("|"), [columns]);

  useEffect(() => {
    if (!open) return;
    columns.forEach((column) => {
      refs.current[column.title]?.[column.value]?.scrollIntoView({ block: "center" });
    });
  }, [columns, key, open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center"
      onClick={onClose}
    >
      <Card className="w-full max-w-md shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <CardHeader className="relative p-4 pr-12">
          <Button
            aria-label="닫기"
            className="absolute right-3 top-3"
            size="icon"
            type="button"
            variant="ghost"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="grid gap-4 px-4 pb-4 pt-0">
          <div className={cn("grid gap-2", columns.length === 3 ? "grid-cols-3" : "grid-cols-2")}>
            {columns.map((column) => (
              <div key={column.title} className="space-y-2">
                <div className="text-center text-xs text-muted-foreground">{column.title}</div>
                <div className="max-h-56 overflow-y-auto rounded-2xl border bg-background p-1 [scrollbar-width:none] [scrollbar-gutter:stable]">
                  <div className="grid gap-1">
                    {column.options.map((value) => (
                      <button
                        key={value}
                        ref={(node) => {
                          refs.current[column.title] ||= {};
                          refs.current[column.title][value] = node;
                        }}
                        className={cn(
                          "min-h-12 rounded-xl px-3 py-3 text-sm transition-colors",
                          column.value === value
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted",
                        )}
                        type="button"
                        onClick={() => column.onChange(value)}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function FullDatePickerOverlay({
  open,
  value,
  onChange,
  onClose,
  startYear = 2021,
  yearCount = 11,
}: {
  open: boolean;
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
  startYear?: number;
  yearCount?: number;
}) {
  const year = Number(value.slice(0, 4));
  const month = Number(value.slice(5, 7));
  const day = Number(value.slice(8, 10));

  function commit(nextYear: number, nextMonth: number, nextDay: number) {
    onChange(setDatePart(nextYear, nextMonth, nextDay));
    onClose();
  }

  return (
    <DatePickerOverlay
      open={open}
      onClose={onClose}
      columns={[
        {
          title: "년",
          value: year,
          options: Array.from({ length: yearCount }, (_, index) => startYear + index),
          onChange: (nextYear: number) => {
            commit(nextYear, month, Math.min(day, daysInMonth(nextYear, month)));
          },
        },
        {
          title: "월",
          value: month,
          options: Array.from({ length: 12 }, (_, index) => index + 1),
          onChange: (nextMonth: number) => {
            commit(year, nextMonth, Math.min(day, daysInMonth(year, nextMonth)));
          },
        },
        {
          title: "일",
          value: day,
          options: Array.from({ length: daysInMonth(year, month) }, (_, index) => index + 1),
          onChange: (nextDay: number) => {
            commit(year, month, nextDay);
          },
        },
      ]}
    />
  );
}
