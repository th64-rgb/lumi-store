import { Link } from "@tanstack/react-router";
import { categoryLabel } from "@/data/catalog";
import type { Product } from "@/data/products";
import { discountRate } from "@/lib/money";
import { Price } from "@/components/price";
import { Stars } from "@/components/stars";

export function ProductCard({ product }: { product: Product }) {
  const rate = discountRate(product.price, product.salePrice);
  return (
    <article>
      <Link
        to="/products/$productId"
        params={{ productId: product.id }}
        preload="intent"
        className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
      >
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-sand">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover motion-safe:transition motion-safe:duration-300 group-hover:scale-105"
          />
          {product.badge || rate > 0 ? (
            <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
              {product.badge === "BEST" ? (
                <span className="rounded-full bg-ink px-2.5 py-1 text-xs text-paper">베스트</span>
              ) : null}
              {product.badge === "NEW" ? (
                <span className="rounded-full bg-paper px-2.5 py-1 text-xs text-ink">신상품</span>
              ) : null}
              {rate > 0 ? (
                <span className="rounded-full bg-coral px-2.5 py-1 text-xs text-ink">{rate}%</span>
              ) : null}
            </div>
          ) : null}
        </div>
        <div className="space-y-1 px-1 pt-3">
          <p className="text-xs text-muted">{categoryLabel(product.category)}</p>
          <h3 className="text-sm font-medium text-ink">{product.name}</h3>
          <Stars rating={product.rating} />
          <Price price={product.price} salePrice={product.salePrice} />
        </div>
      </Link>
    </article>
  );
}
