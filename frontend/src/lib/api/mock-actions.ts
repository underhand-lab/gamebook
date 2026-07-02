import type {
  CreateMatchLogRequest,
  CreateReviewRequest,
  FavoriteTeam,
  MatchLog,
  Review,
  UpdateFavoriteTeamsRequest,
  UpdateProfileRequest,
  UpdateReviewRequest,
  UserStatOptions,
  UserStats,
} from "./matchlog-api";
import { leagues, sports } from "./mock-data";
import {
  average,
  clone,
  countByEmotion,
  favoriteTeamsForUser,
  logMatchesScope,
  playersFor,
  ratingDistribution,
  rankPlayers,
  rankStadiums,
  rankTeams,
  requireMatch,
  requireSessionUser,
  reviewMatchesScope,
  state,
  syncMySummary,
  tagsFromNames,
  teamById,
  toSummary,
} from "./mock-runtime";

function reviewDefaults(matchId: string) {
  return {
    gameId: matchId,
    visibility: "public" as const,
    federated: false,
    watchedType: "unknown" as const,
    canonicalUrl: null,
    activityPubObjectUrl: null,
    activityPubActivityUrl: null,
    federatedAt: null,
    federationStatus: "none" as const,
  };
}

export function updateProfile(payload: UpdateProfileRequest) {
  const me = requireSessionUser();
  const updated = {
    ...me,
    displayName: payload.displayName ?? me.displayName,
    bio: payload.bio === undefined ? me.bio : payload.bio,
    primaryTeam:
      payload.primaryTeamId === undefined
        ? me.primaryTeam
        : teamById(payload.primaryTeamId),
  };
  state.users = state.users.map((user) => (user.id === me.id ? updated : user));
  syncMySummary();
  return clone(updated);
}

export function updateFavoriteTeams(payload: UpdateFavoriteTeamsRequest) {
  const me = requireSessionUser();
  const uniqueTeamIds = [...new Set(payload.teamIds)];
  const now = new Date().toISOString();

  const nextFavorites = uniqueTeamIds.flatMap((teamId): FavoriteTeam[] => {
    const team = teamById(teamId);
    if (!team) return [];
    const sport = sports.find((item) => item.id === team.sportId);
    const league = leagues.find((item) => item.id === team.leagueId);
    if (!sport || !league) return [];

    return [
      {
        id: `favorite-${me.id}-${team.id}`,
        userId: me.id,
        sport,
        league,
        team,
        createdAt:
          favoriteTeamsForUser(me.id).find((item) => item.team.id === team.id)?.createdAt ??
          now,
      },
    ];
  });

  state.favoriteTeamsByUserId[me.id] = nextFavorites;
  state.users = state.users.map((user) =>
    user.id === me.id
      ? {
          ...user,
          favoriteTeams: nextFavorites,
          primaryTeam: nextFavorites[0]?.team ?? user.primaryTeam ?? null,
        }
      : user,
  );
  syncMySummary();
  return clone(nextFavorites);
}

export function followUser(userId: string) {
  const me = requireSessionUser();
  if (userId === me.id) return;
  const current = state.followingByUserId[me.id] ?? [];
  if (!current.includes(userId)) {
    state.followingByUserId[me.id] = [...current, userId];
  }
}

export function unfollowUser(userId: string) {
  const me = requireSessionUser();
  const current = state.followingByUserId[me.id] ?? [];
  state.followingByUserId[me.id] = current.filter((id) => id !== userId);
}

export function createOrUpdateLog(
  matchId: string,
  payload: CreateMatchLogRequest,
) {
  const me = requireSessionUser();
  const existing = state.logs.find(
    (log) => log.userId === me.id && log.match.id === matchId,
  );
  const next = {
    ...(existing ?? {
      id: `log-${matchId}-${Date.now()}`,
      userId: me.id,
      attendanceVerified: false,
    }),
    match: toSummary(requireMatch(matchId)),
    watchedAt: payload.watchedAt,
    watchType: payload.watchType,
    supportingTeam: teamById(payload.supportingTeamId),
    fanPerspective: payload.fanPerspective,
  } satisfies MatchLog;

  state.logs = existing
    ? state.logs.map((log) => (log.id === existing.id ? next : log))
    : [next, ...state.logs];
  return clone(next);
}

