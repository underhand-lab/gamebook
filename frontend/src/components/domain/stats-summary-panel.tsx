"use client";

import type { ReactNode } from "react";
import { MiniRadarChart } from "@/components/domain/charts";
import { RatingDistribution } from "@/components/domain/rating-distribution";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { EmotionCount, RatingBucket } from "@/lib/api";
import { emotionLabel } from "@/lib/labels";

export type StatsSummaryItem = {
  label: string;
  value: string;
};

export function StatsSummaryPanel({
  title,
  subtitle,
  controls,
  summaryItems,
  countLabel = "명",
  reviewCount,
  ratingBuckets,
  emotionItems,
}: {
  title: string;
  subtitle?: string;
  controls?: ReactNode;
  summaryItems: StatsSummaryItem[];
  countLabel?: string;
  reviewCount: number;
  ratingBuckets: RatingBucket[];
  emotionItems: EmotionCount[];
}) {
  const topEmotion = [...emotionItems].sort((a, b) => b.count - a.count)[0] ?? null;

  return (
    <Card className="border-border/70 bg-card/90 shadow-sm shadow-black/5">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle>{title}</CardTitle>
            {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
          </div>
          {controls ? <div className="flex items-center gap-2">{controls}</div> : null}
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        <div className="grid grid-cols-4 gap-3">
          {summaryItems.map((item) => (
            <div
              key={item.label}
              className="min-w-0 rounded-2xl border border-border/60 bg-muted/20 px-2 py-2"
            >
              <p className="truncate whitespace-nowrap text-[9px] leading-none text-muted-foreground">
                {item.label}
              </p>
              <p className="mt-1 truncate whitespace-nowrap text-sm font-semibold tracking-tight">
                {item.value}
              </p>
            </div>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="min-w-0 rounded-2xl border border-border/60 bg-muted/20 p-3 min-h-[15rem]">
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="whitespace-nowrap text-sm font-medium">평점 분포</p>
              <Badge variant="outline">
                {reviewCount}
                {countLabel}
              </Badge>
            </div>
            <div className="max-w-full overflow-hidden pt-1">
              <RatingDistribution compact items={ratingBuckets} />
            </div>
          </div>
          <div className="min-w-0 rounded-2xl border border-border/60 bg-muted/20 px-3 py-2 min-h-[14rem]">
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="whitespace-nowrap text-sm font-medium">감정 그래프</p>
              {topEmotion ? (
                <Badge variant="amber">{emotionLabel[topEmotion.emotion]}</Badge>
              ) : (
                <Badge variant="outline">없음</Badge>
              )}
            </div>
            {emotionItems.length ? (
              <MiniRadarChart
                data={emotionItems.map((item) => ({
                  name: emotionLabel[item.emotion],
                  value: item.count,
                }))}
              />
            ) : (
              <div className="flex h-56 items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground">
                감정 기록이 없습니다.
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
