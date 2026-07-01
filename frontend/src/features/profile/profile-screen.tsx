"use client";

import { useState } from "react";
import { ProfileEditForm } from "./profile-edit-form";
import { ProfileTab } from "./profile-tab";
import { useProfileHubData } from "./use-profile-hub-data";
import { matchlogApi } from "@/lib/api";

export function ProfileScreen({ userId = "user-me" }: { userId?: string }) {
  const [postQuery, setPostQuery] = useState("");
  const {
    followerCount,
    followingCount,
    friendPosts,
    myPosts,
    popularPosts,
    profilePosts,
    scopedStats,
    selectedTeams,
    statLeagueOptions,
    statTeamOptions,
    load,
    setStatScope,
    state,
    followingUserIds,
    statScope,
  } = useProfileHubData(userId, { postQuery });
  const canEdit = userId === "user-me";
  const [editing, setEditing] = useState(false);
  if (!state) {
    return <div className="page-shell text-sm text-muted-foreground">불러오는 중</div>;
  }

  return (
    <div className="page-shell space-y-6">
      <ProfileTab
        followerCount={followerCount}
        friendPosts={friendPosts}
        meId="user-me"
        myPosts={myPosts}
        popularPosts={popularPosts}
        postQuery={postQuery}
        profilePosts={profilePosts}
        scopedStats={scopedStats}
        followingCount={followingCount}
        selectedTeams={selectedTeams}
        statScope={statScope}
        statLeagueOptions={statLeagueOptions}
        statTeamOptions={statTeamOptions}
        stats={state.stats}
        user={state.me}
        onPostQueryChange={setPostQuery}
        onScopeChange={setStatScope}
        headerAction={
          canEdit
            ? { label: "프로필 수정", onClick: () => setEditing(true) }
            : {
                label: followingUserIds.includes(state.me.id) ? "팔로우 취소" : "팔로우",
                onClick: async () => {
                  if (followingUserIds.includes(state.me.id)) {
                    await matchlogApi.unfollowUser(state.me.id);
                  } else {
                    await matchlogApi.followUser(state.me.id);
                  }
                  await load();
                },
              }
        }
      />

      {canEdit && editing ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-[1.5rem] bg-background p-4 shadow-2xl">
            <ProfileEditForm
              me={state.me}
              favoriteTeams={state.me.favoriteTeams ?? []}
              onSaved={() => {
                setEditing(false);
                void load();
              }}
              onCancel={() => setEditing(false)}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
