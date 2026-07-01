import type { Emotion, MatchStatus, WatchType } from "@/lib/api";

export const watchTypeLabel: Record<WatchType, string> = {
  IN_PERSON: "직관",
  LIVE: "라이브",
  OTHER: "하이라이트",
};

export const emotionLabel: Record<Emotion, string> = {
  HAPPY: "기쁨",
  MOVED: "뭉클함",
  TENSE: "긴장",
  ANGRY: "분노",
  SHOCKED: "충격",
};

export const emotionOrder: Emotion[] = ["HAPPY", "MOVED", "TENSE", "ANGRY", "SHOCKED"];

export function normalizeEmotionCounts(
  items: { emotion: Emotion; count: number }[],
) {
  const counts = new Map<Emotion, number>(emotionOrder.map((emotion) => [emotion, 0]));
  items.forEach((item) => {
    counts.set(item.emotion, item.count);
  });
  return emotionOrder.map((emotion) => ({ emotion, count: counts.get(emotion) ?? 0 }));
}

export const matchStatusLabel: Record<MatchStatus, string> = {
  SCHEDULED: "예정",
  LIVE: "진행 중",
  FINAL: "종료",
  POSTPONED: "연기",
  CANCELED: "취소",
};

const dateTimeFormat = new Intl.DateTimeFormat("ko-KR", {
  dateStyle: "medium",
  timeStyle: "short",
});

const dateFormat = new Intl.DateTimeFormat("ko-KR", {
  dateStyle: "medium",
});

export function formatDateTime(value: string) {
  return dateTimeFormat.format(new Date(value));
}

export function formatDate(value: string) {
  return dateFormat.format(new Date(value));
}

export function scoreText(home?: number | null, away?: number | null) {
  if (home === null || home === undefined || away === null || away === undefined) {
    return "vs";
  }
  return `${home} : ${away}`;
}

export function ratingColor(value: number) {
  if (value >= 4.5) return "#16A34A";
  if (value >= 3.5) return "#2563EB";
  if (value >= 2.5) return "#D97706";
  return "#DC2626";
}

export function toDatetimeLocal(value: string) {
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

export function fromDatetimeLocal(value: string) {
  return new Date(value).toISOString();
}
