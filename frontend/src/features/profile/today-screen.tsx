"use client";

import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { FullDatePickerOverlay } from "@/components/domain/date-picker-overlay";
import { MatchCard } from "@/components/domain/match-card";
import { ModalCardHeader } from "@/components/domain/modal-card-header";
import { RadioPillGroup } from "@/components/domain/pill-radio-group";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { matchlogApi, type MatchSummary } from "@/lib/api";
import { formatDate } from "@/lib/labels";

function toDateKey(value: Date) {
  return value.toISOString().slice(0, 10);
}

function shiftDate(value: string, delta: number) {
  const next = new Date(`${value}T00:00:00.000Z`);
  next.setUTCDate(next.getUTCDate() + delta);
  return toDateKey(next);
}

export function TodayScreen() {
  const [date, setDate] = useState(() => toDateKey(new Date()));
  const [favoriteOnly, setFavoriteOnly] = useState(true);
  const [matches, setMatches] = useState<MatchSummary[]>([]);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<MatchSummary[]>([]);

  useEffect(() => {
    let active = true;

    matchlogApi.listMatchesByDate(date, {
      favoriteOnly,
      size: 20,
    }).then((page) => {
      if (active) setMatches(page.items);
    });

    return () => {
      active = false;
    };
  }, [date, favoriteOnly]);

  const title = useMemo(() => formatDate(`${date}T00:00:00.000Z`), [date]);

  function openDatePicker() {
    setSearchOpen(false);
    setDatePickerOpen(true);
  }

  async function searchMatches(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = await matchlogApi.listMatchesByDate(date, {
      q: query,
      favoriteOnly,
      size: 20,
    });
    setSearchResults(result.items);
  }

  return (
    <div className="page-shell space-y-5">
      <section className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            className="px-3"
            type="button"
            variant="outline"
            onClick={() => {
              setDatePickerOpen(false);
              setDate((current) => shiftDate(current, -1));
            }}
          >
            <ChevronLeft className="h-4 w-4" />
            이전날
          </Button>
          <Button className="px-3" type="button" variant="outline" onClick={openDatePicker}>
            {title}
          </Button>
          <Button
            className="px-3"
            type="button"
            variant="outline"
            onClick={() => {
              setDatePickerOpen(false);
              setDate((current) => shiftDate(current, 1));
            }}
          >
            다음날
            <ChevronRight className="h-4 w-4" />
          </Button>
          <div className="ml-auto">
            <RadioPillGroup
              groupClassName="rounded-full border border-border/70 bg-card p-1"
              columnsClassName="grid-cols-2"
              name="favoriteOnly"
              value={favoriteOnly ? "favorite" : "all"}
              options={[
                { value: "favorite", label: "응원팀" },
                { value: "all", label: "전체경기" },
              ]}
              onChange={(value) => {
                setDatePickerOpen(false);
                setFavoriteOnly(value === "favorite");
              }}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setDatePickerOpen(false);
              setSearchOpen(true);
            }}
          >
            <Search className="h-4 w-4" />
            검색
          </Button>
        </div>
        <FullDatePickerOverlay
          open={datePickerOpen}
          value={date}
          onChange={setDate}
          onClose={() => setDatePickerOpen(false)}
        />

        <div className="flex items-center justify-between gap-3">
          <Badge variant="outline">{matches.length}개 경기</Badge>
          <p className="text-sm text-muted-foreground">
            {favoriteOnly ? "응원팀 기준으로 선택한 날짜의 경기를 보여줍니다." : "선택한 날짜의 전체 경기를 보여줍니다."}
          </p>
        </div>

        <div className="grid gap-3 xl:grid-cols-2">
          {matches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
          {!matches.length ? (
            <div className="rounded-md border p-4 text-sm text-muted-foreground">
              {favoriteOnly ? "응원팀 경기가 없습니다." : "선택한 날짜의 경기가 없습니다."}
            </div>
          ) : null}
        </div>
      </section>

      {searchOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 pt-20"
          onClick={() => setSearchOpen(false)}
        >
          <Card
            className="relative w-full max-w-2xl shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <ModalCardHeader
              title="경기 검색"
              description={`${title} 기준으로 검색합니다.`}
              onClose={() => setSearchOpen(false)}
            />
            <CardContent className="space-y-4 pt-0">
              <form className="flex items-end gap-2" onSubmit={searchMatches}>
                <div className="min-w-0 flex-1 space-y-2">
                  <Label htmlFor="match-search">검색어</Label>
                  <Input
                    id="match-search"
                    placeholder="팀명 또는 리그"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                  />
                </div>
                <Button type="submit">검색</Button>
              </form>
              <div className="grid gap-3">
                {searchResults.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
                {!searchResults.length && query.trim() ? (
                  <div className="rounded-md border p-4 text-sm text-muted-foreground">
                    검색 결과가 없습니다.
                  </div>
                ) : null}
                {!query.trim() ? (
                  <div className="rounded-md border p-4 text-sm text-muted-foreground">
                    검색어를 입력하면 결과가 표시됩니다.
                  </div>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
