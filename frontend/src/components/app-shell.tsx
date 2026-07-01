"use client";

import Link from "next/link";
import { CalendarDays, Home } from "lucide-react";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { GlobalLogButton } from "@/features/matches/global-log-button";

const navItems = [
  { href: "/", label: "홈", icon: Home },
  { href: "/today", label: "경기", icon: CalendarDays },
  { href: "/calendar", label: "달력", icon: CalendarDays },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <Link className="flex items-center gap-3" href="/">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-sm shadow-primary/15">
              <Home className="h-5 w-5" />
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-semibold tracking-tight">
                gamelog
              </span>
              <span className="block text-xs text-muted-foreground">
                micro posts for games
              </span>
            </span>
          </Link>
          <Suspense fallback={<NavFallback />}>
            <NavLinks />
          </Suspense>
        </div>
      </header>
      <main>{children}</main>
      <GlobalLogButton />
    </div>
  );
}

function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1 rounded-full border border-border/70 bg-card/80 p-1 shadow-sm shadow-black/5">
      {navItems.map((item) => (
        <Link
          key={item.href}
          className={`flex h-9 items-center gap-2 rounded-full px-3 text-sm font-medium transition-colors ${
            item.href === pathname
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
          href={item.href}
        >
          <item.icon className="h-4 w-4" />
          <span className="hidden sm:inline">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}

function NavFallback() {
  return (
    <nav className="flex items-center gap-1 rounded-full border border-border/70 bg-card/80 p-1 shadow-sm shadow-black/5">
      {navItems.map((item) => (
        <Link
          key={item.href}
          className="flex h-9 items-center gap-2 rounded-full px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          href={item.href}
        >
          <item.icon className="h-4 w-4" />
          <span className="hidden sm:inline">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
