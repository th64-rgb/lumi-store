import { PRODUCTS, unitPrice, type CategoryId, type Product } from "@/data/products";

export const CATEGORY_IDS = ["mug", "tumbler", "bag", "candle", "note"] as const;
export const SORT_IDS = ["popular", "price-asc", "price-desc", "new"] as const;
export const PRICE_IDS = ["u20", "20to30", "30up"] as const;

export type SortId = (typeof SORT_IDS)[number];
export type PriceBand = (typeof PRICE_IDS)[number];

export type ProductSearch = {
  q?: string;
  category?: CategoryId;
  sort?: SortId;
  price?: PriceBand;
};

export const CATEGORIES: { id: CategoryId; label: string; blurb: string }[] = [
  { id: "mug", label: "머그컵", blurb: "아침의 첫 모금" },
  { id: "tumbler", label: "텀블러", blurb: "들고 나가는 온도" },
  { id: "bag", label: "에코백", blurb: "손에 남는 가방" },
  { id: "candle", label: "캔들", blurb: "저녁의 불빛" },
  { id: "note", label: "노트", blurb: "적어 두는 하루" },
];

export const SORT_LABELS: { id: SortId; label: string }[] = [
  { id: "popular", label: "인기순" },
  { id: "price-asc", label: "낮은 가격순" },
  { id: "price-desc", label: "높은 가격순" },
  { id: "new", label: "최신순" },
];

export const PRICE_LABELS: { id: PriceBand | "all"; label: string }[] = [
  { id: "all", label: "전체 가격" },
  { id: "u20", label: "2만 원 미만" },
  { id: "20to30", label: "2만–3만 원" },
  { id: "30up", label: "3만 원 이상" },
];

const DETAIL: Partial<Record<CategoryId, string>> = {
  mug: "/products/detail-ceramic.jpg",
  bag: "/products/detail-canvas.jpg",
  candle: "/products/detail-flame.jpg",
};

export function isCategory(value: unknown): value is CategoryId {
  return typeof value === "string" && (CATEGORY_IDS as readonly string[]).includes(value);
}

export function isSort(value: unknown): value is SortId {
  return typeof value === "string" && (SORT_IDS as readonly string[]).includes(value);
}

export function isPrice(value: unknown): value is PriceBand {
  return typeof value === "string" && (PRICE_IDS as readonly string[]).includes(value);
}

export function validateProductSearch(search: Record<string, unknown>): ProductSearch {
  const next: ProductSearch = {};
  if (typeof search.q === "string" && search.q.trim()) next.q = search.q;
  if (isCategory(search.category)) next.category = search.category;
  if (isSort(search.sort)) next.sort = search.sort;
  if (isPrice(search.price)) next.price = search.price;
  return next;
}

export function categoryLabel(id: CategoryId) {
  return CATEGORIES.find((item) => item.id === id)?.label ?? id;
}

export function categoryCover(id: CategoryId) {
  return PRODUCTS.find((product) => product.category === id)?.image ?? "/products/hero.jpg";
}

export function galleryOf(product: Product) {
  const siblings = PRODUCTS.filter((item) => item.category === product.category && item.id !== product.id)
    .slice(0, 2)
    .map((item) => item.image);
  const extra = DETAIL[product.category];
  return [...new Set([product.image, extra, ...siblings].filter((item): item is string => Boolean(item)))].slice(0, 4);
}

export function bestProducts() {
  return [...PRODUCTS].sort((a, b) => b.popularity - a.popularity).slice(0, 8);
}

export function filterProducts(search: ProductSearch) {
  const query = search.q?.trim().toLowerCase() ?? "";
  const filtered = PRODUCTS.filter((product) => {
    if (search.category && product.category !== search.category) return false;
    if (query) {
      const blob = `${product.name} ${product.summary} ${categoryLabel(product.category)}`.toLowerCase();
      if (!blob.includes(query)) return false;
    }
    const price = unitPrice(product);
    if (search.price === "u20" && price >= 20000) return false;
    if (search.price === "20to30" && (price < 20000 || price >= 30000)) return false;
    if (search.price === "30up" && price < 30000) return false;
    return true;
  });

  const sort = search.sort ?? "popular";
  return filtered.sort((a, b) => {
    if (sort === "price-asc") return unitPrice(a) - unitPrice(b);
    if (sort === "price-desc") return unitPrice(b) - unitPrice(a);
    if (sort === "new") return b.createdAt.localeCompare(a.createdAt);
    return b.popularity - a.popularity;
  });
}

export function formatDotDate(iso: string) {
  const [year, month, day] = iso.split("-");
  if (!year || !month || !day) return iso;
  return `${year}.${month}.${day}`;
}
