import type {
  AuthResponse,
  AuthSession,
  CreateMatchLogRequest,
  CreateReviewRequest,
  DateMatchPage,
  DateMatchSearchParams,
  CalendarDiaryDay,
  CalendarMonth,
  FavoriteTeam,
  MatchAggregate,
  MatchAggregateParams,
  MatchlogApi,
  MatchLog,
  MatchLogAggregatePage,
  MatchLogPage,
  MatchPage,
  MatchSearchParams,
  MatchDetail,
  LeagueSearchParams,
  MvpVote,
  PageParams,
  PostFeedPage,
  PostFeedParams,
  Player,
  StatScopeParams,
  Review,
  ReviewPage,
  ReviewSearchParams,
  Sport,
  TagDetail,
  TagPage,
  TagSearchParams,
  League,
  Team,
  TeamSearchParams,
  UpdateFavoriteTeamsRequest,
  UpdateMatchLogRequest,
  UpdateProfileRequest,
  UpdateReviewRequest,
  UpsertMvpVoteRequest,
  UserDetail,
  UserSummary,
  UserStatOptions,
  UserStats,
  LoginRequest,
  SignupRequest,
} from "./matchlog-api";
import { getApiBaseUrl } from "./client";

type Primitive = string | number | boolean | null | undefined;

function query(params?: Record<string, Primitive>) {
  const search = new URLSearchParams();
  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      search.set(key, String(value));
    }
  });
  const text = search.toString();
  return text ? `?${text}` : "";
}

export class HttpMatchlogApi implements MatchlogApi {
  constructor(
    private readonly baseUrl = getApiBaseUrl(),
    private readonly getToken?: () => string | undefined,
  ) {}

