import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  CATEGORIES,
  filterProducts,
  PRICE_LABELS,
  SORT_LABELS,
  validateProductSearch,
  type PriceBand,
  type ProductSearch,
  type SortId,
} from "@/data/catalog";
import { ProductCard } from "@/components/product-card";
import { SearchBox } from "@/components/search-box";
import { Shell } from "@/components/shell";

export const Route = createFileRoute("/products/")({
  validateSearch: (search) => validateProductSearch(search as Record<string, unknown>),
  head: () => ({ meta: [{ title: "상품 · LUMI 스토어" }] }),
  component: ProductListPage,
});

function ProductListPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const products = filterProducts(search);
  const sort = search.sort ?? "popular";

  function update(patch: Partial<ProductSearch>) {
    void navigate({
      to: "/products",
      replace: true,
      search: { ...search, ...patch },
    });
  }

  return (
    <main className="py-8 md:py-12">
      <Shell>
        <h1 className="text-2xl font-medium tracking-tight text-ink md:text-3xl">상품</h1>
        <p className="mt-2 text-sm text-muted">카테고리, 가격, 검색어로 바로 좁힐 수 있습니다.</p>

        <div className="mt-6 grid grid-cols-1 gap-4">
          <SearchBox id="catalog-search" />
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <p className="text-xs text-muted" id="category-filter-label">
                카테고리
              </p>
              <div className="mt-2 flex min-w-0 gap-2 overflow-x-auto pb-1" role="group" aria-labelledby="category-filter-label">
                <FilterChip pressed={!search.category} onClick={() => update({ category: undefined })}>
                  전체
                </FilterChip>
                {CATEGORIES.map((category) => (
                  <FilterChip
                    key={category.id}
                    pressed={search.category === category.id}
                    onClick={() => update({ category: category.id })}
                  >
                    {category.label}
                  </FilterChip>
                ))}
              </div>
            </div>
            <div className="w-full sm:w-48">
              <label htmlFor="sort" className="text-xs text-muted">
                정렬
              </label>
              <select
                id="sort"
                value={sort}
                onChange={(event) => update({ sort: event.target.value as SortId })}
                className="mt-2 min-h-11 w-full rounded-full border border-line bg-paper px-4 text-sm text-ink"
              >
                {SORT_LABELS.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted" id="price-filter-label">
              가격대
            </p>
            <div className="mt-2 flex flex-wrap gap-2" role="group" aria-labelledby="price-filter-label">
              {PRICE_LABELS.map((item) => (
                <FilterChip
                  key={item.id}
                  pressed={(search.price ?? "all") === item.id}
                  onClick={() => update({ price: item.id === "all" ? undefined : (item.id as PriceBand) })}
                >
                  {item.label}
                </FilterChip>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-6 text-sm text-muted" aria-live="polite">
          상품 {products.length}개
        </p>

        {products.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-line px-6 py-16 text-center">
            <p className="font-medium text-ink">조건에 맞는 상품이 없습니다</p>
            <button
              type="button"
              className="mt-4 min-h-11 rounded-full bg-ink px-5 text-sm text-paper"
              onClick={() =>
                void navigate({
                  to: "/products",
                  search: {},
                  replace: true,
                })
              }
            >
              필터 지우기
            </button>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </Shell>
    </main>
  );
}

function FilterChip({
  pressed,
  onClick,
  children,
}: {
  pressed: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={
        pressed
          ? "inline-flex min-h-11 shrink-0 items-center rounded-full bg-coral px-4 text-sm font-medium text-ink"
          : "inline-flex min-h-11 shrink-0 items-center rounded-full border border-line bg-paper px-4 text-sm text-ink"
      }
    >
      {children}
    </button>
  );
}
