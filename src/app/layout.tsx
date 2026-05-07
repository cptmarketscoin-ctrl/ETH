import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Klakna - Buy Bitcoin & Crypto | Crypto Exchange & App",
  description:
    "Buy BTC, ETH, XRP and more on leading cryptocurrency exchanges - Explore Web3, Invest, Manage and Lend. Sign up today and experience the future of finance.",
  keywords:
    "USA,Web3,Buy/Sell,crypto coin,Web3.0,uslarty,Ethereum,BTC,USDT,BNB,stock,contract,option",
  openGraph: {
    siteName: "Comprehensive cryptocurrency trading platform",
    type: "website",
    title: "Buy Bitcoin & Crypto | Crypto Exchange & App",
    description:
      "Buy BTC, ETH, XRP and more on leading cryptocurrency exchanges - Explore Web3, Invest, Manage and Lend. Sign up today and experience the future of finance.",
    images: [
      {
        url: "/logo.png",
        width: 1280,
        height: 720,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "Comprehensive cryptocurrency trading platform",
    title: "Buy Bitcoin & Crypto | Crypto Exchange & App",
    description:
      "Buy BTC, ETH, XRP and more on leading cryptocurrency exchanges - Explore Web3, Invest, Manage and Lend. Sign up today and experience the future of finance.",
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black",
    "apple-mobile-web-app-title": "Klakna",
    "mobile-web-app-capable": "yes",
    "format-detection": "telephone=no",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
