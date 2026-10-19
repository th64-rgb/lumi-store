import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartLine = {
  key: string;
  productId: string;
  colorId: string;
  size: string | null;
  qty: number;
};

type AddInput = {
  productId: string;
  colorId: string;
  size: string | null;
  qty?: number;
};

type CartState = {
  lines: CartLine[];
  add: (input: AddInput) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
};

function lineKey(productId: string, colorId: string, size: string | null) {
  return `${productId}::${colorId}::${size ?? ""}`;
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      add: (input) =>
        set((state) => {
          const key = lineKey(input.productId, input.colorId, input.size);
          const qty = Math.min(10, Math.max(1, input.qty ?? 1));
          const existing = state.lines.find((line) => line.key === key);
          if (existing) {
            return {
              lines: state.lines.map((line) =>
                line.key === key ? { ...line, qty: Math.min(10, line.qty + qty) } : line,
              ),
            };
          }
          return {
            lines: [
              ...state.lines,
              {
                key,
                productId: input.productId,
                colorId: input.colorId,
                size: input.size,
                qty,
              },
            ],
          };
        }),
      setQty: (key, qty) =>
        set((state) => ({
          lines:
            qty <= 0
              ? state.lines.filter((line) => line.key !== key)
              : state.lines.map((line) =>
                  line.key === key ? { ...line, qty: Math.min(10, qty) } : line,
                ),
        })),
      remove: (key) => set((state) => ({ lines: state.lines.filter((line) => line.key !== key) })),
      clear: () => set({ lines: [] }),
    }),
    {
      name: "lumi-cart-v1",
      partialize: (state) => ({ lines: state.lines }),
    },
  ),
);
