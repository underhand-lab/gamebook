import { Card, CardContent } from "@/components/ui/card";
import type { CalendarDaySummary } from "@/lib/api";
import { cn } from "@/lib/utils";

type CalendarDayGridProps = {
  days: string[];
  selectedDate: string;
  dayMap: Map<string, CalendarDaySummary>;
  onSelectDate: (date: string) => void;
};

export function CalendarDayGrid({
  days,
  selectedDate,
  dayMap,
  onSelectDate,
}: CalendarDayGridProps) {
  return (
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
                onClick={() => onSelectDate(date)}
              >
                <span className="font-semibold">{Number(date.slice(8))}</span>
                {day ? (
                  <span className="mt-auto flex w-full items-end gap-1">
                    <span
                      className={cn(
                        "h-1.5 flex-1 rounded-full",
                        selected ? "bg-primary-foreground/85" : "bg-primary/70",
                      )}
                    />
                    {day.reviewCount ? (
                      <span
                        className={cn(
                          "h-1.5 flex-1 rounded-full",
                          selected ? "bg-primary-foreground/60" : "bg-amber-400",
                        )}
                      />
                    ) : null}
                    <span className="ml-auto text-[10px] font-semibold">
                      {day.logCount}
                    </span>
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
