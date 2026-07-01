"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DatePickerOverlay } from "@/components/domain/date-picker-overlay";
import { TimelineCard } from "@/components/domain/timeline-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  matchlogApi,
  type CalendarDaySummary,
  type CalendarDiaryDay,
  type CalendarMonth,
} from "@/lib/api";
import { cn } from "@/lib/utils";

function pad(value: number) {
  return String(value).padStart(2, "0");
}

export function CalendarDiaryScreen({ initialDate }: { initialDate?: string }) {
  const [selectedDate, setSelectedDate] = useState(initialDate ?? "2026-06-21");
  const [month, setMonth] = useState(selectedDate.slice(0, 7));
  const [summary, setSummary] = useState<CalendarMonth | null>(null);
  const [diary, setDiary] = useState<CalendarDiaryDay | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerYear, setPickerYear] = useState(Number(selectedDate.slice(0, 4)));
  const [pickerMonth, setPickerMonth] = useState(Number(selectedDate.slice(5, 7)));

  const dayMap = useMemo(() => {
    const map = new Map<string, CalendarDaySummary>();
    summary?.days.forEach((day) => map.set(day.date, day));
    return map;
  }, [summary]);

  const days = useMemo(() => {
    const [year, monthNumber] = month.split("-").map(Number);
    const total = new Date(year, monthNumber, 0).getDate();
    const firstWeekday = new Date(year, monthNumber - 1, 1).getDay();
    const padded = Array.from({ length: firstWeekday }, () => "");
    const dates = Array.from({ length: total }, (_, index) => `${month}-${pad(index + 1)}`);
    return [...padded, ...dates];
  }, [month]);

  const load = useCallback(async () => {
    const [monthSummary, diaryDay] = await Promise.all([
      matchlogApi.getMyCalendarMonth(month),
      matchlogApi.getMyCalendarDay(selectedDate),
    ]);
    setSummary(monthSummary);
    setDiary(diaryDay);
  }, [month, selectedDate]);

  useEffect(() => {
    load();
  }, [load]);

  function selectDate(date: string) {
    setPickerOpen(false);
    setSelectedDate(date);
    setMonth(date.slice(0, 7));
    window.history.replaceState(null, "", `/calendar?date=${date}`);
  }

  function shiftMonth(delta: number) {
    setPickerOpen(false);
    const [year, monthNumber] = month.split("-").map(Number);
    const next = new Date(year, monthNumber - 1 + delta, 1);
    const nextMonth = `${next.getFullYear()}-${pad(next.getMonth() + 1)}`;
    const nextDate = `${nextMonth}-${pad(1)}`;
    setMonth(nextMonth);
    setSelectedDate(nextDate);
    setPickerYear(next.getFullYear());
    setPickerMonth(next.getMonth() + 1);
    window.history.replaceState(null, "", `/calendar?date=${nextDate}`);
  }

  function openPicker() {
    const [year, monthNumber] = month.split("-").map(Number);
    setPickerYear(year);
    setPickerMonth(monthNumber);
    setPickerOpen(true);
  }

  function confirmPicker(year = pickerYear, monthValue = pickerMonth) {
    const nextDate = `${year}-${pad(monthValue)}-01`;
    setMonth(`${year}-${pad(monthValue)}`);
    selectDate(nextDate);
  }

  return (
    <div className="page-shell space-y-4">
      <div className="flex items-center gap-2">
        <Button type="button" variant="outline" size="sm" onClick={() => shiftMonth(-1)}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button type="button" variant="outline" className="px-3" onClick={openPicker}>
          {month}
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => shiftMonth(1)}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <DatePickerOverlay
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        columns={[
          {
            title: "년",
            value: pickerYear,
            options: Array.from({ length: 11 }, (_, index) => 2021 + index),
            onChange: setPickerYear,
          },
          {
            title: "월",
            value: pickerMonth,
            options: Array.from({ length: 12 }, (_, index) => index + 1),
            onChange: (value: number) => {
              setPickerMonth(value);
              confirmPicker(pickerYear, value);
            },
          },
        ]}
      />

      <div className="page-split">
        <Card className="md:sticky md:top-20 md:self-start">
          <CardContent className="space-y-3 p-3 sm:p-4">
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-muted-foreground sm:gap-2">
              {["일", "월", "화", "수", "목", "금", "토"].map((label) => (
                <div key={label}>{label}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {days.map((date, index) => {
                if (!date) return <div key={`blank-${index}`} className="aspect-square" />;
                const day = dayMap.get(date);
                const selected = date === selectedDate;
                return (
                  <button
                    key={date}
                    className={cn(
                      "flex aspect-square min-w-0 flex-col items-start justify-start gap-1 rounded-xl border p-2 text-left text-xs transition-colors hover:bg-muted sm:text-sm",
                      selected && "border-primary bg-primary text-primary-foreground",
                      day && !selected && "border-secondary bg-secondary/10",
                    )}
                    type="button"
                    onClick={() => selectDate(date)}
                  >
                    <span className="font-semibold">{Number(date.slice(8))}</span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
        <div className="space-y-2 md:sticky md:top-20 md:self-start">
          {diary?.entries.map((entry) => (
            <TimelineCard key={entry.matchLog.id} item={entry} />
          ))}
          {diary && diary.entries.length === 0 ? (
            <div className="rounded-md border p-4 text-sm text-muted-foreground">
              없음
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
