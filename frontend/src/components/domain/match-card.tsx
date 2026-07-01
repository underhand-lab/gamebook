"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarClock, Star } from "lucide-react";
import { MatchLogForm } from "@/features/matches/match-log-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { MatchSummary } from "@/lib/api";
import { formatDateTime, matchStatusLabel, scoreText } from "@/lib/labels";

type MatchCardProps = {
  match: MatchSummary;
  compact?: boolean;
};

export function MatchCard({ match, compact = false }: MatchCardProps) {
  const router = useRouter();
  const href = `/matches/${match.id}`;

  function openMatch() {
    router.push(href);
  }

  return (
    <Card
      className="cursor-pointer border-border/80 bg-card/95 shadow-sm shadow-black/5 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
      role="link"
      tabIndex={0}
      onClick={openMatch}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openMatch();
        }
      }}
    >
      <CardContent className="p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={match.status === "FINAL" ? "secondary" : "amber"}>
                {matchStatusLabel[match.status]}
              </Badge>
              <Link
                className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                href={`/matches?leagueId=${encodeURIComponent(match.league.id)}&q=${encodeURIComponent(match.league.name)}`}
                onClick={(event) => event.stopPropagation()}
              >
                {match.league.name}
              </Link>
            </div>
            <h3 className="mt-3 text-base font-semibold tracking-tight sm:text-lg">
              {match.homeTeam.name} vs {match.awayTeam.name}
            </h3>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <CalendarClock className="h-4 w-4" />
                {formatDateTime(match.matchDate)}
              </span>
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-500" />
                {(match.averageRating ?? 0).toFixed(1)} · 리뷰{" "}
                {match.reviewCount ?? 0}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between gap-4 rounded-2xl bg-muted/40 px-4 py-3 sm:min-w-44 sm:justify-end">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Score</p>
              <p className="mt-1 text-xl font-bold">
                {scoreText(match.score?.home, match.score?.away)}
              </p>
            </div>
            <MatchLogForm
              match={match}
              buttonLabel="로그"
              triggerSize="sm"
              triggerVariant="outline"
              onSaved={() => undefined}
            />
            {compact ? null : <span className="sr-only">상세 페이지로 이동</span>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
