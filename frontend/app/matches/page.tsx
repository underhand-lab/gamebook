import { MatchSearchScreen } from "@/features/matches/match-search-screen";

type MatchesPageProps = {
  searchParams: Promise<{
    q?: string;
    sportId?: string;
    leagueId?: string;
    teamId?: string;
  }>;
};

export default async function MatchesPage({ searchParams }: MatchesPageProps) {
  const { q, sportId, leagueId, teamId } = await searchParams;
  return (
    <MatchSearchScreen
      initialFilters={{
        q: q ?? "",
        sportId: sportId ?? "",
        leagueId: leagueId ?? "",
        teamId: teamId ?? "",
      }}
    />
  );
}
