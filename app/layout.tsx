import type { Metadata } from "next";
import type { CSSProperties } from "react";
import "./globals.css";
import SocketProvider from "./components/providers/SocketProvider";
import { Toaster } from "@/components/ui/toaster";
import { appConfig } from "@/lib/env";

const hideNextDevToolsScript = `
(() => {
  const hide = () => {
    document.querySelectorAll("nextjs-portal").forEach((element) => {
      element.style.setProperty("display", "none", "important");
      element.style.setProperty("visibility", "hidden", "important");
      element.style.setProperty("pointer-events", "none", "important");
    });
  };
  hide();
  new MutationObserver(hide).observe(document.documentElement, { childList: true, subtree: true });
})();
`;

export const metadata: Metadata = {
  title: appConfig.name,
  description: `Mobile-first contribution evaluation for student group projects in ${appConfig.name}.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
      style={
        {
          "--font-nunito-sans": 'Nunito Sans, system-ui, sans-serif',
          "--font-inter": 'Inter, system-ui, sans-serif',
        } as CSSProperties
      }
    >
      <body className="flex min-h-full flex-col">
        <script dangerouslySetInnerHTML={{ __html: hideNextDevToolsScript }} />
        <SocketProvider>{children}</SocketProvider>
        <Toaster />
      </body>
    </html>
  );
}
