import { Link, useRouterState } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import { CATEGORIES, isCategory } from "@/data/catalog";
import { SearchBox } from "@/components/search-box";
import { Shell } from "@/components/shell";
import { useCartView } from "@/components/use-cart-view";

export function SiteHeader() {
  const { count } = useCartView();
  const category = useRouterState({
    select: (state) => {
      const value = (state.location.search as { category?: unknown }).category;
      return isCategory(value) ? value : undefined;
    },
  });

  return (
    <div className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur-md">
      <p className="bg-ink px-4 py-2 text-center text-sm text-paper">데모 사이트 – 실제 결제되지 않습니다</p>
      <Shell className="py-3">
        <div className="flex items-center gap-3 md:gap-6">
          <Link to="/" className="shrink-0 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral">
            <span className="font-display text-2xl tracking-tight text-ink">LUMI</span>
            <span className="sr-only">스토어 홈</span>
          </Link>
          <nav aria-label="카테고리" className="hidden min-w-0 flex-1 items-center gap-1 lg:flex">
            {CATEGORIES.map((item) => {
              const active = category === item.id;
              return (
                <Link
                  key={item.id}
                  to="/products"
                  search={{ category: item.id }}
                  aria-current={active ? "page" : undefined}
                  className={
                    active
                      ? "inline-flex min-h-11 items-center rounded-full bg-coral px-3 text-sm font-medium text-ink"
                      : "inline-flex min-h-11 items-center rounded-full px-3 text-sm text-ink hover:bg-sand"
                  }
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <SearchBox id="header-search" className="hidden max-w-xs flex-1 md:block" />
          <Link
            to="/cart"
            aria-label={count > 0 ? `장바구니, ${count}개 담김` : "장바구니"}
            className="relative ml-auto inline-flex size-11 items-center justify-center rounded-full hover:bg-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral"
          >
            <ShoppingBag className="size-5" aria-hidden="true" />
            {count > 0 ? (
              <span className="absolute top-1 right-1 inline-flex min-w-5 items-center justify-center rounded-full bg-coral px-1 text-xs font-semibold text-ink tabular-nums">
                {count > 99 ? "99+" : count}
              </span>
            ) : null}
          </Link>
        </div>
        <SearchBox id="header-search-mobile" className="mt-3 md:hidden" />
        <nav aria-label="카테고리" className="mt-3 flex min-w-0 gap-2 overflow-x-auto pb-1 lg:hidden">
          {CATEGORIES.map((item) => {
            const active = category === item.id;
            return (
              <Link
                key={item.id}
                to="/products"
                search={{ category: item.id }}
                aria-current={active ? "page" : undefined}
                className={
                  active
                    ? "inline-flex min-h-11 shrink-0 items-center rounded-full bg-coral px-4 text-sm font-medium text-ink"
                    : "inline-flex min-h-11 shrink-0 items-center rounded-full border border-line px-4 text-sm text-ink"
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </Shell>
    </div>
  );
}
