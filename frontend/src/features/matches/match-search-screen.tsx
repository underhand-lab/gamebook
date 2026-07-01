"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { MatchCard } from "@/components/domain/match-card";
import { ModalCardHeader } from "@/components/domain/modal-card-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TagSearchPanel } from "@/features/tags/tag-search-panel";
import { matchlogApi, type League, type MatchSummary, type Team } from "@/lib/api";
import { StackedSearchSelect } from "@/components/domain/stacked-search-select";

type FilterState = {
  q: string;
  sportId: string;
  leagueId: string;
  teamId: string;
};

type MatchSearchScreenProps = {
  initialFilters?: Partial<FilterState>;
};

export function MatchSearchScreen({ initialFilters = {} }: MatchSearchScreenProps) {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<MatchSummary[]>([]);
  const [teamQuery, setTeamQuery] = useState("");
  const [leagueQuery, setLeagueQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    q: initialFilters.q ?? "",
    sportId: initialFilters.sportId ?? "",
    leagueId: initialFilters.leagueId ?? "",
    teamId: initialFilters.teamId ?? "",
  });

  async function loadCatalog(nextFilters = filters) {
    const [leagueItems, teamItems] = await Promise.all([
      matchlogApi.listLeagues({
        q: leagueQuery,
        sportId: nextFilters.sportId,
      }),
      matchlogApi.listTeams({
        q: teamQuery,
        sportId: nextFilters.sportId,
        leagueId: nextFilters.leagueId,
      }),
    ]);
    setLeagues(leagueItems);
    setTeams(teamItems);
  }

  async function search(nextFilters = filters) {
    const result = await matchlogApi.searchMatches({
      q: nextFilters.q,
      sportId: nextFilters.sportId,
      leagueId: nextFilters.leagueId,
      teamId: nextFilters.teamId,
      size: 20,
    });
    setMatches(result.items);
  }

  useEffect(() => {
    search();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadCatalog();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.sportId, filters.leagueId, leagueQuery, teamQuery]);

  useEffect(() => {
    setFilters({
      q: initialFilters.q ?? "",
      sportId: initialFilters.sportId ?? "",
      leagueId: initialFilters.leagueId ?? "",
      teamId: initialFilters.teamId ?? "",
    });
  }, [initialFilters.q, initialFilters.sportId, initialFilters.teamId, initialFilters.leagueId]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    search();
  }

  function update<K extends keyof FilterState>(key: K, value: FilterState[K]) {
    const next = { ...filters, [key]: value };
    if (key === "sportId") {
      next.leagueId = "";
      next.teamId = "";
    }
    if (key === "leagueId") {
      next.teamId = "";
    }
    setFilters(next);
  }

  return (
    <div className="page-shell space-y-5">
      <section className="rounded-[1.75rem] border border-border/70 bg-card/90 p-4 shadow-sm shadow-black/5 sm:p-5">
        <div className="mb-4">
          <p className="text-sm font-medium text-primary">Search posts</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">경기 기록 찾기</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            팀, 리그, 종목 기준으로 피드 속 게시물을 빠르게 찾습니다.
          </p>
        </div>
        <Card className="border-0 bg-transparent shadow-none">
          <ModalCardHeader title="경기 기록 찾기" onClose={() => window.history.back()} />
          <CardContent className="p-0">
            <form className="grid gap-3 md:grid-cols-[1.5fr_1fr_1fr_1fr_auto]" onSubmit={onSubmit}>
              <div>
                <Input
                  placeholder="검색어"
                  value={filters.q}
                  onChange={(event) => update("q", event.target.value)}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <StackedSearchSelect
                  label="리그명"
                  placeholder="리그명 검색"
                  query={leagueQuery}
                  options={leagues.map((league) => ({
                    value: league.id,
                    label: league.name,
                    description: league.slug,
                  }))}
                  onQueryChange={setLeagueQuery}
                  onPick={(option) => {
                    setLeagueQuery(option.label);
                    update("leagueId", option.value);
                  }}
                  onSubmit={(value) => {
                    update("q", value);
                  }}
                />
              </div>
              <div className="space-y-2">
                <StackedSearchSelect
                  label="팀명"
                  placeholder="팀명 검색"
                  query={teamQuery}
                  options={teams.map((team) => ({
                    value: team.id,
                    label: team.name,
                    description: team.shortName,
                  }))}
                  onQueryChange={setTeamQuery}
                  onPick={(option) => {
                    setTeamQuery(option.label);
                    update("teamId", option.value);
                  }}
                  onSubmit={(value) => {
                    update("q", value);
                  }}
                />
              </div>
              <Button className="md:self-end" type="submit">
                <Search className="h-4 w-4" />
                검색
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>

      <TagSearchPanel />

      <section className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <SlidersHorizontal className="h-4 w-4" />
          {matches.length}개 게시물
        </div>
        {matches.map((match) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </section>
    </div>
  );
}
