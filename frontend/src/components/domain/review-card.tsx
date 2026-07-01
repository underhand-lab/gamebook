"use client";

import Link from "next/link";
import { Heart, Pencil, MessageSquareQuote, Star, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Review } from "@/lib/api";
import { emotionLabel, formatDate, ratingColor } from "@/lib/labels";
import { cn } from "@/lib/utils";

type ReviewCardProps = {
  review: Review;
  meId?: string;
  onToggleLike?: (review: Review) => void;
  onEdit?: (review: Review) => void;
  onDelete?: (review: Review) => void;
  contextTitle?: string;
  contextHref?: string | null;
  contextMeta?: string;
  matchHref?: string;
  showMatchButton?: boolean;
};

export function ReviewCard({
  review,
  meId,
  onToggleLike,
  onEdit,
  onDelete,
  contextTitle,
  contextHref,
  contextMeta,
  matchHref = `/matches/${review.matchId}`,
  showMatchButton = true,
}: ReviewCardProps) {
  const owned = meId === review.user.id;
  const reviewText = review.body ?? review.title ?? "내용 없음";
  const profileHref = owned ? "/" : `/?userId=${encodeURIComponent(review.user.id)}`;
  const title = contextTitle ?? review.user.displayName;
  const titleHref = contextHref === null ? undefined : (contextHref ?? profileHref);
  const ratingHue = ratingColor(review.rating);

  return (
    <Card className="border-border/80 bg-card/95 shadow-sm shadow-black/5">
      <CardContent className="p-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                {titleHref ? (
                  <button
                    type="button"
                    className="flex min-w-0 items-center gap-2 rounded-full pr-1 text-left underline-offset-4 transition-transform hover:underline active:scale-[0.99]"
                    onClick={() => {
                      window.location.href = titleHref;
                    }}
                  >
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted bg-cover bg-center text-xs font-semibold"
                      style={
                        review.user.avatarUrl
                          ? { backgroundImage: `url(${review.user.avatarUrl})` }
                          : undefined
                      }
                    >
                      {review.user.avatarUrl
                        ? null
                        : review.user.displayName.slice(0, 2).toUpperCase()}
                    </span>
                    <span className="truncate font-semibold">
                      {title}
                    </span>
                  </button>
                ) : (
                  <div className="flex min-w-0 items-center gap-2 rounded-full pr-1 transition-transform active:scale-[0.99]">
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted bg-cover bg-center text-xs font-semibold"
                      style={
                        review.user.avatarUrl
                          ? { backgroundImage: `url(${review.user.avatarUrl})` }
                          : undefined
                      }
                    >
                      {review.user.avatarUrl
                        ? null
                        : review.user.displayName.slice(0, 2).toUpperCase()}
                    </span>
                    <span className="truncate font-semibold">
                      {title}
                    </span>
                  </div>
                )}
              </div>
              {contextMeta ? (
                <p className="mt-1 text-xs text-muted-foreground">{contextMeta}</p>
              ) : (
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatDate(review.createdAt)}
                </p>
              )}
            </div>
            <Badge
              variant="outline"
              className="shrink-0 border-transparent text-white"
              style={{ backgroundColor: ratingHue }}
            >
              <Star className="mr-1 h-4 w-4" />
              {review.rating.toFixed(1)}
            </Badge>
          </div>
          <div>
            <p className="mt-2 text-sm leading-6 text-foreground/85">
              <MessageSquareQuote className="mr-1 inline h-4 w-4 translate-y-[-1px] text-muted-foreground" />
              {reviewText}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 border-t border-border/60 pt-3">
            <Button size="sm" variant="ghost" onClick={() => onToggleLike?.(review)}>
              <Heart
                className={cn(
                  "h-4 w-4",
                  review.likedByMe && "fill-red-500 text-red-500",
                )}
              />
              {review.likeCount}
            </Button>
            {review.emotion ? <Badge variant="amber">{emotionLabel[review.emotion]}</Badge> : null}
            {review.tags.slice(0, 2).map((tag) => (
              <Link key={tag.id} href={`/tags/${encodeURIComponent(tag.name)}`}>
                <Badge variant={tag.tagType === "OFFICIAL" ? "default" : "outline"}>
                  {tag.name}
                </Badge>
              </Link>
            ))}
            {showMatchButton ? (
              <Button asChild size="sm" variant="outline" className="ml-auto">
                <Link href={matchHref}>경기 상세보기</Link>
              </Button>
            ) : null}
            {owned ? (
              <div className="flex items-center gap-1">
                <Button size="icon" variant="ghost" onClick={() => onEdit?.(review)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => onDelete?.(review)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
