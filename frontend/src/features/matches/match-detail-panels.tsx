"use client";

import Link from "next/link";
import { CalendarClock, MapPin } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { StatsSummaryPanel } from "@/components/domain/stats-summary-panel";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { RadioPillGroup } from "@/components/domain/pill-radio-group";
import { ReviewCard } from "@/components/domain/review-card";
import {
  matchlogApi,
  type FanPerspective,
  type MatchAggregate,
  type MatchAggregateScope,
  type MatchDetail,
  type MatchLogAggregate,
  type Review,
} from "@/lib/api";
import { formatDateTime, normalizeEmotionCounts, scoreText, watchTypeLabel } from "@/lib/labels";

export type FanTab = "HOME_FAN" | "AWAY_FAN" | "NEUTRAL_FAN";
export type PostFanTab = "ALL" | FanTab;
export type StatFanScope = Extract<MatchAggregateScope, FanTab | "TEAM_FANS">;

function fanLabel(tab: StatFanScope) {
  if (tab === "TEAM_FANS") return "전체 팀 팬";
  if (tab === "HOME_FAN") return "우리팀팬";
  if (tab === "AWAY_FAN") return "상대팀팬";
  return "중립팬";
}

function summaryValue(value?: number | null) {
  return value == null ? "-" : value.toLocaleString("ko-KR");
}

function resolveTabs(match: MatchDetail, myLog?: MatchLogAggregate | null) {
  const isAwayFan = myLog?.matchLog.supportingTeam?.id === match.awayTeam.id;
  return {
    defaultTab: isAwayFan ? ("AWAY_FAN" as FanTab) : ("HOME_FAN" as FanTab),
    opponentTab: isAwayFan ? ("HOME_FAN" as FanTab) : ("AWAY_FAN" as FanTab),
  };
}

