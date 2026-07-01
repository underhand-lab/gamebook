"use client";

import { usePathname } from "next/navigation";
import { MatchLogForm } from "./match-log-form";

export function GlobalLogButton() {
  const pathname = usePathname();
  const onMatchDetail = /^\/matches\/[^/]+$/.test(pathname);

  if (onMatchDetail) return null;

  return (
    <MatchLogForm
      buttonLabel="로그 추가"
      fixed
      onSaved={() => undefined}
    />
  );
}
