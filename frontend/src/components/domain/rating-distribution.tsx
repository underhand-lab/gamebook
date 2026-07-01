"use client";

import { useAnimatedValues } from "@/components/domain/use-animated-values";
import type { RatingBucket } from "@/lib/api";
import { ratingColor } from "@/lib/labels";

const EMPTY_BAR_HEIGHT = 2;
const MIN_FILLED_BAR_HEIGHT = 12;

function formatRating(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function barHeight(item: RatingBucket, max: number) {
  if (!item.count) return EMPTY_BAR_HEIGHT;

  return Math.max(MIN_FILLED_BAR_HEIGHT, (item.count / max) * 100);
}

export function RatingDistribution({
  items,
  compact = false,
}: {
  items: RatingBucket[];
  compact?: boolean;
}) {
  const max = Math.max(1, ...items.map((item) => item.count));
  const sorted = [...items].sort((a, b) => a.rating - b.rating);
  const heightClass = compact ? "h-28" : "h-36";
  const barHeightClass = compact ? "h-20" : "h-28";
  const animatedHeights = useAnimatedValues(
    sorted.map((item) => ({
      id: String(item.rating),
      value: barHeight(item, max),
    })),
    500,
    { animateOnMount: true },
  );

  return (
    <div className={compact ? "space-y-1.5" : "space-y-2"}>
      <div className={`flex items-end gap-1 ${heightClass}`}>
        {sorted.map((item) => (
          <div key={item.rating} className="flex min-w-0 flex-1 flex-col items-center gap-1">
            <div className={`flex w-full items-end ${barHeightClass}`}>
              <div
                className="w-full rounded-t-sm bg-gradient-to-t transition-colors duration-500 ease-out"
                title={`${formatRating(item.rating)}점 · ${item.count}명`}
                style={{
                  backgroundColor: ratingColor(item.rating),
                  height: `${animatedHeights[String(item.rating)] ?? barHeight(item, max)}%`,
                  willChange: "height, background-color",
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between text-[10px] text-muted-foreground">
        <span>0.5</span>
        <span>2.5</span>
        <span>5</span>
      </div>
    </div>
  );
}
