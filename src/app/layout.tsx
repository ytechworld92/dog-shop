import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "わん・ダフル | 犬服・ドッグウェア通販",
    template: "%s | わん・ダフル",
  },
  description:
    "愛犬をもっとおしゃれに。Tシャツ、パーカー、レインコート、コスプレなど犬服を豊富に取り揃え。5,000円以上で送料無料。",
  keywords: [
    "犬服",
    "ドッグウェア",
    "dog clothes",
    "반려견 의류",
    "ペット服",
  ],
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "わん・ダフル",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={`${geistSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
