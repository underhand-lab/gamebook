"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { MatchLogForm } from "./match-log-form";
import { matchlogApi } from "@/lib/api";

export function GlobalLogButton() {
  const pathname = usePathname();
  const [canWrite, setCanWrite] = useState(false);
  const onMatchDetail = /^\/matches\/[^/]+$/.test(pathname);

  useEffect(() => {
    let active = true;
    matchlogApi.getSession().then((session) => {
      if (active) setCanWrite(Boolean(session.user));
    });
    return () => {
      active = false;
    };
  }, []);

  if (onMatchDetail || !canWrite) return null;

  return (
    <MatchLogForm
      buttonLabel="로그 추가"
      fixed
      onSaved={() => undefined}
    />
  );
}
