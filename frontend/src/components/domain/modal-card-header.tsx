"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardHeader } from "@/components/ui/card";
import type { HTMLAttributes } from "react";

type ModalCardHeaderProps = HTMLAttributes<HTMLDivElement> & {
  title: string;
  description?: string;
  onClose?: () => void;
};

export function ModalCardHeader({ title, description, onClose, className, ...props }: ModalCardHeaderProps) {
  return (
    <CardHeader
      className={
        className
          ? `sticky top-0 z-20 bg-card/95 backdrop-blur relative space-y-1 pr-12 ${className}`
          : "sticky top-0 z-20 bg-card/95 backdrop-blur relative space-y-1 pr-12"
      }
      {...props}
    >
      {onClose ? (
        <Button
          aria-label="닫기"
          className="absolute right-4 top-4"
          size="icon"
          type="button"
          variant="ghost"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      ) : null}
      <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
      {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
    </CardHeader>
  );
}
