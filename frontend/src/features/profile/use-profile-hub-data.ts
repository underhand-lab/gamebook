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
  me: UserDetail;
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
    const isMe = userId === "user-me";
    const profileUserId = isMe ? "user-me" : userId;
    const postParams = { q: postQuery, size: 100 };
    const [
      me,
      stats,
      statOptions,
      profilePostsPage,
      friendPostsPage,
      popularPostsPage,
      viewerFollowingUsers,
      profileFollowingUsers,
      profileFollowerUsers,
    ] = await Promise.all([
      isMe ? matchlogApi.getMe() : matchlogApi.getUser(userId),
      matchlogApi.getUserStats(profileUserId, statScope),
      matchlogApi.getUserStatOptions(profileUserId, {
        leagueId: statScope.leagueId,
      }),
      matchlogApi.listUserPosts(profileUserId, postParams),
      isMe
        ? matchlogApi.listFollowingPosts({ q: postQuery, size: 50 })
        : Promise.resolve(emptyPostPage()),
      isMe
        ? matchlogApi.listPopularPosts({
            q: postQuery,
            size: 50,
            sort: "MOST_LIKED",
          })
        : Promise.resolve(emptyPostPage()),
      matchlogApi.listFollowingUsers(),
      matchlogApi.listFollowingUsers(profileUserId),
      matchlogApi.listFollowerUsers(profileUserId),
    ]);

    setState({
      me,
      stats,
      profilePosts: profilePostsPage.items,
      myPosts: isMe ? profilePostsPage.items : [],
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

  const selectedTeams = useMemo(() => state?.me.favoriteTeams ?? [], [state?.me.favoriteTeams]);
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