export function MatchDetailInfoCard({ match }: { match: MatchDetail }) {
  return (
    <Card className="border-border/70 bg-card/90 shadow-sm shadow-black/5">
      <CardHeader className="space-y-3 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={match.status === "FINAL" ? "secondary" : "amber"}>
            {match.status}
          </Badge>
          <Badge variant={match.status === "FINAL" ? "secondary" : "amber"}>
            {match.league.name}
          </Badge>
          <Badge variant="outline">{match.sport.name}</Badge>
        </div>
        <CardTitle className="text-2xl font-semibold tracking-tight">
          {match.homeTeam.name} vs {match.awayTeam.name}
        </CardTitle>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <CalendarClock className="h-3.5 w-3.5" />
            {formatDateTime(match.matchDate)}
          </span>
          {match.stadium ? (
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {match.stadium.name}
            </span>
          ) : null}
        </div>
        <div className="text-3xl font-semibold tracking-tight text-primary">
          {scoreText(match.score?.home, match.score?.away)}
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        {match.aggregate?.topTags?.length ? (
          <div className="flex flex-wrap gap-2">
            {match.aggregate.topTags.map((item) => (
              <Link key={item.tag.id} href={`/tags/${encodeURIComponent(item.tag.name)}`}>
                <Badge variant={item.tag.tagType === "OFFICIAL" ? "default" : "outline"}>
                  {item.tag.name} · {item.count}
                </Badge>
              </Link>
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function MatchDetailStatsCard({
  aggregate,
  scopeTab,
  onScopeTabChange,
}: {
  aggregate: MatchAggregate;
  scopeTab: StatFanScope;
  onScopeTabChange: (tab: StatFanScope) => void;
}) {
  return (
    <StatsSummaryPanel
      title="경기 통계"
      subtitle={fanLabel(scopeTab)}
      controls={
        <Select
          value={scopeTab}
          onChange={(event) => onScopeTabChange(event.target.value as StatFanScope)}
        >
          <option value="TEAM_FANS">전체 팀 팬</option>
          <option value="HOME_FAN">우리팀팬</option>
          <option value="AWAY_FAN">상대팀팬</option>
          <option value="NEUTRAL_FAN">중립팬</option>
        </Select>
      }
      summaryItems={[
        { label: "리뷰", value: summaryValue(aggregate.reviewCount ?? 0) },
        { label: "평점", value: (aggregate.averageRating ?? 0).toFixed(1) },
        {
          label: "감정",
          value: summaryValue(
            aggregate.emotionDistribution?.reduce((sum, item) => sum + item.count, 0) ?? 0,
          ),
        },
        {
          label: "태그",
          value: summaryValue(aggregate.topTags?.reduce((sum, item) => sum + item.count, 0) ?? 0),
        },
      ]}
      reviewCount={aggregate.reviewCount ?? 0}
      ratingBuckets={aggregate.ratingDistribution ?? []}
      emotionItems={normalizeEmotionCounts(aggregate.emotionDistribution ?? [])}
    />
  );
}

export function MatchDetailPostsCard({
  match,
  meId,
  myItem,
  initialReviews,
  fanTab,
  onFanTabChange,
}: {
  match: MatchDetail;
  meId?: string;
  myItem: MatchLogAggregate | null;
  initialReviews: Review[];
  fanTab: PostFanTab;
  onFanTabChange: (tab: PostFanTab) => void;
}) {
  const [query, setQuery] = useState("");
  const { defaultTab, opponentTab } = useMemo(() => resolveTabs(match, myItem), [match, myItem]);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const term = query.trim().toLowerCase();
  const showMyItem = Boolean(myItem && fanTab === defaultTab);
  const selectedPerspective: FanPerspective | undefined =
    fanTab === "ALL"
      ? undefined
      : fanTab === "HOME_FAN"
      ? "HOME_FAN"
      : fanTab === "AWAY_FAN"
        ? "AWAY_FAN"
        : "NEUTRAL_FAN";

  useEffect(() => {
    let active = true;

    matchlogApi
        .listMatchReviews(match.id, {
          q: term,
          excludeUserId: showMyItem && meId ? meId : undefined,
          fanPerspective: selectedPerspective,
          size: 50,
        })
      .then((page) => {
        if (!active) return;
        setReviews(page.items);
      });

    return () => {
      active = false;
    };
  }, [match.id, meId, selectedPerspective, showMyItem, term]);

  return (
    <Card className="border-border/70 bg-card/90 shadow-sm shadow-black/5">
      <CardHeader className="space-y-3 pb-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle>포스트</CardTitle>
          </div>
          <Badge variant="outline">{reviews.length + (showMyItem ? 1 : 0)}개</Badge>
        </div>
        <div className="space-y-3">
          <Input
            placeholder="검색"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <RadioPillGroup
            columnsClassName="grid-cols-4"
            name="fanPerspective"
            value={fanTab}
            options={[
              { value: "ALL", label: "전체" },
              { value: defaultTab, label: "우리팀" },
              { value: opponentTab, label: "상대팀" },
              { value: "NEUTRAL_FAN", label: "중립" },
            ]}
            onChange={(value) => onFanTabChange(value as PostFanTab)}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        {showMyItem && myItem ? (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">내 직관</p>
            {myItem.review ? (
              <ReviewCard
                review={myItem.review}
                meId={meId}
                contextMeta={`${watchTypeLabel[myItem.matchLog.watchType]} · ${formatDateTime(myItem.timelineDate)}`}
                showMatchButton={false}
              />
            ) : (
              <Card className="border-border/80 bg-card/95 shadow-sm shadow-black/5">
                <CardContent className="p-4">
                  <Link href={`/matches/${myItem.matchSummary.id}`} className="block underline-offset-4 hover:underline">
                    <p className="text-sm font-semibold tracking-tight">
                      {myItem.matchSummary.homeTeam.name} vs {myItem.matchSummary.awayTeam.name}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {watchTypeLabel[myItem.matchLog.watchType]} · {formatDateTime(myItem.timelineDate)}
                    </p>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        ) : null}
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} meId={meId} showMatchButton={false} />
        ))}
        {!reviews.length && !showMyItem ? (
          <div className="rounded-2xl border border-dashed p-6 text-center text-sm text-muted-foreground">
            표시할 포스트가 없습니다.
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
