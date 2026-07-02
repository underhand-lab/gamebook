"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  matchlogApi,
  type PostFeedItem,
  type PostFeedPage,
  type UserDetail,
  type UserStatOption,
  type UserStats,
} from "@/lib/api";

type StatScope = {
  leagueId: string;
  teamId: string;
};

type ProfileHubState = {
  viewer: UserDetail | null;
  profileUser: UserDetail;
  isOwnProfile: boolean;
  stats: UserStats;
  profilePosts: PostFeedItem[];
  myPosts: PostFeedItem[];
  friendPosts: PostFeedItem[];
  popularPosts: PostFeedItem[];
  statLeagueOptions: UserStatOption[];
  statTeamOptions: UserStatOption[];
  followingUserIds: string[];
  followerCount: number;
  followingCount: number;
};

function emptyPostPage(): PostFeedPage {
  return { items: [], page: 0, size: 0, total: 0 };
}

export function useProfileHubData(
  userId: string = "user-me",
  { postQuery = "" }: { postQuery?: string } = {},
) {
  const [state, setState] = useState<ProfileHubState | null>(null);
  const [statScope, setStatScope] = useState<StatScope>({ leagueId: "", teamId: "" });

  const load = useCallback(async () => {
    const session = await matchlogApi.getSession();
    const viewer = session.user;
    const requestedOwnProfile = userId === "user-me";
    const profileUserId = requestedOwnProfile ? (viewer?.id ?? "user-me") : userId;
    const isOwnProfile = Boolean(viewer && viewer.id === profileUserId);
    const postParams = { q: postQuery, size: 100 };
    const [
      profileUser,
      stats,
      statOptions,
      profilePostsPage,
      friendPostsPage,
      popularPostsPage,
      viewerFollowingUsers,
      profileFollowingUsers,
      profileFollowerUsers,
    ] = await Promise.all([
      matchlogApi.getUser(profileUserId),
      matchlogApi.getUserStats(profileUserId, statScope),
      matchlogApi.getUserStatOptions(profileUserId, {
        leagueId: statScope.leagueId,
      }),
      matchlogApi.listUserPosts(profileUserId, postParams),
      isOwnProfile
        ? matchlogApi.listFollowingPosts({ q: postQuery, size: 50 })
        : Promise.resolve(emptyPostPage()),
      isOwnProfile
        ? matchlogApi.listPopularPosts({
            q: postQuery,
            size: 50,
            sort: "MOST_LIKED",
          })
        : Promise.resolve(emptyPostPage()),
      viewer ? matchlogApi.listFollowingUsers() : Promise.resolve([]),
      matchlogApi.listFollowingUsers(profileUserId),
      matchlogApi.listFollowerUsers(profileUserId),
    ]);

    setState({
      viewer,
      profileUser,
      isOwnProfile,
      stats,
      profilePosts: profilePostsPage.items,
      myPosts: isOwnProfile ? profilePostsPage.items : [],
      friendPosts: friendPostsPage.items,
      popularPosts: popularPostsPage.items,
      statLeagueOptions: statOptions.leagues,
      statTeamOptions: statOptions.teams,
      followingUserIds: viewerFollowingUsers.map((user) => user.id),
      followerCount: profileFollowerUsers.length,
      followingCount: profileFollowingUsers.length,
    });
  }, [postQuery, statScope, userId]);

  useEffect(() => {
    load();
  }, [load]);

  const selectedTeams = useMemo(
    () => state?.profileUser.favoriteTeams ?? [],
    [state?.profileUser.favoriteTeams],
  );
  const profilePosts = useMemo(() => state?.profilePosts ?? [], [state?.profilePosts]);
  const myPosts = useMemo(() => state?.myPosts ?? [], [state?.myPosts]);
  const friendPosts = useMemo(() => state?.friendPosts ?? [], [state?.friendPosts]);
  const popularPosts = useMemo(() => state?.popularPosts ?? [], [state?.popularPosts]);

  const scopedStats = useMemo(() => {
    return {
      inPersonMatches: state?.stats.inPersonMatches ?? 0,
      liveMatches: state?.stats.liveMatches ?? 0,
      postCount: state?.stats.timelineCount ?? 0,
      receivedLikes: state?.stats.receivedLikes ?? 0,
    };
  }, [
    state?.stats.inPersonMatches,
    state?.stats.liveMatches,
    state?.stats.receivedLikes,
    state?.stats.timelineCount,
  ]);

  return {
    friendPosts,
    followingCount: state?.followingCount ?? 0,
    followerCount: state?.followerCount ?? 0,
    load,
    myPosts,
    popularPosts,
    profilePosts,
    scopedStats,
    selectedTeams,
    statLeagueOptions: state?.statLeagueOptions ?? [],
    statTeamOptions: state?.statTeamOptions ?? [],
    followingUserIds: state?.followingUserIds ?? [],
    setStatScope,
    state,
    statScope,
  };
}
