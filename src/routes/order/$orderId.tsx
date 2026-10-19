import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { formatKRW } from "@/lib/money";
import { paymentLabel, readOrder, type Order } from "@/lib/orders";
import { buttonClass, Shell } from "@/components/shell";

export const Route = createFileRoute("/order/$orderId")({
  head: () => ({ meta: [{ title: "주문 완료 · LUMI 스토어" }] }),
  component: OrderDonePage,
});

function OrderDonePage() {
  const { orderId } = Route.useParams();
  const [order, setOrder] = useState<Order | null | undefined>(undefined);

  useEffect(() => {
    setOrder(readOrder(orderId));
  }, [orderId]);

  return (
    <main className="py-8 md:py-12">
      <Shell className="max-w-2xl">
        {order === undefined ? (
          <p className="text-sm text-muted">주문 정보를 확인하고 있습니다.</p>
        ) : order === null ? (
          <div className="rounded-2xl bg-sand px-6 py-16 text-center">
            <h1 className="text-xl font-medium text-ink">주문을 찾을 수 없습니다</h1>
            <p className="mt-2 text-sm text-muted">이 브라우저에 남은 주문만 다시 볼 수 있습니다.</p>
            <Link to="/" className={`${buttonClass.primary} mt-6`}>
              홈으로
            </Link>
          </div>
        ) : (
          <div>
            <p className="text-sm font-medium text-coral-ink">데모 사이트 – 실제 결제되지 않습니다</p>
            <h1 className="mt-3 text-3xl font-medium tracking-tight text-ink">주문이 완료되었습니다</h1>
            <p className="mt-4 text-sm text-muted">주문번호</p>
            <p className="mt-1 font-display text-3xl text-ink">{order.id}</p>
            <p className="mt-3 text-sm leading-6 text-muted">
              {order.buyer.name}님, 배송지는 {order.buyer.address}
              {order.buyer.detail ? ` ${order.buyer.detail}` : ""}
              입니다. 결제 수단은 {paymentLabel(order.payment)}이며, 금액은 실제로 청구되지 않습니다.
            </p>
            <ul className="mt-8 divide-y divide-line border-y border-line">
              {order.items.map((item) => (
                <li key={`${item.productId}-${item.colorName}-${item.size ?? ""}`} className="flex items-center gap-3 py-4">
                  <img src={item.image} alt="" className="size-16 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-ink">{item.name}</p>
                    <p className="text-sm text-muted">
                      {item.colorName}
                      {item.size ? ` · ${item.size}` : ""} · {item.qty}개
                    </p>
                  </div>
                  <p className="text-sm tabular-nums">{formatKRW(item.unitPrice * item.qty)}</p>
                </li>
              ))}
            </ul>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">상품 금액</dt>
                <dd className="tabular-nums">{formatKRW(order.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">배송비</dt>
                <dd className="tabular-nums">{order.shipping === 0 ? "무료" : formatKRW(order.shipping)}</dd>
              </div>
              <div className="flex justify-between text-base font-semibold">
                <dt>총액</dt>
                <dd className="tabular-nums">{formatKRW(order.total)}</dd>
              </div>
            </dl>
            <Link to="/" className={`${buttonClass.primary} mt-8`}>
              계속 둘러보기
            </Link>
          </div>
        )}
      </Shell>
    </main>
  );
}
