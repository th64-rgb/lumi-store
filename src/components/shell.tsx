import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Shell({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6", className)}>{children}</div>;
}

export const buttonClass = {
  primary:
    "inline-flex min-h-11 items-center justify-center rounded-full bg-coral px-6 text-sm font-medium text-ink motion-safe:transition-colors hover:bg-coral-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:cursor-not-allowed disabled:opacity-40",
  outline:
    "inline-flex min-h-11 items-center justify-center rounded-full border border-line bg-paper px-6 text-sm font-medium text-ink motion-safe:transition-colors hover:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:cursor-not-allowed disabled:opacity-40",
  quiet:
    "inline-flex min-h-11 items-center justify-center rounded-full px-4 text-sm font-medium text-ink hover:bg-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral",
} as const;