export function updateLog(logId: string, payload: CreateMatchLogRequest) {
  const existing = state.logs.find((log) => log.id === logId);
  if (!existing) throw new Error(`Log not found: ${logId}`);
  const updated = {
    ...existing,
    watchedAt: payload.watchedAt,
    watchType: payload.watchType,
    supportingTeam: teamById(payload.supportingTeamId),
    fanPerspective: payload.fanPerspective,
  };
  state.logs = state.logs.map((log) => (log.id === logId ? updated : log));
  return clone(updated);
}

export function createReview(matchId: string, payload: CreateReviewRequest) {
  const me = requireSessionUser();
  const now = new Date().toISOString();
  const review: Review = {
    id: `review-${matchId}-${Date.now()}`,
    matchId,
    ...reviewDefaults(matchId),
    user: {
      id: me.id,
      displayName: me.displayName,
      avatarUrl: me.avatarUrl,
      handle: me.handle,
      actorUrl: me.actorUrl,
      inboxUrl: me.inboxUrl,
      outboxUrl: me.outboxUrl,
      followersUrl: me.followersUrl,
      followingUrl: me.followingUrl,
      isLocalUser: me.isLocalUser,
    },
    rating: payload.rating,
    title: payload.title ?? null,
    body: payload.body ?? null,
    spoiler: payload.spoiler ?? false,
    emotion: payload.emotion ?? null,
    fanPerspective: payload.fanPerspective,
    tags: tagsFromNames(payload.userTagNames),
    likeCount: 0,
    likedByMe: false,
    createdAt: now,
    updatedAt: now,
    visibility: payload.visibility ?? "public",
    federated: payload.federated ?? false,
    watchedType: payload.watchedType ?? "unknown",
    canonicalUrl: payload.canonicalUrl ?? null,
    activityPubObjectUrl: payload.activityPubObjectUrl ?? null,
    activityPubActivityUrl: payload.activityPubActivityUrl ?? null,
    federatedAt: payload.federated ? now : null,
    federationStatus: payload.federationStatus ?? "none",
  };
  state.reviews = [review, ...state.reviews];
  return clone(review);
}

export function updateReview(reviewId: string, payload: UpdateReviewRequest) {
  const existing = state.reviews.find((review) => review.id === reviewId);
  if (!existing) throw new Error(`Review not found: ${reviewId}`);
  const updated = {
    ...existing,
    rating: payload.rating ?? existing.rating,
    title: payload.title === undefined ? existing.title : payload.title,
    body: payload.body === undefined ? existing.body : payload.body,
    spoiler: payload.spoiler ?? existing.spoiler,
    emotion: payload.emotion === undefined ? existing.emotion : payload.emotion,
    tags: payload.userTagNames ? tagsFromNames(payload.userTagNames) : existing.tags,
    updatedAt: new Date().toISOString(),
    visibility: payload.visibility ?? existing.visibility,
    federated: payload.federated ?? existing.federated,
    watchedType: payload.watchedType ?? existing.watchedType,
    canonicalUrl:
      payload.canonicalUrl === undefined ? existing.canonicalUrl : payload.canonicalUrl,
    activityPubObjectUrl:
      payload.activityPubObjectUrl === undefined
        ? existing.activityPubObjectUrl
        : payload.activityPubObjectUrl,
    activityPubActivityUrl:
      payload.activityPubActivityUrl === undefined
        ? existing.activityPubActivityUrl
        : payload.activityPubActivityUrl,
    federatedAt: payload.federated ? new Date().toISOString() : existing.federatedAt,
    federationStatus: payload.federationStatus ?? existing.federationStatus,
  };
  state.reviews = state.reviews.map((review) =>
    review.id === reviewId ? updated : review,
  );
  return clone(updated);
}

