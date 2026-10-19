import { useState, type FormEvent, type ReactNode } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCart } from "@/lib/cart-store";
import { formatKRW } from "@/lib/money";
import { createOrderId, PAYMENTS, saveOrder, type PaymentId } from "@/lib/orders";
import { buttonClass, Shell } from "@/components/shell";
import { OrderSummary } from "@/components/summary";
import { useCartView } from "@/components/use-cart-view";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "주문 · LUMI 스토어" }] }),
  component: CheckoutPage,
});

type FormState = {
  name: string;
  phone: string;
  zip: string;
  address: string;
  detail: string;
  memo: string;
  payment: PaymentId | "";
};

type Errors = Partial<Record<keyof FormState, string>>;

const EMPTY: FormState = {
  name: "",
  phone: "",
  zip: "",
  address: "",
  detail: "",
  memo: "",
  payment: "",
};

function validate(form: FormState): Errors {
  const errors: Errors = {};
  if (form.name.trim().length < 2) errors.name = "이름을 두 글자 이상 입력해 주세요.";
  const phone = form.phone.replace(/\s/g, "");
  if (!/^01[016789]-?\d{3,4}-?\d{4}$/.test(phone)) errors.phone = "휴대폰 번호를 확인해 주세요.";
  if (!/^\d{5}$/.test(form.zip.trim())) errors.zip = "우편번호 5자리를 입력해 주세요.";
  if (form.address.trim().length < 5) errors.address = "주소를 다섯 글자 이상 입력해 주세요.";
  if (form.detail.trim().length > 80) errors.detail = "상세 주소는 80자 안으로 적어 주세요.";
  if (form.memo.trim().length > 100) errors.memo = "요청 사항은 100자 안으로 적어 주세요.";
  if (form.payment !== "card" && form.payment !== "transfer" && form.payment !== "easy") {
    errors.payment = "결제 수단을 선택해 주세요.";
  }
  return errors;
}

