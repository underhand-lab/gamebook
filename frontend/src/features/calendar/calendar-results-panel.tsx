"use client";

import { MatchCard } from "@/components/domain/match-card";
import { TimelineCard } from "@/components/domain/timeline-card";
import type { CalendarDiaryDay, MatchLogAggregate, MatchSummary } from "@/lib/api";
import type { CalendarMode } from "./calendar-types";

type CalendarResultsPanelProps = {
  mode: CalendarMode;
  diary: CalendarDiaryDay | null;
  diaryEntries: MatchLogAggregate[];
  matches: MatchSummary[];
};

export function CalendarResultsPanel({
  mode,
  diary,
  diaryEntries,
  matches,
}: CalendarResultsPanelProps) {
  return (
    <div className="space-y-4 md:sticky md:top-20 md:self-start">
      {mode === "mine" ? (
        <>
          {diaryEntries.map((entry) => (
            <TimelineCard key={entry.matchLog.id} item={entry} />
          ))}
          {diary && diaryEntries.length === 0 ? (
            <div className="rounded-md border p-4 text-sm text-muted-foreground">
              없음
            </div>
          ) : null}
        </>
      ) : (
        <>
          {matches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
          {matches.length === 0 ? (
            <div className="rounded-md border p-4 text-sm text-muted-foreground">
              없음
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
