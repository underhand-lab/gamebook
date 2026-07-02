"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { PostFeed } from "@/components/domain/post-feed";
import { StatsSummaryPanel } from "@/components/domain/stats-summary-panel";
import { RadioPillGroup } from "@/components/domain/pill-radio-group";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { matchlogApi } from "@/lib/api";
import type {
  FavoriteTeam,
  PostFeedItem,
  Review,
  UserDetail,
  UserStatOption,
  UserStats,
} from "@/lib/api";
import { normalizeEmotionCounts } from "@/lib/labels";

type StatScope = {
  leagueId: string;
  teamId: string;
};

type ProfileTabProps = {
  followerCount: number;
  friendPosts: PostFeedItem[];
  meId?: string;
  myPosts: PostFeedItem[];
  postQuery: string;
  popularPosts: PostFeedItem[];
  profilePosts: PostFeedItem[];
  followingCount: number;
  selectedTeams: FavoriteTeam[];
  statScope: StatScope;
  statLeagueOptions: UserStatOption[];
  statTeamOptions: UserStatOption[];
  stats: UserStats;
  scopedStats: {
    inPersonMatches: number;
    liveMatches: number;
    postCount: number;
    receivedLikes: number;
  };
  user: UserDetail;
  viewer: UserDetail | null;
  headerAction?: {
    label: string;
    onClick: () => void;
  };
  onPostQueryChange: (query: string) => void;
  onScopeChange: (
    scope: StatScope | ((current: StatScope) => StatScope),
  ) => void;
};

