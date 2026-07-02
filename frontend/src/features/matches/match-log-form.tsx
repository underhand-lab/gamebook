"use client";

import { CalendarPlus, Save, Search } from "lucide-react";
import { FormEvent, type MouseEvent, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FullDatePickerOverlay } from "@/components/domain/date-picker-overlay";
import { ModalCardHeader } from "@/components/domain/modal-card-header";
import { PillRadioGroup } from "@/components/domain/pill-radio-group";
import { RatingPicker } from "@/components/domain/rating-picker";
import { Badge } from "@/components/ui/badge";
import { Button, type ButtonProps } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  matchlogApi,
  type Emotion,
  type FanPerspective,
  type FavoriteTeam,
  type MatchLog,
  type MatchSummary,
  type Review,
  type ReviewVisibility,
  type ReviewWatchedType,
  type WatchType,
} from "@/lib/api";
import { cn } from "@/lib/utils";

type FormState = {
  watchedDate: string;
  watchType: WatchType;
  supportingTeamId: string;
  fanPerspective: FanPerspective;
  rating: string;
  reviewText: string;
  emotion: "" | Emotion;
  userTagNames: string;
  visibility: ReviewVisibility;
  federated: boolean;
  watchedType: ReviewWatchedType;
};

const reviewWatchOptions: { value: ReviewWatchedType; label: string }[] = [
  { value: "live", label: "직관" },
  { value: "tv", label: "라이브" },
  { value: "unknown", label: "기타" },
];

const emotionOptions: { value: Emotion; label: string }[] = [
  { value: "HAPPY", label: "기쁨" },
  { value: "MOVED", label: "뭉클함" },
  { value: "TENSE", label: "긴장" },
  { value: "ANGRY", label: "분노" },
  { value: "SHOCKED", label: "충격" },
];

function toDateInput(value: string) {
  return value.slice(0, 10);
}

function fromDateInput(value: string) {
  return `${value}T00:00:00.000Z`;
}

function perspectiveFor(match: MatchSummary | null, teamId: string): FanPerspective {
  if (!match) return teamId ? "OTHER_TEAM_FAN" : "NEUTRAL_FAN";
  if (teamId === match.homeTeam.id) return "HOME_FAN";
  if (teamId === match.awayTeam.id) return "AWAY_FAN";
  if (teamId) return "OTHER_TEAM_FAN";
  return "NEUTRAL_FAN";
}

function defaultTeamId(match: MatchSummary | null, favoriteTeams: FavoriteTeam[]) {
  if (!match) return "";
  const favoriteIds = favoriteTeams.map((favorite) => favorite.team.id);
  if (favoriteIds.includes(match.homeTeam.id)) return match.homeTeam.id;
  if (favoriteIds.includes(match.awayTeam.id)) return match.awayTeam.id;
  return "";
}

function userTagText(review?: Review | null) {
  return (
    review?.tags
      .filter((tag) => tag.tagType === "USER")
      .map((tag) => tag.name)
      .join(", ") ?? ""
  );
}

function buildFormState(
  match: MatchSummary | null,
  initialLog: MatchLog | null,
  initialReview: Review | null,
  favoriteTeams: FavoriteTeam[],
): FormState {
  const initialTeamId =
    initialLog?.supportingTeam?.id ?? defaultTeamId(match, favoriteTeams);
  const fanPerspective =
    initialReview?.fanPerspective ??
    initialLog?.fanPerspective ??
    perspectiveFor(match, initialTeamId);

  return {
    watchedDate: toDateInput(
      initialLog?.watchedAt ?? match?.matchDate ?? new Date().toISOString(),
    ),
    watchType: initialLog?.watchType ?? "IN_PERSON",
    supportingTeamId: initialTeamId,
    fanPerspective,
    rating: initialReview ? String(initialReview.rating) : "",
    reviewText: initialReview?.body ?? initialReview?.title ?? "",
    emotion: initialReview?.emotion ?? "",
    userTagNames: userTagText(initialReview),
    visibility: initialReview?.visibility ?? "public",
    federated: initialReview?.federated ?? false,
    watchedType: initialReview?.watchedType ?? "unknown",
  };
}

