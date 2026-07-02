"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type PillRadioOption = {
  value: string;
  label: ReactNode;
};

type PillRadioGroupProps = {
  name: string;
  value: string;
  options: PillRadioOption[];
  columnsClassName?: string;
  groupClassName?: string;
  onChange: (value: string) => void;
};

export function RadioPillGroup({
  name,
  value,
  options,
  columnsClassName,
  groupClassName,
  onChange,
}: PillRadioGroupProps) {
  return (
    <div className={cn(groupClassName, "grid gap-2", columnsClassName)}>
      {options.map((option) => (
        <label
          key={option.value}
          className="flex h-10 cursor-pointer items-center justify-center rounded-full bg-card px-3 text-sm font-medium transition-colors has-[:checked]:bg-primary has-[:checked]:text-primary-foreground"
        >
          <input
            checked={value === option.value}
            className="sr-only"
            name={name}
            type="radio"
            value={option.value}
            onChange={() => onChange(option.value)}
          />
          {option.label}
        </label>
      ))}
    </div>
  );
}

export const PillRadioGroup = RadioPillGroup;
