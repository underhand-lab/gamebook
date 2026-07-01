import {
  currentUser as seedCurrentUser,
  favoriteTeams as seedFavoriteTeams,
  logs as seedLogs,
  matches as seedMatches,
  mvpVotes as seedMvpVotes,
  players as seedPlayers,
  reviews as seedReviews,
  teams as seedTeams,
  users as seedUsers,
} from "./mock-data";
import type {
  Emotion,
  FanPerspective,
  MatchAggregate,
  MatchAggregateParams,
  MatchDetail,
  MatchLog,
  MatchLogAggregate,
  MatchSummary,
  MvpVote,
  PageParams,
  PageResponse,
  Player,
  RatingBucket,
  Review,
  Tag,
  Team,
} from "./matchlog-api";

const fanPerspectives: FanPerspective[] = [
  "HOME_FAN",
  "AWAY_FAN",
  "OTHER_TEAM_FAN",
  "NEUTRAL_FAN",
];

export const clone = <T>(value: T): T =>
  JSON.parse(JSON.stringify(value)) as T;

export const wait = async () =>
  new Promise((resolve) => setTimeout(resolve, 120));

export const state = {
  me: clone(seedCurrentUser),
  users: clone(seedUsers),
  matches: clone(seedMatches),
  reviews: clone(seedReviews),
  logs: clone(seedLogs),
  votes: clone(seedMvpVotes),
  favoriteTeams: clone(seedFavoriteTeams),
  followingByUserId: {
    "user-me": ["user-ana", "user-jun", "user-soo", "user-hae"],
    "user-ana": ["user-me"],
    "user-jun": ["user-me"],
    "user-soo": [],
    "user-hae": ["user-me"],
    "user-min": [],
  } as Record<string, string[]>,
  userTagCounter: 1,
};

export function page<T>(
  items: T[],
  { page = 0, size = 20 }: PageParams = {},
): PageResponse<T> {
  const start = page * size;

  return {
    items: clone(items.slice(start, start + size)),
    page,
    size,
    total: items.length,
  };
}

export function requireMatch(matchId: string): MatchDetail {
  const match = state.matches.find((item) => item.id === matchId);
  if (!match) {
    throw new Error(`Match not found: ${matchId}`);
  }
  return match;
}

export function toSummary(match: MatchDetail): MatchSummary {
  const aggregate = aggregateFor(match.id);

  return {
    id: match.id,
    sport: match.sport,
    league: match.league,
    homeTeam: match.homeTeam,
    awayTeam: match.awayTeam,
    matchDate: match.matchDate,
    status: match.status,
    score: match.score,
    averageRating: aggregate.averageRating ?? match.averageRating,
    reviewCount: aggregate.reviewCount ?? match.reviewCount,
  };
}

export function average(items: Array<number | undefined>) {
  const values = items.filter((item): item is number => typeof item === "number");
  if (!values.length) return 0;

  const value = values.reduce((sum, item) => sum + item, 0) / values.length;
  return Number(value.toFixed(1));
}

export function aggregateFor(
  matchId: string,
  params: MatchAggregateParams = {},
): MatchAggregate {
  const scopedReviews = state.reviews.filter((review) => {
    if (review.matchId !== matchId) return false;
    if (!params.fanPerspective) return true;
    if (params.fanPerspective === "TEAM_FANS") {
      return review.fanPerspective !== "NEUTRAL_FAN";
    }
    return review.fanPerspective === params.fanPerspective;
  });
  const scopedVotes = state.votes.filter((vote) => vote.matchId === matchId);

  return {
    reviewCount: scopedReviews.length,
    averageRating: average(scopedReviews.map((review) => review.rating)),
    ratingByFanPerspective: fanPerspectives.map((fanPerspective) =>
      fanRating(fanPerspective, scopedReviews),
    ),
    ratingDistribution: ratingDistribution(scopedReviews),
    ratingDistributionByFanPerspective: fanPerspectives.map((fanPerspective) =>
      fanRatingDistribution(fanPerspective, scopedReviews),
    ),
    mvpLeaders: leaders(scopedVotes),
    emotionDistribution: countByEmotion(scopedReviews),
    topTags: countByTag(scopedReviews),
  };
}

export type ScopeParams = {
  matchId?: string;
  leagueId?: string;
  teamId?: string;
};

export function matchMatchesScope(
  matchId: string,
  params: ScopeParams = {},
  supportingTeamId?: string | null,
) {
  if (!params.matchId && !params.leagueId && !params.teamId) return true;
  const match = state.matches.find((item) => item.id === matchId);
  if (!match) return false;
  if (params.matchId && match.id !== params.matchId) return false;
  const leagueMatch = !params.leagueId || match.league.id === params.leagueId;
  const teamMatch =
    !params.teamId ||
    match.homeTeam.id === params.teamId ||
    match.awayTeam.id === params.teamId ||
    supportingTeamId === params.teamId;
  return leagueMatch && teamMatch;
}

export function reviewMatchesScope(review: Review, params: ScopeParams = {}) {
  return matchMatchesScope(review.matchId, params);
}

export function logMatchesScope(
  log: { match: { id: string }; supportingTeam?: { id: string } | null },
  params: ScopeParams = {},
) {
  return matchMatchesScope(log.match.id, params, log.supportingTeam?.id);
}

export function ratingDistribution(scopedReviews: Review[]): RatingBucket[] {
  const total = scopedReviews.length || 1;
  const ratings = Array.from({ length: 10 }, (_, index) => 5 - index * 0.5);

  return ratings.map((rating) => {
    const count = scopedReviews.filter((review) => review.rating === rating).length;
    return {
      rating,
      count,
      percentage: Number(((count / total) * 100).toFixed(1)),
    };
  });
}

