export const FREE_SHIPPING_AT = 50_000;
export const SHIPPING_FEE = 3_000;

export function formatKRW(value: number) {
  return `₩${new Intl.NumberFormat("ko-KR").format(value)}`;
}

export function shippingFor(subtotal: number) {
  if (subtotal <= 0) return 0;
  return subtotal >= FREE_SHIPPING_AT ? 0 : SHIPPING_FEE;
}

export function discountRate(price: number, salePrice: number | null) {
  if (salePrice == null || salePrice >= price) return 0;
  return Math.round((1 - salePrice / price) * 100);
}
