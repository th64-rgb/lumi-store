import { createFileRoute, Link } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { formatKRW } from "@/lib/money";
import { QtyStepper } from "@/components/qty-stepper";
import { buttonClass, Shell } from "@/components/shell";
import { OrderSummary } from "@/components/summary";
import { useCartView } from "@/components/use-cart-view";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "장바구니 · LUMI 스토어" }] }),
  component: CartPage,
});

function CartPage() {
  const { hydrated, rows, subtotal, shipping, total } = useCartView();
  const setQty = useCart((state) => state.setQty);
  const remove = useCart((state) => state.remove);

  return (
    <main className="py-8 md:py-12">
      <Shell>
        <h1 className="text-2xl font-medium tracking-tight text-ink md:text-3xl">장바구니</h1>
        {!hydrated ? (
          <p className="mt-8 text-sm text-muted">장바구니를 불러오는 중입니다.</p>
        ) : rows.length === 0 ? (
          <div className="mt-8 rounded-2xl bg-sand px-6 py-16 text-center">
            <p className="font-medium text-ink">장바구니가 비어 있습니다</p>
            <p className="mt-2 text-sm text-muted">담아 둔 상품은 이 브라우저에 남습니다.</p>
            <Link to="/products" className={`${buttonClass.primary} mt-6`}>
              쇼핑 계속하기
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_0.8fr] lg:items-start">
            <ul className="divide-y divide-line border-y border-line">
              {rows.map((row) => (
                <li key={row.line.key} className="flex gap-4 py-5">
                  <Link
                    to="/products/$productId"
                    params={{ productId: row.product.id }}
                    className="size-24 shrink-0 overflow-hidden rounded-2xl bg-sand"
                  >
                    <img src={row.product.image} alt="" className="h-full w-full object-cover" />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <Link
                          to="/products/$productId"
                          params={{ productId: row.product.id }}
                          className="font-medium text-ink"
                        >
                          {row.product.name}
                        </Link>
                        <p className="mt-1 text-sm text-muted">
                          {row.colorName}
                          {row.line.size ? ` · ${row.line.size}` : ""}
                        </p>
                      </div>
                      <button
                        type="button"
                        aria-label={`${row.product.name} 삭제`}
                        onClick={() => remove(row.line.key)}
                        className="inline-flex size-11 shrink-0 items-center justify-center rounded-full hover:bg-sand"
                      >
                        <Trash2 className="size-4" aria-hidden="true" />
                      </button>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                      <QtyStepper value={row.line.qty} onChange={(next) => setQty(row.line.key, next)} />
                      <p className="font-medium tabular-nums text-ink">{formatKRW(row.sum)}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="lg:sticky lg:top-36">
              <OrderSummary subtotal={subtotal} shipping={shipping} total={total} />
              <Link to="/checkout" className={`${buttonClass.primary} mt-4 w-full`}>
                주문하기
              </Link>
              <Link to="/products" className={`${buttonClass.quiet} mt-1 w-full`}>
                쇼핑 계속하기
              </Link>
            </div>
          </div>
        )}
      </Shell>
    </main>
  );
}
