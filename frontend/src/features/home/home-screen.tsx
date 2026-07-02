"use client";

import { Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { PostFeed } from "@/components/domain/post-feed";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { matchlogApi, type PostFeedItem } from "@/lib/api";
import { ProfileScreen } from "@/features/profile/profile-screen";

export function HomeScreen({ userId }: { userId?: string }) {
  const [viewerId, setViewerId] = useState<string | null | undefined>(undefined);
  const [posts, setPosts] = useState<PostFeedItem[]>([]);
  const [query, setQuery] = useState("");

  const loadGuestPosts = useCallback(async (nextQuery: string) => {
    const page = await matchlogApi.listPopularPosts({
      q: nextQuery,
      size: 100,
      sort: "LATEST",
    });
    setPosts(page.items);
  }, []);

  useEffect(() => {
    let active = true;

    matchlogApi.getSession().then((session) => {
      if (!active) return;
      setViewerId(session.user?.id ?? null);
    });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (viewerId !== null) return;
    void loadGuestPosts(query);
  }, [loadGuestPosts, query, viewerId]);

  if (viewerId === undefined) {
    return <div className="page-shell text-sm text-muted-foreground">불러오는 중</div>;
  }

  if (viewerId) {
    return <ProfileScreen userId={userId ?? viewerId} />;
  }

  return (
    <div className="page-shell">
      <div className="mx-auto w-full max-w-4xl space-y-4">
        <Card className="border-border/70 bg-card/90 shadow-sm shadow-black/5">
          <CardHeader className="space-y-3">
            <div>
              <CardTitle>전체 포스트</CardTitle>
            </div>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="팀명, 리그, 작성자, 키워드 검색"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <PostFeed
              items={posts}
              emptyLabel="표시할 공개 포스트가 없습니다."
              showMatchButton
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