  private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const token = this.getToken?.();
    const response = await fetch(`${this.baseUrl}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...init.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    if (response.status === 204) return undefined as T;
    return (await response.json()) as T;
  }

  private json(method: string, body?: unknown): RequestInit {
    return { method, body: body === undefined ? undefined : JSON.stringify(body) };
  }

  signup(payload: SignupRequest) {
    return this.request<AuthResponse>("/auth/signup", this.json("POST", payload));
  }

  login(payload: LoginRequest) {
    return this.request<AuthResponse>("/auth/login", this.json("POST", payload));
  }

  async logout() {
    return undefined;
  }

  async getSession() {
    const token = this.getToken?.();
    if (!token) {
      return { user: null } satisfies AuthSession;
    }
    const user = await this.getMe();
    return { accessToken: token, user } satisfies AuthSession;
  }

  getMe() {
    return this.request<UserDetail>("/me");
  }

  updateMyProfile(payload: UpdateProfileRequest) {
    return this.request<UserDetail>("/me/profile", this.json("PATCH", payload));
  }

  followUser(userId: string) {
    return this.request<void>(
      `/users/${userId}/follow`,
      this.json("POST"),
    );
  }

  unfollowUser(userId: string) {
    return this.request<void>(
      `/users/${userId}/follow`,
      this.json("DELETE"),
    );
  }

  listFollowingUsers(userId?: string) {
    return this.request<UserSummary[]>(
      userId
        ? `/users/${userId}/following`
        : "/me/following",
    );
  }

  listFollowerUsers(userId: string) {
    return this.request<UserSummary[]>(`/users/${userId}/followers`);
  }

  listFavoriteTeams() {
    return this.request<FavoriteTeam[]>("/me/favorite-teams");
  }

  updateFavoriteTeams(payload: UpdateFavoriteTeamsRequest) {
    return this.request<FavoriteTeam[]>(
      "/me/favorite-teams",
      this.json("PUT", payload),
    );
  }

  listSports() {
    return this.request<Sport[]>("/sports");
  }

  listLeagues(params?: LeagueSearchParams) {
    return this.request<League[]>(`/leagues${query(params)}`);
  }

  listTeams(params?: TeamSearchParams) {
    return this.request<Team[]>(`/teams${query(params)}`);
  }

  searchMatches(params?: MatchSearchParams) {
    return this.request<MatchPage>(`/matches${query(params)}`);
  }

  listMatchesByDate(date: string, params?: DateMatchSearchParams) {
    return this.request<DateMatchPage>(
      `/games/date/${encodeURIComponent(date)}${query(params)}`,
    );
  }

  getMatchDetail(matchId: string) {
    return this.request<MatchDetail>(`/matches/${matchId}`);
  }

  getMatchAggregate(matchId: string, params?: MatchAggregateParams) {
    return this.request<MatchAggregate>(
      `/matches/${matchId}/aggregate${query(params)}`,
    );
  }

  listMatchPlayers(matchId: string) {
    return this.request<Player[]>(`/matches/${matchId}/players`);
  }

  createMatchLog(matchId: string, payload: CreateMatchLogRequest) {
    return this.request<MatchLog>(
      `/matches/${matchId}/logs`,
      this.json("POST", payload),
    );
  }

  listMyLogs(params?: PageParams) {
    return this.request<MatchLogPage>(`/me/logs${query(params)}`);
  }

  listMyTimeline(params?: PageParams) {
    return this.request<MatchLogAggregatePage>(`/me/timeline${query(params)}`);
  }

  updateMatchLog(logId: string, payload: UpdateMatchLogRequest) {
    return this.request<MatchLog>(`/logs/${logId}`, this.json("PATCH", payload));
  }

  deleteMatchLog(logId: string) {
    return this.request<void>(`/logs/${logId}`, this.json("DELETE"));
  }

  listMatchReviews(matchId: string, params?: ReviewSearchParams) {
    return this.request<ReviewPage>(
      `/matches/${matchId}/reviews${query(params)}`,
    );
  }

  createReview(matchId: string, payload: CreateReviewRequest) {
    return this.request<Review>(
      `/matches/${matchId}/reviews`,
      this.json("POST", payload),
    );
  }

  updateReview(reviewId: string, payload: UpdateReviewRequest) {
    return this.request<Review>(
      `/reviews/${reviewId}`,
      this.json("PATCH", payload),
    );
  }

  deleteReview(reviewId: string) {
    return this.request<void>(`/reviews/${reviewId}`, this.json("DELETE"));
  }

  likeReview(reviewId: string) {
    return this.request<void>(`/reviews/${reviewId}/like`, this.json("POST"));
  }

  unlikeReview(reviewId: string) {
    return this.request<void>(`/reviews/${reviewId}/like`, this.json("DELETE"));
  }

  searchTags(params?: TagSearchParams) {
    return this.request<TagPage>(`/tags${query(params)}`);
  }

  getTagDetail(tagName: string) {
    return this.request<TagDetail>(`/tags/${encodeURIComponent(tagName)}`);
  }

  listTagMatches(tagName: string, params?: MatchSearchParams) {
    return this.request<MatchPage>(
      `/tags/${encodeURIComponent(tagName)}/matches${query(params)}`,
    );
  }

  upsertMvpVote(matchId: string, payload: UpsertMvpVoteRequest) {
    return this.request<MvpVote>(
      `/matches/${matchId}/mvp-vote`,
      this.json("PUT", payload),
    );
  }

  deleteMvpVote(matchId: string) {
    return this.request<void>(
      `/matches/${matchId}/mvp-vote`,
      this.json("DELETE"),
    );
  }

  getMyCalendarMonth(month: string) {
    return this.request<CalendarMonth>(`/me/calendar${query({ month })}`);
  }

  getMyCalendarDay(date: string) {
    return this.request<CalendarDiaryDay>(
      `/me/calendar/${encodeURIComponent(date)}`,
    );
  }

  getUser(userId: string) {
    return this.request<UserDetail>(`/users/${userId}`);
  }

  listFollowingPosts(params?: PostFeedParams) {
    return this.request<PostFeedPage>(`/me/following/posts${query(params)}`);
  }

  listPopularPosts(params?: PostFeedParams) {
    return this.request<PostFeedPage>(`/posts${query(params)}`);
  }

  listUserPosts(userId: string, params?: PostFeedParams) {
    return this.request<PostFeedPage>(`/users/${userId}/posts${query(params)}`);
  }

  listUserReviews(userId: string, params?: PageParams) {
    return this.request<ReviewPage>(`/users/${userId}/reviews${query(params)}`);
  }

  listUserTimeline(userId: string, params?: PageParams) {
    return this.request<MatchLogAggregatePage>(
      `/users/${userId}/timeline${query(params)}`,
    );
  }

  getUserStats(userId: string, params?: StatScopeParams) {
    return this.request<UserStats>(`/users/${userId}/stats${query(params)}`);
  }

  getUserStatOptions(userId: string, params?: StatScopeParams) {
    return this.request<UserStatOptions>(
      `/users/${userId}/stats/options${query(params)}`,
    );
  }
}

export const httpMatchlogApi = new HttpMatchlogApi();
