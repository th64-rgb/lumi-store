import type { ReactNode } from "react";
import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { NotFound } from "@/components/not-found";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "LUMI 스토어" },
      {
        name: "description",
        content: "머그, 텀블러, 에코백, 캔들, 노트를 파는 가상 쇼핑몰 LUMI 스토어. 실제 결제되지 않는 데모입니다.",
      },
      { name: "theme-color", content: "#FF6B5A" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,560;9..144,640&display=swap",
      },
      {
        rel: "stylesheet",
        href: "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootLayout,
  notFoundComponent: NotFound,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="ko" className="bg-paper text-ink antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen bg-paper font-sans text-ink">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootLayout() {
  return (
    <AuthProvider>
      <PreviewHostBridge />
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-paper focus:px-4 focus:py-2"
      >
        본문으로 건너뛰기
      </a>
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <div id="content" className="flex-1">
          <Outlet />
        </div>
        <SiteFooter />
      </div>
      <Toaster theme="light" position="top-center" />
    </AuthProvider>
  );
}
