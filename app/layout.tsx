import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import "./globals.css";
import SocketProvider from "./components/providers/SocketProvider";

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kontrilab",
  description:
    "Mobile-first contribution evaluation for student group projects.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${nunitoSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <SocketProvider>{children}</SocketProvider>
      </body>
    </html>
  );
}
