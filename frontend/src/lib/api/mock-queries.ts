import type {
  DateMatchSearchParams,
  MatchSearchParams,
  Review,
  Tag,
  TagDetail,
  TagSearchParams,
} from "./matchlog-api";
import {
  average,
  clone,
  favoriteTeamsForUser,
  page,
  requireMatch,
  sessionUser,
  state,
  timelineItem,
  toSummary,
} from "./mock-runtime";

const dateKey = (value: string) => value.slice(0, 10);

function normalized(value: string) {
  return value.trim().toLowerCase();
}

function tagReviews(tagName: string) {
  const name = normalized(tagName);
  return state.reviews.filter((review) =>
    review.tags.some((tag) => normalized(tag.name) === name),
  );
}

type TagGroup = {
  tag: Tag;
  reviews: Review[];
};

function tagResult({ tag, reviews }: TagGroup) {
  const matchIds = new Set(reviews.map((review) => review.matchId));

  return {
    tag,
    reviewCount: reviews.length,
    matchCount: matchIds.size,
  };
}

export function searchTags(params: TagSearchParams = {}) {
  const grouped = new Map<string, TagGroup>();

  state.reviews.forEach((review) => {
    review.tags.forEach((tag) => {
      const key = `${tag.tagType}:${normalized(tag.name)}`;
      const current = grouped.get(key) ?? { tag, reviews: [] };
      current.reviews.push(review);
      grouped.set(key, current);
    });
  });

  const q = normalized(params.q ?? "");
  const items = [...grouped.values()]
    .map(tagResult)
    .filter((item) => !q || normalized(item.tag.name).includes(q))
    .filter((item) => !params.tagType || item.tag.tagType === params.tagType)
    .sort((a, b) => b.reviewCount - a.reviewCount);

  return page(items, params);
}

export function getTagDetail(tagName: string): TagDetail {
  const reviews = tagReviews(tagName);
  if (!reviews.length) throw new Error(`Tag not found: ${tagName}`);

  const matchedTag = reviews
    .flatMap((review) => review.tags)
    .find((tag) => normalized(tag.name) === normalized(tagName));
  if (!matchedTag) throw new Error(`Tag not found: ${tagName}`);

  const summary = tagResult({ tag: matchedTag, reviews });
  const topMatches = [...new Set(reviews.map((review) => review.matchId))]
    .map((matchId) => toSummary(requireMatch(matchId)))
    .sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0));

  return clone({ ...summary, topMatches });
}

export function listTagMatches(tagName: string, params: MatchSearchParams = {}) {
  const matchIds = new Set(tagReviews(tagName).map((review) => review.matchId));
  const matches = [...matchIds]
    .map((matchId) => toSummary(requireMatch(matchId)))
    .filter((match) => !params.sportId || match.sport.id === params.sportId)
    .filter((match) => !params.leagueId || match.league.id === params.leagueId)
    .filter(
      (match) =>
        !params.teamId ||
        [match.homeTeam.id, match.awayTeam.id].includes(params.teamId),
    );

  return page(matches, params);
}

export function listMatchesByDate(
  date: string,
  params: DateMatchSearchParams = {},
) {
  const viewer = sessionUser();
  const favoriteIds = viewer
    ? favoriteTeamsForUser(viewer.id).map((item) => item.team.id)
    : [];
  const requestedFavoriteIds = params.favoriteTeamId
    ? [params.favoriteTeamId]
    : favoriteIds;
  const shouldFilterFavorite = params.favoriteOnly || Boolean(params.favoriteTeamId);
  const q = params.q?.trim().toLowerCase();

  const matches = state.matches
    .filter((match) => dateKey(match.matchDate) === date)
    .filter((match) => {
      if (!q) return true;
      const text = [
        match.homeTeam.name,
        match.homeTeam.shortName,
        match.awayTeam.name,
        match.awayTeam.shortName,
        match.league.name,
        match.sport.name,
      ].join(" ").toLowerCase();
      return text.includes(q);
    })
    .filter((match) => !params.sportId || match.sport.id === params.sportId)
    .filter((match) => !params.leagueId || match.league.id === params.leagueId)
    .filter(
      (match) =>
        !params.teamId ||
        [match.homeTeam.id, match.awayTeam.id].includes(params.teamId),
    )
    .filter((match) => {
      if (!shouldFilterFavorite) return true;
      const teamIds = [match.homeTeam.id, match.awayTeam.id];
      return requestedFavoriteIds.some((teamId) => teamIds.includes(teamId));
    })
    .map(toSummary)
    .sort((a, b) => Date.parse(a.matchDate) - Date.parse(b.matchDate));
  const result = page(matches, params);

  return { date, ...result };
}

export function getCalendarMonth(month: string) {
  const viewer = sessionUser();
  if (!viewer) {
    return clone({ month, days: [] });
  }
  const logs = state.logs.filter(
    (log) => log.userId === viewer.id && dateKey(log.watchedAt).startsWith(month),
  );
  const dates = [...new Set(logs.map((log) => dateKey(log.watchedAt)))];
  const days = dates.sort().map((date) => {
    const dayLogs = logs.filter((log) => dateKey(log.watchedAt) === date);
    const reviews = reviewsForLogs(dayLogs);

    return {
      date,
      logCount: dayLogs.length,
      reviewCount: reviews.length,
      matches: dayLogs.map((log) => toSummary(requireMatch(log.match.id))),
      averageRating: reviews.length ? average(reviews.map((review) => review.rating)) : null,
    };
  });

  return clone({ month, days });
}

export function getCalendarDay(date: string) {
  const viewer = sessionUser();
  if (!viewer) {
    return clone({
      date,
      entries: [],
      logCount: 0,
      reviewCount: 0,
      averageRating: null,
    });
  }
  const entries = state.logs
    .filter((log) => log.userId === viewer.id && dateKey(log.watchedAt) === date)
    .map(timelineItem)
    .sort((a, b) => Date.parse(b.timelineDate) - Date.parse(a.timelineDate));
  const reviews = entries.flatMap((entry) => (entry.review ? [entry.review] : []));

  return clone({
    date,
    entries,
    logCount: entries.length,
    reviewCount: reviews.length,
    averageRating: reviews.length ? average(reviews.map((review) => review.rating)) : null,
  });
}

function reviewsForLogs(logs: typeof state.logs) {
  const viewer = sessionUser();
  if (!viewer) return [];
  const logMatchIds = new Set(logs.map((log) => log.match.id));
  return state.reviews.filter(
    (review) => review.user.id === viewer.id && logMatchIds.has(review.matchId),
  );
}