export function setReviewLike(reviewId: string, liked: boolean) {
  state.reviews = state.reviews.map((review) => {
    if (review.id !== reviewId || review.likedByMe === liked) return review;

    return {
      ...review,
      likedByMe: liked,
      likeCount: Math.max(0, review.likeCount + (liked ? 1 : -1)),
    };
  });
}

export function upsertVote(matchId: string, playerId: string) {
  const me = requireSessionUser();
  const player = playersFor(matchId).find((item) => item.id === playerId);
  if (!player) throw new Error(`Player not found: ${playerId}`);
  const existing = state.votes.find(
    (vote) => vote.matchId === matchId && vote.userId === me.id,
  );
  const next = {
    ...(existing ?? {
      id: `vote-${matchId}-${Date.now()}`,
      matchId,
      userId: me.id,
      createdAt: new Date().toISOString(),
    }),
    player,
    updatedAt: new Date().toISOString(),
  };

  state.votes = existing
    ? state.votes.map((vote) => (vote.id === existing.id ? next : vote))
    : [next, ...state.votes];
  return clone(next);
}

export function statsFor(
  userId: string,
  params: { leagueId?: string; teamId?: string } = {},
) {
  const userLogs = state.logs.filter(
    (log) => log.userId === userId && logMatchesScope(log, params),
  );
  const userReviews = state.reviews.filter((review) => {
    if (review.user.id !== userId) return false;
    return reviewMatchesScope(review, params);
  });
  const watchedMatches = userLogs.map((log) => requireMatch(log.match.id));
  const stats: UserStats = {
    totalMatches: userLogs.length,
    inPersonMatches: userLogs.filter((log) => log.watchType === "IN_PERSON")
      .length,
    liveMatches: userLogs.filter((log) => log.watchType === "LIVE").length,
    averageRating: average(userReviews.map((review) => review.rating)),
    reviewCount: userReviews.length,
    receivedLikes: userReviews.reduce((sum, review) => sum + review.likeCount, 0),
    ratingDistribution: ratingDistribution(userReviews),
    mostWatchedTeams: rankTeams(userLogs),
    mostWatchedPlayers: rankPlayers(userId),
    mostVisitedStadiums: rankStadiums(watchedMatches),
    inPersonWinRate: 0.61,
    supportingTeamWinRate: 0.54,
    topEmotions: countByEmotion(userReviews),
    timelineCount: userLogs.length,
  };
  return clone(stats);
}

export function statOptionsFor(
  userId: string,
  params: { leagueId?: string } = {},
): UserStatOptions {
  const matchesById = new Map(
    state.logs
      .filter((log) => log.userId === userId)
      .map((log) => {
        const match = requireMatch(log.match.id);
        return [match.id, match] as const;
      }),
  );

  state.reviews.forEach((review) => {
    if (review.user.id !== userId) return;
    const match = requireMatch(review.matchId);
    matchesById.set(match.id, match);
  });

  const matches = [...matchesById.values()];
  const leagues = [
    ...new Map(
      matches.map((match) => [
        match.league.id,
        { id: match.league.id, name: match.league.name },
      ] as const),
    ).values(),
  ];
  const teams = [
    ...new Map(
      matches
        .filter((match) => !params.leagueId || match.league.id === params.leagueId)
        .flatMap((match) => [
          [
            match.homeTeam.id,
            {
              id: match.homeTeam.id,
              name: match.homeTeam.name,
              leagueId: match.league.id,
            },
          ] as const,
          [
            match.awayTeam.id,
            {
              id: match.awayTeam.id,
              name: match.awayTeam.name,
              leagueId: match.league.id,
            },
          ] as const,
        ]),
    ).values(),
  ];

  return clone({ leagues, teams });
}
