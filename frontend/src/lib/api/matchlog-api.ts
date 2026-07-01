export type MatchStatus =
  | "SCHEDULED"
  | "LIVE"
  | "FINAL"
  | "POSTPONED"
  | "CANCELED";

export type WatchType = "IN_PERSON" | "LIVE" | "OTHER";
export type FanPerspective =
  | "HOME_FAN"
  | "AWAY_FAN"
  | "OTHER_TEAM_FAN"
  | "NEUTRAL_FAN";
export type MatchAggregateScope = FanPerspective | "TEAM_FANS";
export type Emotion = "HAPPY" | "MOVED" | "TENSE" | "ANGRY" | "SHOCKED";
export type TagType = "OFFICIAL" | "USER";
export type ReviewSort =
  | "LATEST"
  | "MOST_LIKED"
  | "RATING_HIGH"
  | "RATING_LOW";

export type SignupRequest = {
  email: string;
  password: string;
  displayName: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type UpdateProfileRequest = {
  displayName?: string;
  bio?: string | null;
  primaryTeamId?: string | null;
};

export type UpdateFavoriteTeamsRequest = {
  teamIds: string[];
};

export type UserSummary = {
  id: string;
  displayName: string;
  avatarUrl?: string | null;
  handle?: string;
  actorUrl?: string;
  inboxUrl?: string;
  outboxUrl?: string;
  followersUrl?: string;
  followingUrl?: string;
  isLocalUser?: boolean;
};

export type UserDetail = UserSummary & {
  email: string;
  bio?: string | null;
  primaryTeam?: Team | null;
  favoriteTeams?: FavoriteTeam[];
};

export type AuthResponse = {
  accessToken: string;
  user: UserDetail;
};

export type Sport = {
  id: string;
  name: string;
  slug: string;
};

export type League = {
  id: string;
  sportId: string;
  name: string;
  country?: string;
  slug: string;
};

export type Team = {
  id: string;
  sportId: string;
  leagueId?: string;
  name: string;
  shortName: string;
  slug: string;
};

export type FavoriteTeam = {
  id: string;
  userId: string;
  sport: Sport;
  league: League;
  team: Team;
  createdAt: string;
};

export type Player = {
  id: string;
  sportId: string;
  currentTeamId?: string;
  name: string;
  slug?: string;
};

export type Stadium = {
  id: string;
  name: string;
  city?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
};

export type Score = {
  home?: number | null;
  away?: number | null;
};

export type MatchSummary = {
  id: string;
  sport: Sport;
  league: League;
  homeTeam: Team;
  awayTeam: Team;
  matchDate: string;
  status: MatchStatus;
  score?: Score;
  averageRating?: number;
  reviewCount?: number;
};

export type MatchDetail = MatchSummary & {
  stadium?: Stadium;
  aggregate?: MatchAggregate;
};

export type FanRating = {
  fanPerspective: FanPerspective;
  averageRating: number;
  reviewCount: number;
};

export type RatingBucket = {
  rating: number;
  count: number;
  percentage?: number;
};

export type FanRatingDistribution = FanRating & {
  ratingDistribution: RatingBucket[];
  emotionDistribution: EmotionCount[];
};

export type MvpLeader = {
  player: Player;
  voteCount: number;
  percentage?: number;
};

export type EmotionCount = {
  emotion: Emotion;
  count: number;
};

export type Tag = {
  id: string;
  name: string;
  tagType: TagType;
};

export type TagCount = {
  tag: Tag;
  count: number;
};

export type MatchAggregate = {
  reviewCount?: number;
  averageRating?: number;
  ratingByFanPerspective?: FanRating[];
  ratingDistribution?: RatingBucket[];
  ratingDistributionByFanPerspective?: FanRatingDistribution[];
  mvpLeaders?: MvpLeader[];
  emotionDistribution?: EmotionCount[];
  topTags?: TagCount[];
};

export type MatchAggregateParams = {
  fanPerspective?: MatchAggregateScope;
};

export type CreateMatchLogRequest = {
  watchedAt: string;
  watchType: WatchType;
  supportingTeamId?: string | null;
  fanPerspective: FanPerspective;
};

export type UpdateMatchLogRequest = CreateMatchLogRequest;

export type MatchLog = {
  id: string;
  userId: string;
  match: MatchSummary;
  watchedAt: string;
  watchType: WatchType;
  supportingTeam?: Team | null;
  fanPerspective: FanPerspective;
  attendanceVerified: boolean;
};

export type CreateReviewRequest = {
  matchLogId: string;
  rating?: number;
  title?: string | null;
  body?: string | null;
  spoiler?: boolean;
  emotion?: Emotion | null;
  fanPerspective: FanPerspective;
  userTagNames?: string[];
  visibility?: ReviewVisibility;
  federated?: boolean;
  watchedType?: ReviewWatchedType;
  canonicalUrl?: string | null;
  activityPubObjectUrl?: string | null;
  activityPubActivityUrl?: string | null;
  federationStatus?: FederationStatus;
};

export type UpdateReviewRequest = {
  rating?: number;
  title?: string | null;
  body?: string | null;
  spoiler?: boolean;
  emotion?: Emotion | null;
  userTagNames?: string[];
  visibility?: ReviewVisibility;
  federated?: boolean;
  watchedType?: ReviewWatchedType;
  canonicalUrl?: string | null;
  activityPubObjectUrl?: string | null;
  activityPubActivityUrl?: string | null;
  federationStatus?: FederationStatus;
};

export type ReviewVisibility = "public" | "local" | "followers" | "private";
export type ReviewWatchedType =
  | "live"
  | "tv"
  | "highlight"
  | "memory"
  | "rewatch"
  | "radio"
  | "unknown";
export type FederationStatus = "none" | "pending" | "published" | "failed";

export type Review = {
  id: string;
  matchId: string;
  gameId: string;
  user: UserSummary;
  rating?: number;
  title?: string | null;
  body?: string | null;
  spoiler: boolean;
  emotion?: Emotion | null;
  fanPerspective: FanPerspective;
  tags: Tag[];
  likeCount: number;
  likedByMe: boolean;
  createdAt: string;
  updatedAt?: string;
  visibility: ReviewVisibility;
  federated: boolean;
  watchedType?: ReviewWatchedType;
  canonicalUrl?: string | null;
  activityPubObjectUrl?: string | null;
  activityPubActivityUrl?: string | null;
  federatedAt?: string | null;
  federationStatus?: FederationStatus;
};

export type UpsertMvpVoteRequest = {
  playerId: string;
};

export type MvpVote = {
  id: string;
  matchId: string;
  userId: string;
  player: Player;
  createdAt: string;
  updatedAt?: string;
};

export type MatchLogAggregate = {
  matchLog: MatchLog;
  review?: Review | null;
  userTags?: Tag[];
  emotion?: Emotion | null;
  mvpVote?: MvpVote | null;
  matchSummary: MatchSummary;
  timelineDate: string;
};

export type PostFeedItem =
  | { type: "timeline"; createdAt: string; item: MatchLogAggregate }
  | { type: "review"; createdAt: string; review: Review };

export type TagSearchResult = {
  tag: Tag;
  reviewCount: number;
  matchCount: number;
};

export type TagDetail = {
  tag: Tag;
  reviewCount: number;
  matchCount: number;
  topMatches: MatchSummary[];
};

export type DateMatchPage = PageResponse<MatchSummary> & {
  date: string;
};

export type CalendarDaySummary = {
  date: string;
  logCount: number;
  reviewCount: number;
  averageRating?: number | null;
  matches?: MatchSummary[];
};

export type CalendarMonth = {
  month: string;
  days: CalendarDaySummary[];
};

export type CalendarDiaryDay = {
  date: string;
  entries: MatchLogAggregate[];
  logCount: number;
  reviewCount: number;
  averageRating?: number | null;
};

export type PageResponse<T> = {
  items: T[];
  page: number;
  size: number;
  total: number;
};

export type MatchPage = PageResponse<MatchSummary>;
export type ReviewPage = PageResponse<Review>;
export type MatchLogPage = PageResponse<MatchLog>;
export type MatchLogAggregatePage = PageResponse<MatchLogAggregate>;
export type PostFeedPage = PageResponse<PostFeedItem>;
export type TagPage = PageResponse<TagSearchResult>;

export type RankedTeam = {
  team: Team;
  count: number;
};

export type RankedPlayer = {
  player: Player;
  count: number;
};

export type RankedStadium = {
  stadium: Stadium;
  count: number;
};

export type UserStats = {
  totalMatches?: number;
  inPersonMatches?: number;
  liveMatches?: number;
  averageRating?: number;
  reviewCount?: number;
  receivedLikes?: number;
  ratingDistribution?: RatingBucket[];
  mostWatchedTeams?: RankedTeam[];
  mostWatchedPlayers?: RankedPlayer[];
  mostVisitedStadiums?: RankedStadium[];
  inPersonWinRate?: number | null;
  supportingTeamWinRate?: number | null;
  topEmotions?: EmotionCount[];
  timelineCount?: number;
};

export type UserStatOption = {
  id: string;
  name: string;
  leagueId?: string;
};

export type UserStatOptions = {
  leagues: UserStatOption[];
  teams: UserStatOption[];
};

export type ErrorResponse = {
  code: string;
  message: string;
  details?: { field?: string; reason?: string }[];
};

export type MatchSearchParams = {
  q?: string;
  sportId?: string;
  leagueId?: string;
  teamId?: string;
  from?: string;
  to?: string;
  page?: number;
  size?: number;
};

export type ReviewSearchParams = {
  q?: string;
  excludeUserId?: string;
  fanPerspective?: FanPerspective;
  sort?: ReviewSort;
  page?: number;
  size?: number;
};

export type PageParams = {
  q?: string;
  page?: number;
  size?: number;
  matchId?: string;
  leagueId?: string;
  teamId?: string;
};

export type TagSearchParams = PageParams & {
  q?: string;
  tagType?: TagType;
};

export type DateMatchSearchParams = PageParams & {
  q?: string;
  sportId?: string;
  leagueId?: string;
  favoriteTeamId?: string;
  favoriteOnly?: boolean;
};

export type LeagueSearchParams = {
  q?: string;
  sportId?: string;
};

export type TeamSearchParams = {
  q?: string;
  sportId?: string;
  leagueId?: string;
};

export type PostFeedParams = PageParams & {
  sort?: "LATEST" | "MOST_LIKED";
};

export type MatchlogApi = {
  getMe(): Promise<UserDetail>;
  updateMyProfile(payload: UpdateProfileRequest): Promise<UserDetail>;
  followUser(userId: string): Promise<void>;
  unfollowUser(userId: string): Promise<void>;
  listFollowingUsers(userId?: string): Promise<UserSummary[]>;
  listFollowerUsers(userId: string): Promise<UserSummary[]>;
  listFavoriteTeams(): Promise<FavoriteTeam[]>;
  updateFavoriteTeams(
    payload: UpdateFavoriteTeamsRequest,
  ): Promise<FavoriteTeam[]>;
  listSports(): Promise<Sport[]>;
  listLeagues(params?: LeagueSearchParams): Promise<League[]>;
  listTeams(params?: TeamSearchParams): Promise<Team[]>;
  searchMatches(params?: MatchSearchParams): Promise<MatchPage>;
  listMatchesByDate(
    date: string,
    params?: DateMatchSearchParams,
  ): Promise<DateMatchPage>;
  getMatchDetail(matchId: string): Promise<MatchDetail>;
  getMatchAggregate(
    matchId: string,
    params?: MatchAggregateParams,
  ): Promise<MatchAggregate>;
  listMatchPlayers(matchId: string): Promise<Player[]>;
  createMatchLog(
    matchId: string,
    payload: CreateMatchLogRequest,
  ): Promise<MatchLog>;
  listMyLogs(params?: PageParams): Promise<MatchLogPage>;
  listMyTimeline(params?: PageParams): Promise<MatchLogAggregatePage>;
  updateMatchLog(
    logId: string,
    payload: UpdateMatchLogRequest,
  ): Promise<MatchLog>;
  deleteMatchLog(logId: string): Promise<void>;
  listMatchReviews(
    matchId: string,
    params?: ReviewSearchParams,
  ): Promise<ReviewPage>;
  createReview(matchId: string, payload: CreateReviewRequest): Promise<Review>;
  updateReview(reviewId: string, payload: UpdateReviewRequest): Promise<Review>;
  deleteReview(reviewId: string): Promise<void>;
  likeReview(reviewId: string): Promise<void>;
  unlikeReview(reviewId: string): Promise<void>;
  searchTags(params?: TagSearchParams): Promise<TagPage>;
  getTagDetail(tagName: string): Promise<TagDetail>;
  listTagMatches(tagName: string, params?: MatchSearchParams): Promise<MatchPage>;
  upsertMvpVote(
    matchId: string,
    payload: UpsertMvpVoteRequest,
  ): Promise<MvpVote>;
  deleteMvpVote(matchId: string): Promise<void>;
  getMyCalendarMonth(month: string): Promise<CalendarMonth>;
  getMyCalendarDay(date: string): Promise<CalendarDiaryDay>;
  getUser(userId: string): Promise<UserDetail>;
  listFollowingPosts(params?: PostFeedParams): Promise<PostFeedPage>;
  listPopularPosts(params?: PostFeedParams): Promise<PostFeedPage>;
  listUserPosts(userId: string, params?: PostFeedParams): Promise<PostFeedPage>;
  listUserReviews(userId: string, params?: PageParams): Promise<ReviewPage>;
  listUserTimeline(
    userId: string,
    params?: PageParams,
  ): Promise<MatchLogAggregatePage>;
  getUserStats(userId: string, params?: StatScopeParams): Promise<UserStats>;
  getUserStatOptions(
    userId: string,
    params?: StatScopeParams,
  ): Promise<UserStatOptions>;
};

export type StatScopeParams = {
  leagueId?: string;
  teamId?: string;
};
