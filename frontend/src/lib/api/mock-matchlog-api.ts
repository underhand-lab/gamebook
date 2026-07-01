import {
  leagues as seedLeagues,
  sports as seedSports,
  teams as seedTeams,
} from "./mock-data";
import type {
  MatchlogApi,
  MatchSearchParams,
  PostFeedItem,
  PostFeedParams,
  ReviewSearchParams,
} from "./matchlog-api";
import {
  createOrUpdateLog,
  createReview as createReviewAction,
  followUser as followUserAction,
  setReviewLike,
  statOptionsFor,
  unfollowUser as unfollowUserAction,
  statsFor,
  updateFavoriteTeams,
  updateLog,
  updateProfile,
  updateReview as updateReviewAction,
  upsertVote,
} from "./mock-actions";
import {
  aggregateFor,
  clone,
  logMatchesScope,
  page,
  playersFor,
  requireMatch,
  reviewMatchesScope,
  state,
  timelineItem,
  toSummary,
  wait,
} from "./mock-runtime";
import {
  getCalendarDay,
  getCalendarMonth,
  getTagDetail,
  listMatchesByDate,
  listTagMatches,
  searchTags,
} from "./mock-queries";

export const mockMatchlogApi: MatchlogApi = {
  async getMe() {
    await wait();
    return clone({ ...state.me, favoriteTeams: state.favoriteTeams });
  },
  async updateMyProfile(payload) {
    await wait();
    return updateProfile(payload);
  },
  async listFavoriteTeams() {
    await wait();
    return clone(state.favoriteTeams);
  },
  async updateFavoriteTeams(payload) {
    await wait();
    return updateFavoriteTeams(payload);
  },
  async listFollowingUsers(userId = state.me.id) {
    await wait();
    return clone(
      (state.followingByUserId[userId] ?? [])
        .map((userId) => state.users.find((user) => user.id === userId))
        .filter((user): user is NonNullable<typeof user> => Boolean(user))
        .map((user) => ({
          id: user.id,
          displayName: user.displayName,
          avatarUrl: user.avatarUrl,
        })),
    );
  },
  async listFollowerUsers(userId) {
    await wait();
    const followerIds = Object.entries(state.followingByUserId)
      .filter(([, following]) => following.includes(userId))
      .map(([id]) => id);
    return clone(
      followerIds
        .map((id) => state.users.find((user) => user.id === id))
        .filter((user): user is NonNullable<typeof user> => Boolean(user))
        .map((user) => ({
          id: user.id,
          displayName: user.displayName,
          avatarUrl: user.avatarUrl,
        })),
    );
  },
  async followUser(userId) {
    await wait();
    followUserAction(userId);
  },
  async unfollowUser(userId) {
    await wait();
    unfollowUserAction(userId);
  },
  async listSports() {
    await wait();
    return clone(seedSports);
  },
  async listLeagues(params) {
    await wait();
    const q = params?.q?.trim().toLowerCase();
    const items = seedLeagues.filter((league) => {
      const sportMatches = !params?.sportId || league.sportId === params.sportId;
      const queryMatches =
        !q ||
        [league.name, league.slug, league.country]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(q);

      return sportMatches && queryMatches;
    });
    return clone(items);
  },
  async listTeams(params) {
    await wait();
    const q = params?.q?.trim().toLowerCase();
    return clone(
      seedTeams.filter((team) => {
        const sportMatches = !params?.sportId || team.sportId === params.sportId;
        const leagueMatches =
          !params?.leagueId || team.leagueId === params.leagueId;
        const queryMatches =
          !q ||
          [team.name, team.shortName, team.slug]
            .join(" ")
            .toLowerCase()
            .includes(q);

        return sportMatches && leagueMatches && queryMatches;
      }),
    );
  },
  async searchMatches(params: MatchSearchParams = {}) {
    await wait();
    const q = params.q?.toLowerCase().trim();
    const filtered = state.matches.filter((match) => {
      const text = [
        match.homeTeam.name,
        match.awayTeam.name,
        match.league.name,
        match.sport.name,
      ]
        .join(" ")
        .toLowerCase();

      return (
        (!q || text.includes(q)) &&
        (!params.sportId || match.sport.id === params.sportId) &&
        (!params.leagueId || match.league.id === params.leagueId) &&
        (!params.teamId ||
          [match.homeTeam.id, match.awayTeam.id].includes(params.teamId))
      );
    });

    return page(filtered.map(toSummary), params);
  },
  async listMatchesByDate(date, params) {
    await wait();
    return listMatchesByDate(date, params);
  },
  async getMatchDetail(matchId: string) {
    await wait();
    return clone({ ...requireMatch(matchId), aggregate: aggregateFor(matchId) });
  },
  async getMatchAggregate(matchId: string, params) {
    await wait();
    requireMatch(matchId);
    return clone(aggregateFor(matchId, params));
  },
  async listMatchPlayers(matchId: string) {
    await wait();
    return clone(playersFor(matchId));
  },
  async createMatchLog(matchId, payload) {
    await wait();
    return createOrUpdateLog(matchId, payload);
  },
  async listMyLogs(params) {
    await wait();
    return page(
      state.logs.filter((log) => log.userId === state.me.id && logMatchesScope(log, params)),
      params,
    );
  },
  async listMyTimeline(params) {
    await wait();
    const items = state.logs
      .filter((log) => log.userId === state.me.id && logMatchesScope(log, params))
      .map(timelineItem)
      .filter((item) => matchesText(timelineText(item), params?.q))
      .sort((a, b) => Date.parse(b.timelineDate) - Date.parse(a.timelineDate));
    return page(items, params);
  },
  async updateMatchLog(logId, payload) {
    await wait();
    return updateLog(logId, payload);
  },
  async deleteMatchLog(logId) {
    await wait();
    state.logs = state.logs.filter((log) => log.id !== logId);
  },
  async listMatchReviews(matchId, params: ReviewSearchParams = {}) {
    await wait();
    let items = state.reviews.filter((review) => review.matchId === matchId);
    if (params.excludeUserId) {
      items = items.filter((review) => review.user.id !== params.excludeUserId);
    }
    if (params.fanPerspective) {
      items = items.filter(
        (review) => review.fanPerspective === params.fanPerspective,
      );
    }
    const q = params.q?.trim().toLowerCase();
    if (q) {
      items = items.filter((review) => {
        const text = [
          review.user.displayName,
          review.title,
          review.body,
          review.tags.map((tag) => tag.name).join(" "),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return text.includes(q);
      });
    }
    const sort = params.sort ?? "LATEST";
    items = [...items].sort((a, b) => {
      if (sort === "MOST_LIKED") return b.likeCount - a.likeCount;
      if (sort === "RATING_HIGH") return (b.rating ?? 0) - (a.rating ?? 0);
      if (sort === "RATING_LOW") return (a.rating ?? 0) - (b.rating ?? 0);
      return Date.parse(b.createdAt) - Date.parse(a.createdAt);
    });
    return page(items, params);
  },
  async createReview(matchId, payload) {
    await wait();
    return createReviewAction(matchId, payload);
  },
  async updateReview(reviewId, payload) {
    await wait();
    return updateReviewAction(reviewId, payload);
  },
  async deleteReview(reviewId) {
    await wait();
    state.reviews = state.reviews.filter((review) => review.id !== reviewId);
  },
  async likeReview(reviewId) {
    await wait();
    setReviewLike(reviewId, true);
  },
  async unlikeReview(reviewId) {
    await wait();
    setReviewLike(reviewId, false);
  },
  async searchTags(params) {
    await wait();
    return searchTags(params);
  },
  async getTagDetail(tagName) {
    await wait();
    return getTagDetail(tagName);
  },
  async listTagMatches(tagName, params) {
    await wait();
    return listTagMatches(tagName, params);
  },
  async upsertMvpVote(matchId, payload) {
    await wait();
    return upsertVote(matchId, payload.playerId);
  },
  async deleteMvpVote(matchId) {
    await wait();
    state.votes = state.votes.filter(
      (vote) => !(vote.matchId === matchId && vote.userId === state.me.id),
    );
  },
  async getMyCalendarMonth(month) {
    await wait();
    return getCalendarMonth(month);
  },
  async getMyCalendarDay(date) {
    await wait();
    return getCalendarDay(date);
  },
  async getUser(userId) {
    await wait();
    const user = state.users.find((item) => item.id === userId);
    if (!user) throw new Error(`User not found: ${userId}`);
    return clone(user);
  },
  async listFollowingPosts(params) {
    await wait();
    const followingIds = state.followingByUserId[state.me.id] ?? [];
    return page(listPostsForUsers(followingIds, params), params);
  },
  async listPopularPosts(params) {
    await wait();
    return page(
      listPostsForUsers(
        state.users.map((user) => user.id),
        { sort: "MOST_LIKED", ...params },
      ),
      params,
    );
  },
  async listUserPosts(userId, params) {
    await wait();
    return page(listPostsForUsers([userId], params), params);
  },
  async listUserReviews(userId, params) {
    await wait();
    return page(
      state.reviews.filter((review) => {
        if (review.user.id !== userId) return false;
        if (!matchesText(userReviewText(review), params?.q)) return false;
        return reviewMatchesScope(review, params);
      }),
      params,
    );
  },
  async listUserTimeline(userId, params) {
    await wait();
    const items = state.logs
      .filter((log) => log.userId === userId && logMatchesScope(log, params))
      .map(timelineItem)
      .filter((item) => matchesText(timelineText(item), params?.q))
      .sort((a, b) => Date.parse(b.timelineDate) - Date.parse(a.timelineDate));
    return page(items, params);
  },
  async getUserStats(userId, params) {
    await wait();
    return statsFor(userId, params);
  },
  async getUserStatOptions(userId, params) {
    await wait();
    return statOptionsFor(userId, params);
  },
};

function listPostsForUsers(userIds: string[], params: PostFeedParams = {}) {
  const userIdSet = new Set(userIds);
  const timelinePosts: PostFeedItem[] = state.logs
    .filter((log) => userIdSet.has(log.userId) && logMatchesScope(log, params))
    .map(timelineItem)
    .filter((item) => item.review && matchesText(timelineText(item), params.q))
    .map((item) => ({
      type: "timeline" as const,
      createdAt: item.timelineDate,
      item,
    }));
  const timelineReviewIds = new Set(
    timelinePosts.flatMap((post) => {
      if (post.type !== "timeline" || !post.item.review?.id) return [];
      return [post.item.review.id];
    }),
  );
  const reviewPosts: PostFeedItem[] = state.reviews
    .filter((review) => {
      if (!userIdSet.has(review.user.id)) return false;
      if (timelineReviewIds.has(review.id)) return false;
      if (!reviewMatchesScope(review, params)) return false;
      return matchesText(userReviewText(review), params.q);
    })
    .map((review) => ({
      type: "review" as const,
      createdAt: review.createdAt,
      review,
    }));

  return [...timelinePosts, ...reviewPosts].sort((a, b) => {
    if (params.sort === "MOST_LIKED") {
      return postLikeCount(b) - postLikeCount(a) || postTime(b) - postTime(a);
    }

    return postTime(b) - postTime(a);
  });
}

function postLikeCount(post: PostFeedItem) {
  return post.type === "timeline"
    ? (post.item.review?.likeCount ?? 0)
    : post.review.likeCount;
}

function postTime(post: PostFeedItem) {
  return Date.parse(post.createdAt);
}

function matchesText(text: string, q?: string) {
  const term = q?.trim().toLowerCase();
  return !term || text.toLowerCase().includes(term);
}

function userReviewText(review: { user: { displayName: string }; title?: string | null; body?: string | null; tags: { name: string }[] }) {
  return [
    review.user.displayName,
    review.title,
    review.body,
    review.tags.map((tag) => tag.name).join(" "),
  ]
    .filter(Boolean)
    .join(" ");
}

function timelineText(item: ReturnType<typeof timelineItem>) {
  return [
    item.matchSummary.homeTeam.name,
    item.matchSummary.homeTeam.shortName,
    item.matchSummary.awayTeam.name,
    item.matchSummary.awayTeam.shortName,
    item.matchLog.supportingTeam?.name,
    item.matchLog.supportingTeam?.shortName,
    item.review?.body,
    item.review?.title,
    item.userTags?.map((tag) => tag.name).join(" "),
    item.review?.tags?.map((tag) => tag.name).join(" "),
  ]
    .filter(Boolean)
    .join(" ");
}
