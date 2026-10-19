import { createFileRoute, Link } from "@tanstack/react-router";
import { bestProducts, CATEGORIES, categoryCover } from "@/data/catalog";
import { ProductCard } from "@/components/product-card";
import { buttonClass, Shell } from "@/components/shell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [{ title: "LUMI 스토어 — 라이프스타일 잡화" }],
  }),
  component: Home,
});

function Home() {
  const best = bestProducts();
  return (
    <main>
      <Shell className="grid items-center gap-8 py-10 md:grid-cols-2 md:gap-12 md:py-16">
        <div>
          <p className="text-sm font-medium text-coral-ink">시즌 프로모션</p>
          <h1 className="mt-3 text-4xl leading-tight font-medium tracking-tight text-ink md:text-5xl">
            오늘 쓸 물건을, 오래 쓰게.
          </h1>
          <p className="mt-4 max-w-md text-base leading-7 text-muted">
            머그, 텀블러, 에코백, 캔들, 노트. 매일 손이 가는 것들로만 골랐습니다. 5만 원 이상이면 배송비가 없습니다.
          </p>
          <Link to="/products" className={`${buttonClass.primary} mt-6`}>
            지금 쇼핑하기
          </Link>
        </div>
        <div className="overflow-hidden rounded-3xl bg-sand">
          <img
            src="/products/hero.jpg"
            alt="크림 머그, 캔들, 노트, 캔버스 가방이 놓인 나무 테이블"
            fetchPriority="high"
            className="aspect-[16/10] w-full object-cover"
          />
        </div>
      </Shell>

      <Shell className="pb-4">
        <h2 className="text-xl font-medium text-ink">카테고리</h2>
        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-5">
          {CATEGORIES.map((category) => (
            <Link
              key={category.id}
              to="/products"
              search={{ category: category.id }}
              className="group relative block overflow-hidden rounded-2xl bg-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2"
            >
              <img
                src={categoryCover(category.id)}
                alt=""
                className="aspect-[4/5] w-full object-cover motion-safe:transition motion-safe:duration-300 group-hover:scale-105"
              />
              <span className="absolute inset-x-3 bottom-3 rounded-xl bg-paper/95 px-3 py-2">
                <span className="block text-sm font-medium text-ink">{category.label}</span>
                <span className="block text-xs text-muted">{category.blurb}</span>
              </span>
            </Link>
          ))}
        </div>
      </Shell>

      <Shell className="py-12">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-xl font-medium text-ink">베스트 상품</h2>
          <Link to="/products" search={{ sort: "popular" }} className="text-sm text-ink underline-offset-4 hover:underline">
            전체 보기
          </Link>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
          {best.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Shell>

      <section className="bg-sand">
        <Shell className="grid gap-8 py-12 sm:grid-cols-3">
          <div>
            <p className="text-sm text-muted">배송</p>
            <p className="mt-1 font-medium text-ink">5만 원 이상 무료배송</p>
            <p className="mt-1 text-sm text-muted">미만은 3,000원. 이 브라우저에서만 계산됩니다.</p>
          </div>
          <div>
            <p className="text-sm text-muted">결제</p>
            <p className="mt-1 font-medium text-ink">실제 결제되지 않습니다</p>
            <p className="mt-1 text-sm text-muted">주문 완료는 가짜 주문번호로만 끝납니다.</p>
          </div>
          <div>
            <p className="text-sm text-muted">구성</p>
            <p className="mt-1 font-medium text-ink">잡화 20가지</p>
            <p className="mt-1 text-sm text-muted">회원 가입 없이 둘러보고 담을 수 있습니다.</p>
          </div>
        </Shell>
      </section>
    </main>
  );
}
