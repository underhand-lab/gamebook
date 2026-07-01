"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Option = {
  value: string;
  label: string;
  description?: string;
};

type StackedSearchSelectProps = {
  label: string;
  placeholder: string;
  query: string;
  options: Option[];
  onQueryChange: (value: string) => void;
  onPick: (option: Option) => void;
  onSubmit?: (value: string) => void;
  buttonLabel?: string;
};

export function StackedSearchSelect({
  label,
  placeholder,
  query,
  options,
  onQueryChange,
  onPick,
  onSubmit,
  buttonLabel = "검색",
}: StackedSearchSelectProps) {
  const [open, setOpen] = useState(false);
  const term = query.trim().toLowerCase();

  useEffect(() => {
    if (!query) setOpen(false);
  }, [query]);

  return (
    <div className="space-y-2">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="relative">
        <div className="flex items-center gap-2">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder={placeholder}
              value={query}
              onChange={(event) => {
                onQueryChange(event.target.value);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
            />
          </div>
          <Button
            type="button"
            onClick={() => {
              setOpen(true);
              onSubmit?.(query);
            }}
          >
            {buttonLabel}
          </Button>
        </div>
        {open && term ? (
          <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-20 grid gap-2 rounded-2xl border bg-background p-2 shadow-lg">
            {options.length ? (
              options.map((option) => (
                <button
                  key={option.value}
                  className="flex items-center justify-between rounded-xl px-3 py-2 text-left transition-colors hover:bg-muted"
                  type="button"
                  onClick={() => {
                    onPick(option);
                    setOpen(false);
                  }}
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">{option.label}</span>
                    {option.description ? (
                      <span className="block truncate text-xs text-muted-foreground">
                        {option.description}
                      </span>
                    ) : null}
                  </span>
                </button>
              ))
            ) : (
              <p className="px-3 py-2 text-sm text-muted-foreground">검색 결과가 없습니다.</p>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