export function MatchLogForm({
  match,
  initialLog,
  initialReview,
  favoriteTeams,
  onSaved,
  buttonLabel,
  fixed = false,
  triggerClassName,
  triggerSize,
  triggerVariant,
}: {
  match?: MatchSummary;
  initialLog?: MatchLog | null;
  initialReview?: Review | null;
  favoriteTeams?: FavoriteTeam[];
  onSaved: () => void | Promise<void>;
  buttonLabel?: string;
  fixed?: boolean;
  triggerClassName?: string;
  triggerSize?: ButtonProps["size"];
  triggerVariant?: ButtonProps["variant"];
}) {
  const [selectedMatch, setSelectedMatch] = useState<MatchSummary | null>(
    match ?? null,
  );
  const [matchQuery, setMatchQuery] = useState("");
  const [matchResults, setMatchResults] = useState<MatchSummary[]>([]);
  const activeMatch = match ?? selectedMatch;
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [loadedFavoriteTeams, setLoadedFavoriteTeams] = useState<FavoriteTeam[]>(
    favoriteTeams ?? [],
  );
  const [resolvedLog, setResolvedLog] = useState<MatchLog | null>(
    initialLog ?? null,
  );
  const [resolvedReview, setResolvedReview] = useState<Review | null>(
    initialReview ?? null,
  );
  const resolvedFavoriteTeams = favoriteTeams ?? loadedFavoriteTeams;
  const [form, setForm] = useState<FormState>(() =>
    buildFormState(activeMatch, resolvedLog, resolvedReview, resolvedFavoriteTeams),
  );
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [canWrite, setCanWrite] = useState(Boolean(initialLog || initialReview));
  const watchedDateLocked =
    form.watchedType !== "unknown" &&
    (form.watchType === "LIVE" || form.watchType === "IN_PERSON");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let active = true;
    matchlogApi.getSession().then((session) => {
      if (active) setCanWrite(Boolean(session.user));
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (favoriteTeams) {
      setLoadedFavoriteTeams(favoriteTeams);
    }
  }, [favoriteTeams]);

  useEffect(() => {
    setResolvedLog(initialLog ?? null);
    setResolvedReview(initialReview ?? null);
  }, [initialLog, initialReview]);

  useEffect(() => {
    setSelectedMatch(match ?? null);
  }, [match]);

  useEffect(() => {
    setForm(
      buildFormState(activeMatch, resolvedLog, resolvedReview, resolvedFavoriteTeams),
    );
  }, [activeMatch, resolvedFavoriteTeams, resolvedLog, resolvedReview]);

  useEffect(() => {
    if (!open || favoriteTeams) return;
    let active = true;

    matchlogApi.listFavoriteTeams().then((items) => {
      if (active) setLoadedFavoriteTeams(items);
    });

    return () => {
      active = false;
    };
  }, [favoriteTeams, open]);

  useEffect(() => {
    if (
      !open ||
      !activeMatch ||
      initialLog !== undefined ||
      initialReview !== undefined
    ) {
      return;
    }
    let active = true;

    matchlogApi.listMyTimeline({ matchId: activeMatch.id, size: 1 }).then((page) => {
      const item = page.items[0];
      if (!active || !item) return;
      setResolvedLog(item.matchLog);
      setResolvedReview(item.review ?? null);
    });

    return () => {
      active = false;
    };
  }, [activeMatch, initialLog, initialReview, open]);

  async function searchMatches(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    event?.stopPropagation();
    const page = await matchlogApi.searchMatches({
      q: matchQuery,
      size: 6,
    });
    setMatchResults(page.items);
  }

  function selectMatch(nextMatch: MatchSummary) {
    setSelectedMatch(nextMatch);
    setResolvedLog(null);
    setResolvedReview(null);
    setMatchResults([]);
  }

  function openModal(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    setOpen(true);
  }

  function closeModal(event?: MouseEvent<HTMLElement>) {
    event?.stopPropagation();
    setOpen(false);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.stopPropagation();
    if (!activeMatch) return;
    setSaving(true);
    try {
      const [timeline, log] = await Promise.all([
        matchlogApi.listMyTimeline({ matchId: activeMatch.id, size: 1 }),
        matchlogApi.createMatchLog(activeMatch.id, {
          watchedAt: fromDateInput(form.watchedDate),
          watchType: form.watchType,
          supportingTeamId: form.supportingTeamId || null,
          fanPerspective: form.fanPerspective,
        }),
      ]);
      const existingReview =
        resolvedReview ??
        timeline.items[0]?.review ??
        null;
      const userTagNames = form.userTagNames
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

      const shouldSaveReview =
        Boolean(form.rating) ||
        Boolean(form.reviewText.trim()) ||
        Boolean(form.userTagNames.trim()) ||
        Boolean(form.emotion) ||
        form.visibility !== "public" ||
        form.federated ||
        form.watchedType !== "unknown";

      if (existingReview && shouldSaveReview) {
        await matchlogApi.updateReview(existingReview.id, {
          rating: form.rating ? Number(form.rating) : existingReview.rating,
          title: null,
          body: form.reviewText || null,
          spoiler: false,
          emotion: form.emotion || null,
          userTagNames,
          visibility: form.visibility,
          federated: form.federated,
          watchedType: form.watchedType,
        });
      } else if (shouldSaveReview) {
        await matchlogApi.createReview(activeMatch.id, {
          matchLogId: log.id,
          rating: form.rating ? Number(form.rating) : undefined,
          title: null,
          body: form.reviewText || null,
          spoiler: false,
          emotion: form.emotion || null,
          fanPerspective: form.fanPerspective,
          userTagNames,
          visibility: form.visibility,
          federated: form.federated,
          watchedType: form.watchedType,
          federationStatus: form.federated ? "pending" : "none",
        });
      }

      await onSaved();
      setResolvedLog(log);
      setOpen(false);
    } finally {
      setSaving(false);
    }
  }

  const modal =
    open && mounted ? (
      <>
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={closeModal}
        >
          <Card
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <ModalCardHeader
              title="로그 남기기"
              description={
                activeMatch
                  ? `${activeMatch.homeTeam.name} vs ${activeMatch.awayTeam.name}`
                  : "기록할 경기를 먼저 선택합니다."
              }
              onClose={() => closeModal()}
            />
            <CardContent className="pt-0">
              {!activeMatch ? (
                <div className="space-y-3">
                  <form
                    className="grid gap-3 sm:grid-cols-[1fr_auto]"
                    onSubmit={searchMatches}
                  >
                    <Input
                      placeholder="팀명 또는 리그로 경기 검색"
                      value={matchQuery}
                      onChange={(event) => setMatchQuery(event.target.value)}
                    />
                    <Button type="submit">
                      <Search className="h-4 w-4" />
                      검색
                    </Button>
                  </form>
                  <div className="space-y-2">
                    {matchResults.map((item) => (
                      <button
                        key={item.id}
                        className="w-full rounded-md border p-3 text-left transition-colors hover:bg-muted"
                        type="button"
                        onClick={() => selectMatch(item)}
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="outline">{item.league.name}</Badge>
                          <span className="font-medium">
                            {item.homeTeam.name} vs {item.awayTeam.name}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {toDateInput(item.matchDate)}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              {activeMatch ? (
                <form className="grid gap-3 md:grid-cols-2" onSubmit={submit}>
                  {!match ? (
                    <div className="md:col-span-2">
                      <Button
                        size="sm"
                        type="button"
                        variant="outline"
                        onClick={() => setSelectedMatch(null)}
                      >
                        경기 다시 선택
                      </Button>
                    </div>
                  ) : null}
                  <div className="space-y-1.5">
                    <Label htmlFor="watchedDate">관람일</Label>
                    <Button
                      className="w-full justify-start"
                      disabled={watchedDateLocked}
                      type="button"
                      variant="outline"
                      onClick={() => setDatePickerOpen(true)}
                    >
                      {form.watchedDate}
                    </Button>
                  </div>
                  <div className="space-y-1.5">
                    <RatingPicker
                      value={form.rating}
                      onChange={(rating) => setForm({ ...form, rating })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>관람 방식</Label>
                    <PillRadioGroup
                      columnsClassName="grid-cols-3"
                      name="watchedType"
                      options={reviewWatchOptions}
                      value={form.watchedType}
                      onChange={(value) =>
                        setForm({
                          ...form,
                          watchedType: value as ReviewWatchedType,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="supportingTeamId">응원팀</Label>
                    <Select
                      id="supportingTeamId"
                      className="truncate"
                      value={form.supportingTeamId}
                      onChange={(event) => {
                        const value = event.target.value;
                        setForm({
                          ...form,
                          supportingTeamId: value,
                          fanPerspective: perspectiveFor(activeMatch, value),
                        });
                      }}
                    >
                      <option value="">없음/다른 팀</option>
                      <option value={activeMatch.homeTeam.id}>
                        {activeMatch.homeTeam.name}
                      </option>
                      <option value={activeMatch.awayTeam.id}>
                        {activeMatch.awayTeam.name}
                      </option>
                    </Select>
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <Label htmlFor="quickReview">리뷰</Label>
                    <Textarea
                      id="quickReview"
                      rows={4}
                      value={form.reviewText}
                      onChange={(event) =>
                        setForm({ ...form, reviewText: event.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <Label>대표 감정</Label>
                    <PillRadioGroup
                      columnsClassName="grid-cols-3 sm:grid-cols-6"
                      name="emotion"
                      options={[{ value: "", label: "없음" }, ...emotionOptions]}
                      value={form.emotion}
                      onChange={(value) =>
                        setForm({ ...form, emotion: value as "" | Emotion })
                      }
                    />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <Label htmlFor="quickTags">태그</Label>
                    <Input
                      id="quickTags"
                      value={form.userTagNames}
                      onChange={(event) =>
                        setForm({ ...form, userTagNames: event.target.value })
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-3 md:col-span-2 md:flex-row md:items-end">
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <Label htmlFor="visibility">공개 범위</Label>
                      <Select
                        id="visibility"
                        value={form.visibility}
                        onChange={(event) =>
                          setForm({
                            ...form,
                            visibility: event.target.value as ReviewVisibility,
                          })
                        }
                      >
                        <option value="public">공개</option>
                        <option value="local">앱 공개</option>
                        <option value="followers">팔로워</option>
                        <option value="private">비공개</option>
                      </Select>
                    </div>
                    <label
                      htmlFor="federated-footer"
                      className="flex h-10 shrink-0 items-center gap-2 rounded-md border border-input bg-card px-3 text-sm"
                    >
                      <Checkbox
                        id="federated-footer"
                        checked={form.federated}
                        onChange={(event) =>
                          setForm({ ...form, federated: event.target.checked })
                        }
                      />
                      <span>Fediverse 공개</span>
                    </label>
                    <Button className="md:min-w-28" disabled={saving} type="submit">
                      <Save className="h-4 w-4" />
                      {resolvedLog ? "저장" : "로그 저장"}
                    </Button>
                  </div>
                </form>
              ) : null}
            </CardContent>
          </Card>
        </div>
        <FullDatePickerOverlay
          open={datePickerOpen}
          value={form.watchedDate}
          onChange={(watchedDate) => setForm({ ...form, watchedDate })}
          onClose={() => setDatePickerOpen(false)}
        />
      </>
    ) : null;

  if (!canWrite) return null;

  return (
    <>
      <Button
        className={cn(
          fixed && "fixed bottom-5 right-5 z-40 shadow-lg sm:bottom-8 sm:right-8",
          triggerClassName,
        )}
        size={triggerSize}
        type="button"
        variant={triggerVariant}
        onClick={openModal}
        onKeyDown={(event) => event.stopPropagation()}
      >
        <CalendarPlus className="h-4 w-4" />
        {buttonLabel ?? (resolvedLog ? "로그 수정" : "로그 남기기")}
      </Button>
      {modal ? createPortal(modal, document.body) : null}
    </>
  );
}
