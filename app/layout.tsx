import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import "./globals.css";
import SocketProvider from "./components/providers/SocketProvider";
import { Toaster } from "@/components/ui/toaster";
import { appConfig } from "@/lib/env";

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
  display: "swap",
});

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
    <html lang="en" className={`${nunitoSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <script dangerouslySetInnerHTML={{ __html: hideNextDevToolsScript }} />
        <SocketProvider>{children}</SocketProvider>
        <Toaster />
      </body>
    </html>
  );
}
