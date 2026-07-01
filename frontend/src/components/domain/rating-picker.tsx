"use client";

import { PointerEvent, useRef, useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type RatingPickerProps = {
  value: string;
  onChange: (value: string) => void;
  label?: string;
};

const maxRating = 5;

function ratingFromPointer(
  event: PointerEvent<HTMLDivElement>,
  element: HTMLDivElement,
) {
  const rect = element.getBoundingClientRect();
  const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
  return String(Math.max(0.5, Math.ceil(ratio * maxRating * 2) / 2));
}

export function RatingPicker({ value, onChange, label = "별점" }: RatingPickerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const numericValue = Number(value || 0);

  function updateFromPointer(event: PointerEvent<HTMLDivElement>) {
    if (!ref.current) return;
    onChange(ratingFromPointer(event, ref.current));
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">{label}</span>
        {value ? <span className="text-xs text-muted-foreground">{`${Number(value).toFixed(1)}점`}</span> : null}
        {value ? (
          <button
            className="text-xs text-muted-foreground underline-offset-4 hover:underline"
            type="button"
            onClick={() => onChange("")}
          >
            지우기
          </button>
        ) : null}
      </div>
      <div
        ref={ref}
        className="flex w-fit touch-none items-center gap-1"
        role="slider"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={5}
        aria-valuenow={numericValue}
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Backspace" || event.key === "Delete") onChange("");
          if (event.key === "ArrowLeft") {
            onChange(String(Math.max(0.5, numericValue - 0.5 || 0.5)));
          }
          if (event.key === "ArrowRight") {
            onChange(String(Math.min(5, numericValue + 0.5 || 0.5)));
          }
        }}
        onPointerDown={(event) => {
          setDragging(true);
          event.currentTarget.setPointerCapture(event.pointerId);
          updateFromPointer(event);
        }}
        onPointerMove={(event) => {
          if (dragging) updateFromPointer(event);
        }}
        onPointerUp={(event) => {
          setDragging(false);
          event.currentTarget.releasePointerCapture(event.pointerId);
        }}
      >
        {Array.from({ length: maxRating }, (_, index) => {
          const starValue = index + 1;
          const filled = numericValue >= starValue;
          const half = numericValue >= starValue - 0.5 && numericValue < starValue;

          return (
            <span key={starValue} className="relative h-8 w-8 text-muted-foreground">
              <Star className="h-8 w-8" />
              <span
                className={cn(
                  "absolute inset-0 overflow-hidden text-amber-500",
                  filled ? "w-full" : half ? "w-1/2" : "w-0",
                )}
              >
                <Star className="h-8 w-8 fill-amber-400" />
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
