import { MatchDetailScreen } from "@/features/matches/match-detail-screen";

type MatchPageProps = {
  params: Promise<{ matchId: string }>;
};

export default async function MatchPage({ params }: MatchPageProps) {
  const { matchId } = await params;

  return <MatchDetailScreen matchId={matchId} />;
}
