import { discountRate, formatKRW } from "@/lib/money";

export function Price({ price, salePrice }: { price: number; salePrice: number | null }) {
  const rate = discountRate(price, salePrice);
  const finalPrice = salePrice ?? price;
  return (
    <p className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
      <span className="font-semibold tabular-nums text-ink">{formatKRW(finalPrice)}</span>
      {rate > 0 ? (
        <>
          <span className="text-sm text-muted line-through tabular-nums">{formatKRW(price)}</span>
          <span className="text-sm font-medium text-coral-ink">{rate}%</span>
        </>
      ) : null}
    </p>
  );
}
