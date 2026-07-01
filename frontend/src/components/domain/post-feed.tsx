"use client";

import { ReviewCard } from "@/components/domain/review-card";
import { TimelineCard } from "@/components/domain/timeline-card";
import type { PostFeedItem, Review } from "@/lib/api";

type PostFeedProps = {
  items: PostFeedItem[];
  meId?: string;
  disableOwnProfileLink?: boolean;
  showMatchButton?: boolean;
  emptyLabel?: string;
  onToggleLike?: (review: Review) => void;
  onEdit?: (review: Review) => void;
  onDelete?: (review: Review) => void;
};

function contextHrefFor({
  disableOwnProfileLink,
  meId,
  userId,
}: {
  disableOwnProfileLink?: boolean;
  meId?: string;
  userId: string;
}) {
  return disableOwnProfileLink && meId === userId ? null : undefined;
}

export function PostFeed({
  items,
  meId,
  disableOwnProfileLink = false,
  showMatchButton = true,
  emptyLabel = "결과가 없습니다.",
  onToggleLike,
  onEdit,
  onDelete,
}: PostFeedProps) {
  if (!items.length) {
    return (
      <div className="rounded-md border p-4 text-sm text-muted-foreground">
        {emptyLabel}
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {items.flatMap((post) => {
        if (post.type === "timeline") {
          const review = post.item.review;
          if (!review) return [];

          return [
            <TimelineCard
              key={`timeline-${post.item.matchLog.id}`}
              item={post.item}
              meId={meId}
              contextHref={contextHrefFor({
                disableOwnProfileLink,
                meId,
                userId: review.user.id,
              })}
              showMatchButton={showMatchButton}
              onToggleLike={onToggleLike}
              onEdit={onEdit}
              onDelete={onDelete}
            />,
          ];
        }

        return [
          <ReviewCard
            key={`review-${post.review.id}`}
            review={post.review}
            meId={meId}
            contextHref={contextHrefFor({
              disableOwnProfileLink,
              meId,
              userId: post.review.user.id,
            })}
            showMatchButton={showMatchButton}
            onToggleLike={onToggleLike}
            onEdit={onEdit}
            onDelete={onDelete}
          />,
        ];
      })}
    </div>
  );
}
