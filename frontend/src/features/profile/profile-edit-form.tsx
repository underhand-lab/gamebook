"use client";

import { Plus, Save, Search, X } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { ModalCardHeader } from "@/components/domain/modal-card-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { matchlogApi, type FavoriteTeam, type Team, type UserDetail } from "@/lib/api";

type ProfileForm = {
  displayName: string;
  bio: string;
};

export function ProfileEditForm({
  me,
  favoriteTeams,
  onSaved,
  onCancel,
}: {
  me: UserDetail;
  favoriteTeams: FavoriteTeam[];
  onSaved: () => void;
  onCancel?: () => void;
}) {
  const [form, setForm] = useState<ProfileForm>({
    displayName: me.displayName,
    bio: me.bio ?? "",
  });
  const [teamOptions, setTeamOptions] = useState<Team[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<Team[]>(
    favoriteTeams.map((favorite) => favorite.team),
  );
  const [teamQuery, setTeamQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>(
    favoriteTeams.map((favorite) => favorite.team.id),
  );

  useEffect(() => {
    setForm({
      displayName: me.displayName,
      bio: me.bio ?? "",
    });
  }, [me]);

  useEffect(() => {
    setSelectedIds(favoriteTeams.map((favorite) => favorite.team.id));
    setSelectedTeams(favoriteTeams.map((favorite) => favorite.team));
  }, [favoriteTeams]);

  useEffect(() => {
    let active = true;

    matchlogApi.listTeams({ q: teamQuery }).then((items) => {
      if (active) setTeamOptions(items);
    });

    return () => {
      active = false;
    };
  }, [teamQuery]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await Promise.all([
      matchlogApi.updateMyProfile({
        displayName: form.displayName,
        bio: form.bio || null,
      }),
      matchlogApi.updateFavoriteTeams({ teamIds: selectedIds }),
    ]);
    onSaved();
  }

  function addTeam(team: Team) {
    setSelectedIds((current) => (current.includes(team.id) ? current : [...current, team.id]));
    setSelectedTeams((current) =>
      current.some((item) => item.id === team.id) ? current : [...current, team],
    );
    setTeamQuery("");
  }

  function removeTeam(teamId: string) {
    setSelectedIds((current) => current.filter((id) => id !== teamId));
    setSelectedTeams((current) => current.filter((team) => team.id !== teamId));
  }

  function addFirstVisibleTeam() {
    const nextTeam = teamOptions.find((team) => !selectedIds.includes(team.id));
    if (nextTeam) addTeam(nextTeam);
  }

  return (
    <div className="space-y-6">
      <ModalCardHeader
        title="프로필 수정"
        description="표시 이름과 소개를 바꾸고, 응원팀도 여기서 바로 관리합니다."
        onClose={onCancel}
      />
      <form className="space-y-5" onSubmit={submit}>
        <div className="space-y-2">
          <Label htmlFor="displayName">표시 이름</Label>
          <Input
            id="displayName"
            value={form.displayName}
            onChange={(event) =>
              setForm({ ...form, displayName: event.target.value })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bio">소개</Label>
          <Textarea
            id="bio"
            value={form.bio}
            onChange={(event) => setForm({ ...form, bio: event.target.value })}
          />
        </div>
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Label className="text-sm font-medium">응원팀</Label>
            <div className="relative ml-auto flex w-full max-w-sm items-center gap-2">
              <div className="relative min-w-0 flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="응원팀 검색"
                  value={teamQuery}
                  onChange={(event) => setTeamQuery(event.target.value)}
                />
                {teamQuery.trim() ? (
                  <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-20 grid gap-2 rounded-xl border bg-background p-2 shadow-lg">
                    {teamOptions.length ? (
                      teamOptions.map((team) => {
                        const selected = selectedIds.includes(team.id);

                        return (
                          <button
                            key={team.id}
                            type="button"
                            className="flex items-center justify-between rounded-lg px-3 py-2 text-left transition-colors hover:bg-muted"
                            onClick={() => addTeam(team)}
                          >
                            <span>
                              <span className="block text-sm font-medium">{team.name}</span>
                              <span className="text-xs text-muted-foreground">{team.shortName}</span>
                            </span>
                            <span className="text-xs font-medium text-primary">
                              {selected ? "추가됨" : "추가"}
                            </span>
                          </button>
                        );
                      })
                    ) : (
                      <p className="px-3 py-2 text-sm text-muted-foreground">검색 결과가 없습니다.</p>
                    )}
                  </div>
                ) : null}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addFirstVisibleTeam}
                disabled={!teamOptions.some((team) => !selectedIds.includes(team.id))}
              >
                <Plus className="h-4 w-4" />
                추가
              </Button>
            </div>
          </div>
          <div className="flex min-h-11 flex-wrap items-center gap-2 rounded-xl border bg-background px-3 py-2">
            {selectedTeams.length ? (
              selectedTeams.map((favorite) => (
                <Badge key={favorite.id} variant="outline" className="gap-1 pr-1">
                  {favorite.name}
                  <button
                    type="button"
                    className="ml-1 rounded-full p-0.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    onClick={() => removeTeam(favorite.id)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">
                선택한 응원팀이 없습니다.
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="submit">
            <Save className="h-4 w-4" />
            저장
          </Button>
        </div>
      </form>
    </div>
  );
}
