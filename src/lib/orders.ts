export type PaymentId = "card" | "transfer" | "easy";

export type OrderItem = {
  productId: string;
  name: string;
  image: string;
  colorName: string;
  size: string | null;
  qty: number;
  unitPrice: number;
};

export type OrderBuyer = {
  name: string;
  phone: string;
  zip: string;
  address: string;
  detail: string;
  memo: string;
};

export type Order = {
  id: string;
  createdAt: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  buyer: OrderBuyer;
  payment: PaymentId;
};

const KEY = "lumi-orders-v1";

export const PAYMENTS: { id: PaymentId; label: string; note: string }[] = [
  { id: "card", label: "신용·체크카드", note: "카드사로 연결되지 않습니다" },
  { id: "transfer", label: "무통장입금", note: "입금 계좌는 발급되지 않습니다" },
  { id: "easy", label: "간편결제", note: "결제사 앱으로 이동하지 않습니다" },
];

export function paymentLabel(id: PaymentId) {
  return PAYMENTS.find((item) => item.id === id)?.label ?? id;
}

export function createOrderId() {
  const now = new Date();
  const stamp = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("");
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let index = 0; index < 4; index += 1) {
    suffix += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `LUMI-${stamp}-${suffix}`;
}

function readAll(): Record<string, Order> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    return parsed as Record<string, Order>;
  } catch {
    return {};
  }
}

export function saveOrder(order: Order) {
  const all = readAll();
  all[order.id] = order;
  window.localStorage.setItem(KEY, JSON.stringify(all));
}

export function readOrder(id: string) {
  return readAll()[id] ?? null;
}
