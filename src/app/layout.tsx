import type { Metadata } from "next";
import { Noto_Serif_JP, Playfair_Display } from "next/font/google";
import HeaderNav from "@/components/HeaderNav";
import "./globals.css";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["600", "700"] });
const notoSerifJp = Noto_Serif_JP({ subsets: ["latin"], weight: ["400", "500", "700"] });

export const metadata: Metadata = {
  title: "Modern EC Portfolio",
  description: "暖色とコーヒー感を意識したモダンなECサイトのデモ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${playfair.className} ${notoSerifJp.className}`}>
        <HeaderNav />
        {children}
      </body>
    </html>
  );
}
