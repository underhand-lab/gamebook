import { CalendarDiaryScreen } from "@/features/calendar/calendar-diary-screen";

type CalendarPageProps = {
  searchParams: Promise<{
    date?: string;
    mode?: string;
    sportId?: string;
    leagueId?: string;
    teamId?: string;
  }>;
};

export default async function CalendarPage({ searchParams }: CalendarPageProps) {
  const { date, mode, sportId, leagueId, teamId } = await searchParams;

  return (
    <CalendarDiaryScreen
      initialDate={date}
      initialMode={mode === "mine" ? "mine" : "all"}
      initialFilters={{
        sportId: sportId ?? "",
        leagueId: leagueId ?? "",
        teamId: teamId ?? "",
      }}
    />
  );
}
