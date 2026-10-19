import { useEffect, useState } from "react";
import { getProduct, unitPrice } from "@/data/products";
import { useCart } from "@/lib/cart-store";
import { shippingFor } from "@/lib/money";

export function useCartHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    if (useCart.persist.hasHydrated()) {
      setHydrated(true);
      return;
    }
    return useCart.persist.onFinishHydration(() => setHydrated(true));
  }, []);
  return hydrated;
}

export function useCartView() {
  const lines = useCart((state) => state.lines);
  const hydrated = useCartHydrated();
  const rows = lines.flatMap((line) => {
    const product = getProduct(line.productId);
    if (!product) return [];
    const color = product.colors.find((item) => item.id === line.colorId);
    const unit = unitPrice(product);
    return [
      {
        line,
        product,
        colorName: color?.name ?? "기본",
        unit,
        sum: unit * line.qty,
      },
    ];
  });
  const count = rows.reduce((sum, row) => sum + row.line.qty, 0);
  const subtotal = rows.reduce((sum, row) => sum + row.sum, 0);
  const shipping = shippingFor(subtotal);
  return { hydrated, rows, count, subtotal, shipping, total: subtotal + shipping };
}
