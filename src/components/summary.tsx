import { FREE_SHIPPING_AT, formatKRW } from "@/lib/money";

export function OrderSummary({
  subtotal,
  shipping,
  total,
}: {
  subtotal: number;
  shipping: number;
  total: number;
}) {
  const remain = Math.max(0, FREE_SHIPPING_AT - subtotal);
  const ratio = subtotal <= 0 ? 0 : Math.min(100, Math.round((subtotal / FREE_SHIPPING_AT) * 100));
  return (
    <div className="rounded-2xl bg-sand p-5">
      <h2 className="text-base font-medium text-ink">결제 금액</h2>
      <div
        className="mt-4 h-1.5 overflow-hidden rounded-full bg-line"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={FREE_SHIPPING_AT}
        aria-valuenow={Math.min(subtotal, FREE_SHIPPING_AT)}
        aria-label="무료배송까지 진행"
      >
        <div className="h-full bg-coral" style={{ width: `${ratio}%` }} />
      </div>
      <p className="mt-2 text-sm text-muted">
        {subtotal <= 0
          ? `${formatKRW(FREE_SHIPPING_AT)} 이상 담으면 무료배송`
          : remain > 0
            ? `${formatKRW(remain)} 더 담으면 무료배송`
            : "무료배송이 적용되었습니다"}
      </p>
      <dl className="mt-5 space-y-2 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-muted">상품 금액</dt>
          <dd className="tabular-nums">{formatKRW(subtotal)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted">배송비</dt>
          <dd className="tabular-nums">{shipping === 0 ? "무료" : formatKRW(shipping)}</dd>
        </div>
        <div className="flex justify-between gap-4 border-t border-line pt-3 text-base font-semibold">
          <dt>총액</dt>
          <dd className="tabular-nums">{formatKRW(total)}</dd>
        </div>
      </dl>
    </div>
  );
}
