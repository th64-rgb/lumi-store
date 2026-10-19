import type { ReactNode } from "react";
import { Instagram, Youtube } from "lucide-react";
import { toast } from "sonner";
import { Shell } from "@/components/shell";

function SocialButton({ label, children }: { label: string; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={() => toast("데모 사이트에는 SNS가 연결되어 있지 않습니다")}
      className="inline-flex size-11 items-center justify-center rounded-full border border-line hover:bg-paper"
    >
      {children}
    </button>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-line bg-sand">
      <Shell className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-2xl text-ink">LUMI</p>
          <p className="mt-3 text-sm leading-6 text-muted">
            매일 손이 가는 머그, 텀블러, 에코백, 캔들, 노트만 모은 가상 라이프스타일 스토어입니다.
          </p>
        </div>
        <div className="text-sm leading-6">
          <p className="font-medium text-ink">고객센터</p>
          <p className="mt-3 text-muted">02-000-0000</p>
          <p className="text-muted">평일 10:00–17:00</p>
          <p className="text-muted">점심 12:00–13:00</p>
          <p className="text-muted">hello@example.com</p>
        </div>
        <div className="text-sm leading-6">
          <p className="font-medium text-ink">가상 회사 정보</p>
          <p className="mt-3 text-muted">(주)루미라이프</p>
          <p className="text-muted">대표 한루미</p>
          <p className="text-muted">서울특별시 가상구 루미로 12, 3층</p>
          <p className="text-muted">사업자등록번호 000-00-00000</p>
        </div>
        <div>
          <p className="text-sm font-medium text-ink">소셜</p>
          <div className="mt-3 flex gap-2">
            <SocialButton label="인스타그램, 데모">
              <Instagram className="size-4" aria-hidden="true" />
            </SocialButton>
            <SocialButton label="유튜브, 데모">
              <Youtube className="size-4" aria-hidden="true" />
            </SocialButton>
          </div>
          <p className="mt-4 text-xs leading-5 text-muted">아이콘은 연결되지 않습니다. 결제와 회원 정보도 없습니다.</p>
        </div>
      </Shell>
      <div className="border-t border-line">
        <Shell className="py-4 text-xs text-muted">© 2026 LUMI 스토어. 데모용 가상 쇼핑몰입니다.</Shell>
      </div>
    </footer>
  );
}
