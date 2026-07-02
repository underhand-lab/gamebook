"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DatePickerOverlay } from "@/components/domain/date-picker-overlay";
import { RadioPillGroup } from "@/components/domain/pill-radio-group";
import { StackedSearchSelect } from "@/components/domain/stacked-search-select";
import { Button } from "@/components/ui/button";
import { CalendarDayGrid } from "./calendar-day-grid";
import { CalendarResultsPanel } from "./calendar-results-panel";
import type { CalendarFilterState, CalendarMode } from "./calendar-types";
import {
  matchlogApi,
  type CalendarDaySummary,
  type CalendarDiaryDay,
  type CalendarMonth,
  type League,
  type MatchSummary,
  type Team,
} from "@/lib/api";

type CalendarDiaryScreenProps = {
  initialDate?: string;
  initialMode?: CalendarMode;
  initialFilters?: Partial<CalendarFilterState>;
};

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function buildCalendarUrl(
  date: string,
  mode: CalendarMode,
  filters: CalendarFilterState,
) {
  const params = new URLSearchParams({ date, mode });
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  return `/calendar?${params.toString()}`;
}

export function CalendarDiaryScreen({
  initialDate,
  initialMode = "all",
  initialFilters = {},
}: CalendarDiaryScreenProps) {
  const [selectedDate, setSelectedDate] = useState(initialDate ?? "2026-06-21");
  const [month, setMonth] = useState(selectedDate.slice(0, 7));
  const [mode, setMode] = useState<CalendarMode>(initialMode);
  const [summary, setSummary] = useState<CalendarMonth | null>(null);
  const [diary, setDiary] = useState<CalendarDiaryDay | null>(null);
  const [matches, setMatches] = useState<MatchSummary[]>([]);
  const [leagues, setLeagues] = useState<League[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamQuery, setTeamQuery] = useState("");
  const [leagueQuery, setLeagueQuery] = useState("");
  const [filters, setFilters] = useState<CalendarFilterState>({
    sportId: initialFilters.sportId ?? "",
    leagueId: initialFilters.leagueId ?? "",
    teamId: initialFilters.teamId ?? "",
  });
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

  const diaryEntries = useMemo(() => {
    const entries = diary?.entries ?? [];
    return entries.filter((entry) => {
      if (filters.leagueId && entry.matchSummary.league.id !== filters.leagueId) {
        return false;
      }
      if (!filters.teamId) return true;
      return (
        entry.matchSummary.homeTeam.id === filters.teamId ||
        entry.matchSummary.awayTeam.id === filters.teamId
      );
    });
  }, [diary, filters.leagueId, filters.teamId]);

  const loadCalendar = useCallback(async () => {
    const [monthSummary, diaryDay] = await Promise.all([
      matchlogApi.getMyCalendarMonth(month),
      matchlogApi.getMyCalendarDay(selectedDate),
    ]);
    setSummary(monthSummary);
    setDiary(diaryDay);
  }, [month, selectedDate]);

  const loadCatalog = useCallback(
    async (nextFilters = filters) => {
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
    },
    [filters, leagueQuery, teamQuery],
  );

  const loadMatches = useCallback(
    async (nextFilters = filters) => {
      const result = await matchlogApi.listMatchesByDate(selectedDate, {
        sportId: nextFilters.sportId,
        leagueId: nextFilters.leagueId,
        teamId: nextFilters.teamId,
        size: 50,
      });
      setMatches(result.items);
    },
    [filters, selectedDate],
  );

  useEffect(() => {
    loadCalendar();
  }, [loadCalendar]);

  useEffect(() => {
    loadCatalog();
  }, [loadCatalog]);

  useEffect(() => {
    loadMatches();
  }, [loadMatches]);

  useEffect(() => {
    if (filters.leagueId || leagueQuery) return;
    setTeamQuery("");
  }, [filters.leagueId, leagueQuery]);

  useEffect(() => {
    if (!filters.leagueId || leagueQuery) return;
    const selectedLeague = leagues.find((league) => league.id === filters.leagueId);
    if (selectedLeague) setLeagueQuery(selectedLeague.name);
  }, [filters.leagueId, leagueQuery, leagues]);

  useEffect(() => {
    if (!filters.teamId || teamQuery) return;
    const selectedTeam = teams.find((team) => team.id === filters.teamId);
    if (selectedTeam) setTeamQuery(selectedTeam.name);
  }, [filters.teamId, teamQuery, teams]);

  function selectDate(date: string) {
    setPickerOpen(false);
    setSelectedDate(date);
    setMonth(date.slice(0, 7));
    window.history.replaceState(null, "", buildCalendarUrl(date, mode, filters));
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
    window.history.replaceState(null, "", buildCalendarUrl(nextDate, mode, filters));
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

  function changeMode(nextMode: string) {
    const calendarMode = nextMode as CalendarMode;
    setMode(calendarMode);
    window.history.replaceState(
      null,
      "",
      buildCalendarUrl(selectedDate, calendarMode, filters),
    );
  }

  function update<K extends keyof CalendarFilterState>(
    key: K,
    value: CalendarFilterState[K],
  ) {
    const next = { ...filters, [key]: value };
    if (key === "sportId") {
      next.leagueId = "";
      next.teamId = "";
      setLeagueQuery("");
      setTeamQuery("");
    }
    if (key === "leagueId") {
      next.teamId = "";
      setTeamQuery("");
    }
    setFilters(next);
    window.history.replaceState(null, "", buildCalendarUrl(selectedDate, mode, next));
  }

  return (
    <div className="page-shell space-y-5">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
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

          <RadioPillGroup
            groupClassName="rounded-full border border-border/70 bg-card p-1"
            columnsClassName="grid-cols-2"
            name="calendar-mode"
            value={mode}
            options={[
              { value: "all", label: "전체 경기" },
              { value: "mine", label: "내 기록" },
            ]}
            onChange={changeMode}
          />

          <div className="grid flex-1 gap-3 lg:grid-cols-2">
            <StackedSearchSelect
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
            />
            <StackedSearchSelect
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
            />
          </div>
        </div>
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
        <CalendarDayGrid
          days={days}
          selectedDate={selectedDate}
          dayMap={dayMap}
          onSelectDate={selectDate}
        />
        <CalendarResultsPanel
          mode={mode}
          diary={diary}
          diaryEntries={diaryEntries}
          matches={matches}
        />
      </div>
    </div>
  );
}
