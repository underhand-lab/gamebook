"use client";

import { useCallback, useEffect, useState } from "react";
import {
  MatchDetailInfoCard,
  MatchDetailPostsCard,
  MatchDetailStatsCard,
  type PostFanTab,
  type StatFanScope,
} from "./match-detail-panels";
import {
  matchlogApi,
  type MatchAggregate,
  type MatchDetail,
  type MatchLogAggregate,
  type UserDetail,
} from "@/lib/api";

type DetailState = {
  me: UserDetail;
  match: MatchDetail;
  myItem?: MatchLogAggregate | null;
};

export function MatchDetailScreen({ matchId }: { matchId: string }) {
  const [state, setState] = useState<DetailState | null>(null);
  const [statAggregate, setStatAggregate] = useState<MatchAggregate>({});
  const [postTab, setPostTab] = useState<PostFanTab>("ALL");
  const [statTab, setStatTab] = useState<StatFanScope>("HOME_FAN");

  const load = useCallback(async () => {
    const [me, match, timeline] = await Promise.all([
      matchlogApi.getMe(),
      matchlogApi.getMatchDetail(matchId),
      matchlogApi.listMyTimeline({ matchId, size: 1 }),
    ]);

    setState({
      me,
      match,
      myItem: timeline.items[0] ?? null,
    });
  }, [matchId]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    let active = true;

    matchlogApi
      .getMatchAggregate(matchId, { fanPerspective: statTab })
      .then((aggregate) => {
        if (active) setStatAggregate(aggregate);
      });

    return () => {
      active = false;
    };
  }, [matchId, statTab]);

  if (!state) {
    return <div className="page-shell text-sm text-muted-foreground">불러오는 중</div>;
  }

  const { match } = state;

  return (
    <div className="page-shell">
      <div className="page-split">
        <aside className="space-y-4 md:sticky md:top-20 md:self-start">
          <MatchDetailInfoCard match={match} />
          <MatchDetailStatsCard
            aggregate={statAggregate}
            scopeTab={statTab}
            onScopeTabChange={setStatTab}
          />
        </aside>
        <section className="min-w-0 md:sticky md:top-20 md:self-start">
          <MatchDetailPostsCard
            initialReviews={[]}
            match={match}
            meId={state.me.id}
            myItem={state.myItem ?? null}
            fanTab={postTab}
            onFanTabChange={setPostTab}
          />
        </section>
      </div>
    </div>
  );
}
