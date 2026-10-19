import { useEffect, useRef, useState } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { isCategory, isPrice, isSort } from "@/data/catalog";
import { cn } from "@/lib/utils";

export function SearchBox({ id, className }: { id: string; className?: string }) {
  const navigate = useNavigate();
  const urlQ = useRouterState({
    select: (state) => {
      const query = (state.location.search as { q?: unknown }).q;
      return typeof query === "string" ? query : "";
    },
  });
  const searchRef = useRef<unknown>({});
  const locationSearch = useRouterState({ select: (state) => state.location.search });
  searchRef.current = locationSearch;

  const [value, setValue] = useState(urlQ);
  const focused = useRef(false);

  useEffect(() => {
    if (!focused.current) setValue(urlQ);
  }, [urlQ]);

  useEffect(() => {
    if (value === urlQ) return;
    const timer = window.setTimeout(() => {
      const current = (searchRef.current ?? {}) as Record<string, unknown>;
      void navigate({
        to: "/products",
        replace: true,
        search: {
          q: value.trim() ? value : undefined,
          category: isCategory(current.category) ? current.category : undefined,
          sort: isSort(current.sort) ? current.sort : undefined,
          price: isPrice(current.price) ? current.price : undefined,
        },
      });
    }, 180);
    return () => window.clearTimeout(timer);
  }, [navigate, urlQ, value]);

  return (
    <form
      role="search"
      className={cn("relative min-w-0", className)}
      onSubmit={(event) => event.preventDefault()}
    >
      <label htmlFor={id} className="sr-only">
        상품 검색
      </label>
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
      <input
        id={id}
        type="search"
        value={value}
        placeholder="상품, 카테고리 검색"
        autoComplete="off"
        onFocus={() => {
          focused.current = true;
        }}
        onBlur={() => {
          focused.current = false;
        }}
        onChange={(event) => setValue(event.target.value)}
        className="min-h-11 w-full rounded-full border border-line bg-sand pr-4 pl-10 text-sm text-ink outline-none placeholder:text-muted focus:border-ink focus:bg-paper"
      />
    </form>
  );
}