function fanRating(fanPerspective: FanPerspective, scopedReviews: Review[]) {
  const fanReviews = scopedReviews.filter(
    (review) => review.fanPerspective === fanPerspective,
  );

  return {
    fanPerspective,
    averageRating: average(fanReviews.map((review) => review.rating)),
    reviewCount: fanReviews.length,
  };
}

function fanRatingDistribution(
  fanPerspective: FanPerspective,
  scopedReviews: Review[],
) {
  const fanReviews = scopedReviews.filter(
    (review) => review.fanPerspective === fanPerspective,
  );

  return {
    ...fanRating(fanPerspective, scopedReviews),
    ratingDistribution: ratingDistribution(fanReviews),
    emotionDistribution: countByEmotion(fanReviews),
  };
}

function leaders(scopedVotes: MvpVote[]) {
  const total = scopedVotes.length || 1;
  const grouped = new Map<string, { player: Player; voteCount: number }>();
  scopedVotes.forEach((vote) => {
    const current = grouped.get(vote.player.id) ?? {
      player: vote.player,
      voteCount: 0,
    };
    current.voteCount += 1;
    grouped.set(vote.player.id, current);
  });

  return [...grouped.values()]
    .map((item) => ({
      ...item,
      percentage: Number(((item.voteCount / total) * 100).toFixed(1)),
    }))
    .sort((a, b) => b.voteCount - a.voteCount);
}

export function countByEmotion(scopedReviews: Review[]) {
  const grouped = new Map<Emotion, number>();
  scopedReviews.forEach((review) => {
    if (review.emotion) {
      grouped.set(review.emotion, (grouped.get(review.emotion) ?? 0) + 1);
    }
  });

  return [...grouped.entries()].map(([emotion, count]) => ({ emotion, count }));
}

function countByTag(scopedReviews: Review[]) {
  const grouped = new Map<string, { tag: Tag; count: number }>();
  scopedReviews.flatMap((review) => review.tags).forEach((tag) => {
    const current = grouped.get(tag.id) ?? { tag, count: 0 };
    current.count += 1;
    grouped.set(tag.id, current);
  });

  return [...grouped.values()].sort((a, b) => b.count - a.count);
}

export function playersFor(matchId: string) {
  const match = requireMatch(matchId);
  const teamIds = [match.homeTeam.id, match.awayTeam.id];

  return seedPlayers.filter((player) =>
    teamIds.includes(player.currentTeamId ?? ""),
  );
}

export function teamById(teamId?: string | null): Team | null {
  if (!teamId) return null;
  return seedTeams.find((team) => team.id === teamId) ?? null;
}

export function tagsFromNames(names: string[] = []): Tag[] {
  return names
    .map((name) => name.trim())
    .filter(Boolean)
    .map((name) => ({
      id: `tag-user-${name}-${state.userTagCounter++}`,
      name,
      tagType: "USER" as const,
    }));
}

export function timelineItem(log: MatchLog): MatchLogAggregate {
  const review =
    state.reviews.find(
      (item) => item.matchId === log.match.id && item.user.id === log.userId,
    ) ?? null;

  return {
    matchLog: log,
    review,
    userTags: review?.tags.filter((tag) => tag.tagType === "USER") ?? [],
    emotion: review?.emotion ?? null,
    mvpVote:
      state.votes.find(
        (vote) => vote.matchId === log.match.id && vote.userId === log.userId,
      ) ?? null,
    matchSummary: toSummary(requireMatch(log.match.id)),
    timelineDate: review?.updatedAt ?? log.watchedAt,
  };
}

export function syncMySummary() {
  state.users = state.users.map((user) =>
    user.id === state.me.id ? state.me : user,
  );
  state.reviews = state.reviews.map((review) =>
    review.user.id === state.me.id
      ? {
          ...review,
          user: {
            id: state.me.id,
            displayName: state.me.displayName,
            avatarUrl: state.me.avatarUrl,
          },
        }
      : review,
  );
}

export function rankTeams(userLogs: MatchLog[]) {
  const grouped = new Map<string, { team: Team; count: number }>();
  userLogs.forEach((log) => {
    [log.match.homeTeam, log.match.awayTeam].forEach((team) => {
      const current = grouped.get(team.id) ?? { team, count: 0 };
      current.count += 1;
      grouped.set(team.id, current);
    });
  });
  return [...grouped.values()].sort((a, b) => b.count - a.count);
}

export function rankPlayers(userId: string) {
  const grouped = new Map<string, { player: Player; count: number }>();
  state.votes
    .filter((vote) => vote.userId === userId)
    .forEach((vote) => {
      const current = grouped.get(vote.player.id) ?? {
        player: vote.player,
        count: 0,
      };
      current.count += 1;
      grouped.set(vote.player.id, current);
    });
  return [...grouped.values()].sort((a, b) => b.count - a.count);
}

export function rankStadiums(watchedMatches: MatchDetail[]) {
  type Stadium = NonNullable<MatchDetail["stadium"]>;
  const grouped = new Map<string, { stadium: Stadium; count: number }>();
  watchedMatches.forEach((match) => {
    if (!match.stadium) return;
    const current = grouped.get(match.stadium.id) ?? {
      stadium: match.stadium,
      count: 0,
    };
    current.count += 1;
    grouped.set(match.stadium.id, current);
  });
  return [...grouped.values()].sort((a, b) => b.count - a.count);
}
