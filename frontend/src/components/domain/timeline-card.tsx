import { ReviewCard } from "@/components/domain/review-card";
import type { MatchLogAggregate, Review } from "@/lib/api";
import { formatDate, scoreText } from "@/lib/labels";

type TimelineCardProps = {
  item: MatchLogAggregate;
  meId?: string;
  onToggleLike?: (review: Review) => void;
  onEdit?: (review: Review) => void;
  onDelete?: (review: Review) => void;
  contextHref?: string | null;
  showMatchButton?: boolean;
};

export function TimelineCard({
  item,
  meId,
  onToggleLike,
  onEdit,
  onDelete,
  contextHref,
  showMatchButton = true,
}: TimelineCardProps) {
  if (!item.review) return null;

  return (
    <ReviewCard
      review={item.review}
      meId={meId}
      onToggleLike={onToggleLike}
      onEdit={onEdit}
      onDelete={onDelete}
      contextHref={contextHref === null ? null : contextHref}
      contextMeta={`${item.matchSummary.league.name} · ${formatDate(item.timelineDate)} · ${scoreText(item.matchSummary.score?.home, item.matchSummary.score?.away)}`}
      showMatchButton={showMatchButton}
    />
  );
}