export function ProfileTab({
  followerCount,
  friendPosts,
  meId,
  myPosts,
  postQuery,
  popularPosts,
  profilePosts,
  followingCount,
  selectedTeams,
  statScope,
  statLeagueOptions,
  statTeamOptions,
  stats,
  scopedStats,
  user,
  viewer,
  headerAction,
  onPostQueryChange,
  onScopeChange,
}: ProfileTabProps) {
  const [activeTab, setActiveTab] = useState<"mine" | "friends" | "all">("mine");
  const isOwnProfile = user.id === meId;
  const emotionItems = normalizeEmotionCounts(stats.topEmotions ?? []);
  const currentBadges = buildCurrentBadges({
    favoriteTeamCount: selectedTeams.length,
    inPersonMatches: stats.inPersonMatches ?? 0,
    receivedLikes: stats.receivedLikes ?? 0,
    reviewCount: stats.reviewCount ?? 0,
  });
  const activePosts = !isOwnProfile
    ? profilePosts
    : activeTab === "mine"
      ? myPosts
      : activeTab === "friends"
        ? friendPosts
        : popularPosts;
  const editPost = async (review: Review) => {
    const body = window.prompt(
      "포스트 내용을 수정하세요.",
      review.body ?? review.title ?? "",
    );
    if (body === null) return;
    await matchlogApi.updateReview(review.id, { body });
    window.location.reload();
  };
  const deletePost = async (review: Review) => {
    const ok = window.confirm("포스트를 삭제할까요?");
    if (!ok) return;
    await matchlogApi.deleteReview(review.id);
    window.location.reload();
  };

  return (
    <div className="page-split items-start">
      <aside className="space-y-4 md:sticky md:top-20 md:self-start">
        <Card className="border-border/70 bg-card/90 shadow-sm shadow-black/5">
          <CardContent className="space-y-4 p-5">
            <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <h3 className="text-2xl font-semibold tracking-tight">
                {user.displayName}
              </h3>
              {viewer && isOwnProfile ? (
                <p className="text-sm text-muted-foreground">{user.email}</p>
              ) : null}
              {user.handle ? (
                <p className="text-sm text-muted-foreground">{user.handle}</p>
              ) : null}
            </div>
              {headerAction ? (
                <Button onClick={headerAction.onClick} size="sm">
                  {headerAction.label}
                </Button>
              ) : null}
            </div>
            <p className="text-sm leading-6 text-muted-foreground">
              {user.bio ?? "소개가 없습니다."}
            </p>
            <div className="space-y-2">
              <div>
                <p className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>응원팀</span>
                  <span className="text-sm font-semibold text-foreground">
                    {selectedTeams.length}
                  </span>
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedTeams.length ? (
                  selectedTeams.map((favorite) => (
                    <Badge key={favorite.id} variant="outline">
                      {favorite.team.name}
                    </Badge>
                  ))
                ) : (
                  <Badge variant="outline">응원팀 없음</Badge>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">보유 배지</p>
              <div className="flex flex-wrap gap-2">
                {currentBadges.map((badge) => (
                  <Badge key={badge} variant="amber">
                    {badge}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="space-y-3 pt-1">
              <div className="flex flex-wrap gap-6">
                <div>
                  <p className="text-xs text-muted-foreground">팔로잉</p>
                  <p className="mt-1 text-2xl font-semibold">
                    {followingCount}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">팔로워</p>
                  <p className="mt-1 text-2xl font-semibold">{followerCount}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <StatsSummaryPanel
          title="통계"
          controls={
            <>
              <Select
                value={statScope.leagueId}
                onChange={(event) =>
                  onScopeChange({
                    leagueId: event.target.value,
                    teamId: "",
                  })
                }
              >
                <option value="">전체 리그</option>
                {statLeagueOptions.map((league) => (
                  <option key={league.id} value={league.id}>
                    {league.name}
                  </option>
                ))}
              </Select>
              <Select
                value={statScope.teamId}
                onChange={(event) => {
                  const option = event.currentTarget.selectedOptions[0];
                  onScopeChange((current) => ({
                    ...current,
                    teamId: event.target.value,
                    leagueId: event.target.value
                      ? (option?.dataset.leagueId ?? current.leagueId)
                      : current.leagueId,
                  }));
                }}
              >
                <option value="">전체 팀</option>
                {statTeamOptions.map((team) => (
                  <option key={team.id} value={team.id} data-league-id={team.leagueId}>
                    {team.name}
                  </option>
                ))}
              </Select>
            </>
          }
          summaryItems={[
            { label: "직관", value: String(scopedStats.inPersonMatches) },
            { label: "시청", value: String(scopedStats.liveMatches) },
            { label: "공감", value: String(scopedStats.receivedLikes) },
            { label: "포스트", value: String(scopedStats.postCount) },
          ]}
          countLabel="개"
          reviewCount={stats.reviewCount ?? 0}
          ratingBuckets={stats.ratingDistribution ?? []}
          emotionItems={emotionItems}
        />
      </aside>
      <section className="min-w-0 space-y-4 md:sticky md:top-20 md:self-start">
        <Card className="border-border/70 bg-card/90 shadow-sm shadow-black/5">
          <CardHeader>
            <CardTitle>포스트</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            <div className="space-y-3">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm outline-none"
                  placeholder="태그, 팀명, 작성자, 키워드"
                  value={postQuery}
                  onChange={(event) => onPostQueryChange(event.target.value)}
                />
              </div>
              {isOwnProfile ? (
                <RadioPillGroup
                  groupClassName="rounded-full border border-border/70 bg-card p-1"
                  columnsClassName="grid-cols-3"
                  name="profile-feed"
                  value={activeTab}
                  options={[
                    { value: "mine", label: "나" },
                    { value: "friends", label: "친구" },
                    { value: "all", label: "전체" },
                  ]}
                  onChange={(value) => setActiveTab(value as "mine" | "friends" | "all")}
                />
              ) : null}
            </div>
            <PostFeed
              items={activePosts}
              meId={meId}
              disableOwnProfileLink={isOwnProfile}
              onEdit={editPost}
              onDelete={deletePost}
            />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function buildCurrentBadges({
  favoriteTeamCount,
  inPersonMatches,
  receivedLikes,
  reviewCount,
}: {
  favoriteTeamCount: number;
  inPersonMatches: number;
  receivedLikes: number;
  reviewCount: number;
}) {
  const badges: string[] = [];

  if (reviewCount > 0) badges.push("첫 포스트");
  if (favoriteTeamCount >= 3) badges.push("멀티 응원");
  if (inPersonMatches >= 5) badges.push("직관러");
  if (receivedLikes >= 10) badges.push("공감 수집가");

  return badges.length ? badges : ["배지 없음"];
}
