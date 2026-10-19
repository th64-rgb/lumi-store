import { Link } from "@tanstack/react-router";
import { buttonClass } from "@/components/shell";

export function NotFound() {
  return (
    <main className="mx-auto flex min-h-[50vh] w-full max-w-lg flex-col items-center justify-center px-4 py-24 text-center">
      <p className="font-display text-5xl text-ink">404</p>
      <h1 className="mt-3 text-lg font-medium text-ink">페이지를 찾을 수 없습니다</h1>
      <p className="mt-2 text-sm text-muted">주소가 바뀌었거나, 없는 상품입니다.</p>
      <Link to="/" className={`${buttonClass.primary} mt-6`}>
        홈으로 가기
      </Link>
    </main>
  );
}