function CheckoutPage() {
  const navigate = useNavigate();
  const { hydrated, rows, subtotal, shipping, total } = useCartView();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    if (rows.length === 0) return;
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    const payment = form.payment as PaymentId;
    const order = {
      id: createOrderId(),
      createdAt: new Date().toISOString(),
      items: rows.map((row) => ({
        productId: row.product.id,
        name: row.product.name,
        image: row.product.image,
        colorName: row.colorName,
        size: row.line.size,
        qty: row.line.qty,
        unitPrice: row.unit,
      })),
      subtotal,
      shipping,
      total,
      buyer: {
        name: form.name.trim(),
        phone: form.phone.trim(),
        zip: form.zip.trim(),
        address: form.address.trim(),
        detail: form.detail.trim(),
        memo: form.memo.trim(),
      },
      payment,
    };
    saveOrder(order);
    useCart.getState().clear();
    void navigate({ to: "/order/$orderId", params: { orderId: order.id } });
  }

  return (
    <main className="py-8 md:py-12">
      <Shell>
        <h1 className="text-2xl font-medium tracking-tight text-ink md:text-3xl">주문</h1>
        <p className="mt-3 rounded-2xl bg-coral-soft px-4 py-3 text-sm text-ink">데모 사이트 – 실제 결제되지 않습니다</p>
        {!hydrated ? (
          <p className="mt-8 text-sm text-muted">주문서를 준비하는 중입니다.</p>
        ) : rows.length === 0 ? (
          <div className="mt-8 rounded-2xl bg-sand px-6 py-16 text-center">
            <p className="font-medium text-ink">주문할 상품이 없습니다</p>
            <Link to="/cart" className={`${buttonClass.primary} mt-6`}>
              장바구니로
            </Link>
          </div>
        ) : (
          <form noValidate onSubmit={submit} className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
            <div className="space-y-8">
              <section>
                <h2 className="text-lg font-medium text-ink">배송지</h2>
                <div className="mt-4 grid gap-4">
                  <Field label="받는 사람" id="name" error={errors.name} required>
                    <input
                      id="name"
                      name="name"
                      autoComplete="name"
                      value={form.name}
                      onChange={(event) => setField("name", event.target.value)}
                      className={inputClass(Boolean(errors.name))}
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? "name-error" : undefined}
                    />
                  </Field>
                  <Field label="휴대폰" id="phone" error={errors.phone} required hint="예: 010-1234-5678">
                    <input
                      id="phone"
                      name="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="010-1234-5678"
                      value={form.phone}
                      onChange={(event) => setField("phone", event.target.value)}
                      className={inputClass(Boolean(errors.phone))}
                      aria-invalid={Boolean(errors.phone)}
                      aria-describedby={errors.phone ? "phone-error" : undefined}
                    />
                  </Field>
                  <Field label="우편번호" id="zip" error={errors.zip} required>
                    <input
                      id="zip"
                      name="postal-code"
                      inputMode="numeric"
                      autoComplete="postal-code"
                      placeholder="00000"
                      value={form.zip}
                      onChange={(event) => setField("zip", event.target.value)}
                      className={inputClass(Boolean(errors.zip))}
                      aria-invalid={Boolean(errors.zip)}
                      aria-describedby={errors.zip ? "zip-error" : undefined}
                    />
                  </Field>
                  <Field label="주소" id="address" error={errors.address} required>
                    <input
                      id="address"
                      name="street-address"
                      autoComplete="street-address"
                      value={form.address}
                      onChange={(event) => setField("address", event.target.value)}
                      className={inputClass(Boolean(errors.address))}
                      aria-invalid={Boolean(errors.address)}
                      aria-describedby={errors.address ? "address-error" : undefined}
                    />
                  </Field>
                  <Field label="상세 주소" id="detail" error={errors.detail}>
                    <input
                      id="detail"
                      name="address-line2"
                      autoComplete="address-line2"
                      value={form.detail}
                      onChange={(event) => setField("detail", event.target.value)}
                      className={inputClass(Boolean(errors.detail))}
                      aria-invalid={Boolean(errors.detail)}
                      aria-describedby={errors.detail ? "detail-error" : undefined}
                    />
                  </Field>
                  <Field label="배송 요청" id="memo" error={errors.memo}>
                    <textarea
                      id="memo"
                      name="memo"
                      rows={3}
                      value={form.memo}
                      onChange={(event) => setField("memo", event.target.value)}
                      className={`${inputClass(Boolean(errors.memo))} py-3`}
                      aria-invalid={Boolean(errors.memo)}
                      aria-describedby={errors.memo ? "memo-error" : undefined}
                    />
                  </Field>
                </div>
              </section>

              <fieldset>
                <legend className="text-lg font-medium text-ink">결제 수단</legend>
                <div className="mt-4 grid gap-2">
                  {PAYMENTS.map((payment) => {
                    const selected = form.payment === payment.id;
                    return (
                      <label
                        key={payment.id}
                        className={
                          selected
                            ? "flex min-h-11 cursor-pointer items-start gap-3 rounded-2xl border border-ink bg-sand px-4 py-3"
                            : "flex min-h-11 cursor-pointer items-start gap-3 rounded-2xl border border-line px-4 py-3"
                        }
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={payment.id}
                          checked={selected}
                          onChange={() => setField("payment", payment.id)}
                          className="mt-1"
                        />
                        <span>
                          <span className="block text-sm font-medium text-ink">{payment.label}</span>
                          <span className="block text-xs text-muted">{payment.note}</span>
                        </span>
                      </label>
                    );
                  })}
                </div>
                {errors.payment ? (
                  <p id="payment-error" className="mt-2 text-sm text-coral-ink">
                    {errors.payment}
                  </p>
                ) : null}
              </fieldset>

              <section>
                <h2 className="text-lg font-medium text-ink">담은 상품</h2>
                <ul className="mt-3 divide-y divide-line border-y border-line">
                  {rows.map((row) => (
                    <li key={row.line.key} className="flex items-center justify-between gap-3 py-3 text-sm">
                      <span className="min-w-0">
                        <span className="block font-medium text-ink">{row.product.name}</span>
                        <span className="text-muted">
                          {row.colorName}
                          {row.line.size ? ` · ${row.line.size}` : ""} · {row.line.qty}개
                        </span>
                      </span>
                      <span className="shrink-0 tabular-nums">{formatKRW(row.sum)}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <div className="lg:sticky lg:top-36">
              <OrderSummary subtotal={subtotal} shipping={shipping} total={total} />
              <button type="submit" className={`${buttonClass.primary} mt-4 w-full`}>
                결제하기
              </button>
              <p className="mt-3 text-center text-xs text-muted">입력한 주소는 이 브라우저에만 주문 확인용으로 남습니다.</p>
            </div>
          </form>
        )}
      </Shell>
    </main>
  );
}

function inputClass(invalid: boolean) {
  return invalid
    ? "min-h-11 w-full rounded-2xl border border-coral-ink bg-paper px-4 text-sm text-ink outline-none"
    : "min-h-11 w-full rounded-2xl border border-line bg-paper px-4 text-sm text-ink outline-none focus:border-ink";
}

function Field({
  id,
  label,
  error,
  required,
  hint,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
        {required ? <span className="text-coral-ink"> *</span> : null}
      </label>
      {hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
      <div className="mt-2">{children}</div>
      {error ? (
        <p id={`${id}-error`} className="mt-1 text-sm text-coral-ink">
          {error}
        </p>
      ) : null}
    </div>
  );
}
