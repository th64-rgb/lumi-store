import { useState } from "react";
import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { categoryLabel, formatDotDate, galleryOf } from "@/data/catalog";
import { getProduct, type Product } from "@/data/products";
import { useCart } from "@/lib/cart-store";
import { Price } from "@/components/price";
import { QtyStepper } from "@/components/qty-stepper";
import { buttonClass, Shell } from "@/components/shell";
import { Stars } from "@/components/stars";

export const Route = createFileRoute("/products/$productId")({
  loader: ({ params }) => {
    const product = getProduct(params.productId);
    if (!product) throw notFound();
    return product;
  },
  head: ({ loaderData }) => ({
    meta: [{ title: loaderData ? `${loaderData.name} · LUMI 스토어` : "상품 · LUMI 스토어" }],
  }),
  notFoundComponent: () => (
    <main className="mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="text-lg font-medium">상품을 찾을 수 없습니다</h1>
      <Link to="/products" className={`${buttonClass.primary} mt-6`}>
        상품 목록
      </Link>
    </main>
  ),
  component: ProductDetail,
});

function ProductDetail() {
  const product = Route.useLoaderData();
  return <ProductDetailView key={product.id} product={product} />;
}

function ProductDetailView({ product }: { product: Product }) {
  const navigate = useNavigate();
  const images = galleryOf(product);
  const [imageIndex, setImageIndex] = useState(0);
  const [colorId, setColorId] = useState(product.colors[0]?.id ?? "");
  const [size, setSize] = useState(product.sizes[0] ?? null);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<"detail" | "review">("detail");
  const active = images[imageIndex] ?? product.image;
  const color = product.colors.find((item) => item.id === colorId) ?? product.colors[0];

  function addToCart(silent = false) {
    if (!color) return;
    useCart.getState().add({
      productId: product.id,
      colorId: color.id,
      size: product.sizes.length > 0 ? size : null,
      qty,
    });
    if (!silent) toast.success("장바구니에 담았습니다", { description: product.name });
  }

  return (
    <main className="py-8 md:py-12">
      <Shell>
        <p className="text-sm text-muted">
          <Link to="/products" className="underline-offset-4 hover:underline">
            상품
          </Link>
          <span aria-hidden="true"> / </span>
          <Link to="/products" search={{ category: product.category }} className="underline-offset-4 hover:underline">
            {categoryLabel(product.category)}
          </Link>
        </p>
        <div className="mt-4 grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <div className="overflow-hidden rounded-3xl bg-sand">
              <img src={active} alt={`${product.name} 사진 ${imageIndex + 1}`} className="aspect-square w-full object-cover" />
            </div>
            <div className="mt-3 flex gap-2" role="group" aria-label="상품 이미지">
              {images.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  aria-label={`${product.name} 이미지 ${index + 1} 보기`}
                  aria-pressed={index === imageIndex}
                  onClick={() => setImageIndex(index)}
                  className={
                    index === imageIndex
                      ? "size-16 overflow-hidden rounded-xl ring-2 ring-coral ring-offset-2 ring-offset-paper"
                      : "size-16 overflow-hidden rounded-xl ring-1 ring-line"
                  }
                >
                  <img src={image} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-medium tracking-tight text-ink">{product.name}</h1>
            <p className="mt-3 text-sm leading-6 text-muted">{product.summary}</p>
            <div className="mt-3 flex items-center gap-2">
              <Stars rating={product.rating} />
              <span className="text-sm text-muted">리뷰 {product.reviewCount}</span>
            </div>
            <div className="mt-5 text-lg">
              <Price price={product.price} salePrice={product.salePrice} />
            </div>

            <fieldset className="mt-6">
              <legend className="text-sm font-medium text-ink">색상</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.colors.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={item.id === color?.id}
                    onClick={() => setColorId(item.id)}
                    className={
                      item.id === color?.id
                        ? "inline-flex min-h-11 items-center gap-2 rounded-full bg-coral px-3 text-sm text-ink"
                        : "inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-3 text-sm text-ink"
                    }
                  >
                    <span className="size-4 rounded-full border border-line" style={{ backgroundColor: item.hex }} aria-hidden="true" />
                    {item.name}
                  </button>
                ))}
              </div>
            </fieldset>

            {product.sizes.length > 0 ? (
              <fieldset className="mt-5">
                <legend className="text-sm font-medium text-ink">사이즈</legend>
                <div className="mt-2 flex flex-wrap gap-2">
                  {product.sizes.map((item) => (
                    <button
                      key={item}
                      type="button"
                      aria-pressed={item === size}
                      onClick={() => setSize(item)}
                      className={
                        item === size
                          ? "inline-flex min-h-11 items-center rounded-full bg-ink px-4 text-sm text-paper"
                          : "inline-flex min-h-11 items-center rounded-full border border-line px-4 text-sm text-ink"
                      }
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </fieldset>
            ) : (
              <p className="mt-5 text-sm text-muted">단일 사이즈</p>
            )}

            <div className="mt-5">
              <p className="text-sm font-medium text-ink">수량</p>
              <div className="mt-2">
                <QtyStepper value={qty} onChange={setQty} />
              </div>
              <p className="mt-1 text-xs text-muted">최대 10개</p>
            </div>

            <div className="mt-6 grid gap-2 sm:grid-cols-2">
              <button type="button" className={buttonClass.outline} onClick={() => addToCart(false)}>
                장바구니 담기
              </button>
              <button
                type="button"
                className={buttonClass.primary}
                onClick={() => {
                  addToCart(true);
                  void navigate({ to: "/checkout" });
                }}
              >
                바로 구매
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-line pt-6">
          <div role="tablist" aria-label="상품 정보" className="flex gap-2">
            <button
              type="button"
              role="tab"
              id="tab-detail"
              aria-controls="panel-detail"
              aria-selected={tab === "detail"}
              onClick={() => setTab("detail")}
              className={
                tab === "detail"
                  ? "min-h-11 rounded-full bg-ink px-4 text-sm text-paper"
                  : "min-h-11 rounded-full px-4 text-sm text-muted"
              }
            >
              상세 설명
            </button>
            <button
              type="button"
              role="tab"
              id="tab-review"
              aria-controls="panel-review"
              aria-selected={tab === "review"}
              onClick={() => setTab("review")}
              className={
                tab === "review"
                  ? "min-h-11 rounded-full bg-ink px-4 text-sm text-paper"
                  : "min-h-11 rounded-full px-4 text-sm text-muted"
              }
            >
              리뷰 {product.reviewCount}
            </button>
          </div>

          {tab === "detail" ? (
            <div role="tabpanel" id="panel-detail" aria-labelledby="tab-detail" className="mt-6 grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
              <div className="space-y-4">
                {product.story.split("\n\n").map((paragraph) => (
                  <p key={paragraph.slice(0, 24)} className="text-sm leading-7 text-ink">
                    {paragraph}
                  </p>
                ))}
              </div>
              <dl>
                {product.specs.map((spec) => (
                  <div key={spec.label} className="flex justify-between gap-4 border-b border-line py-3 text-sm">
                    <dt className="text-muted">{spec.label}</dt>
                    <dd className="text-right text-ink">{spec.value}</dd>
                  </div>
                ))}
                <div className="flex justify-between gap-4 border-b border-line py-3 text-sm">
                  <dt className="text-muted">배송</dt>
                  <dd className="text-right text-ink">5만 원 이상 무료, 미만 ₩3,000</dd>
                </div>
              </dl>
            </div>
          ) : (
            <div role="tabpanel" id="panel-review" aria-labelledby="tab-review" className="mt-6 divide-y divide-line">
              {product.reviews.map((review) => (
                <article key={review.id} className="py-5">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <Stars rating={review.rating} />
                    <p className="text-sm font-medium text-ink">{review.author}</p>
                    <p className="text-xs text-muted">{formatDotDate(review.date)}</p>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-ink">{review.body}</p>
                </article>
              ))}
            </div>
          )}
        </div>
      </Shell>
    </main>
  );
}
