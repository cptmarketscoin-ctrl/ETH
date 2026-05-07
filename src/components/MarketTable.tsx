"use client";

import { TrendingUp, TrendingDown, Star } from "lucide-react";
import type { MarketItem, PriceDirection } from "@/types";

// Mock market data matching klakna.sbs style
const MOCK_MARKETS: MarketItem[] = [
  {
    name: "Bitcoin",
    symbol: "BTC",
    icon: "₿",
    price: 67234.5,
    change24h: 1234.5,
    changePercent: 1.87,
    volume24h: 28500000000,
    marketCap: 1320000000000,
    high24h: 67800,
    low24h: 65900,
  },
  {
    name: "Ethereum",
    symbol: "ETH",
    icon: "Ξ",
    price: 3456.78,
    change24h: -45.23,
    changePercent: -1.29,
    volume24h: 15200000000,
    marketCap: 415000000000,
    high24h: 3520,
    low24h: 3410,
  },
  {
    name: "XRP",
    symbol: "XRP",
    icon: "✕",
    price: 0.5234,
    change24h: 0.0123,
    changePercent: 2.41,
    volume24h: 3200000000,
    marketCap: 28700000000,
    high24h: 0.531,
    low24h: 0.508,
  },
  {
    name: "Dogecoin",
    symbol: "DOGE",
    icon: "Ð",
    price: 0.1523,
    change24h: -0.0034,
    changePercent: -2.18,
    volume24h: 1800000000,
    marketCap: 21800000000,
    high24h: 0.158,
    low24h: 0.149,
  },
  {
    name: "BNB",
    symbol: "BNB",
    icon: "◆",
    price: 598.45,
    change24h: 12.34,
    changePercent: 2.11,
    volume24h: 2100000000,
    marketCap: 92000000000,
    high24h: 605,
    low24h: 582,
  },
  {
    name: "Shiba Inu",
    symbol: "SHIB",
    icon: "🐕",
    price: 0.00002345,
    change24h: 0.00000123,
    changePercent: 5.54,
    volume24h: 890000000,
    marketCap: 13800000000,
    high24h: 0.000024,
    low24h: 0.000022,
  },
  {
    name: "Solana",
    symbol: "SOL",
    icon: "◎",
    price: 145.67,
    change24h: 8.23,
    changePercent: 5.98,
    volume24h: 4500000000,
    marketCap: 65000000000,
    high24h: 148,
    low24h: 136,
  },
  {
    name: "TRON",
    symbol: "TRX",
    icon: "⟁",
    price: 0.1234,
    change24h: 0.0023,
    changePercent: 1.9,
    volume24h: 560000000,
    marketCap: 10700000000,
    high24h: 0.125,
    low24h: 0.12,
  },
];

function formatPrice(price: number): string {
  if (price >= 1000) return price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (price >= 1) return price.toFixed(4);
  if (price >= 0.001) return price.toFixed(4);
  return price.toFixed(8);
}

function formatVolume(vol: number): string {
  if (vol >= 1e9) return `$${(vol / 1e9).toFixed(1)}B`;
  if (vol >= 1e6) return `$${(vol / 1e6).toFixed(1)}M`;
  return `$${vol.toLocaleString()}`;
}

function getDirection(change: number): PriceDirection {
  if (change > 0) return "up";
  if (change < 0) return "down";
  return "neutral";
}

export function MarketTable() {
  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-[28px] font-medium text-[#0a0b0d]">
            Popular Cryptocurrencies
          </h2>
          <a
            href="#/markets"
            className="text-[14px] text-[#3772ff] font-medium hover:underline"
          >
            View All Markets →
          </a>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e7ebee]">
                <th className="text-left text-[12px] font-medium text-[#848e9c] pb-4 w-8">#</th>
                <th className="text-left text-[12px] font-medium text-[#848e9c] pb-4">Name</th>
                <th className="text-right text-[12px] font-medium text-[#848e9c] pb-4">Price</th>
                <th className="text-right text-[12px] font-medium text-[#848e9c] pb-4">24h Change</th>
                <th className="text-right text-[12px] font-medium text-[#848e9c] pb-4 hidden sm:table-cell">24h Volume</th>
                <th className="text-right text-[12px] font-medium text-[#848e9c] pb-4 hidden md:table-cell">Market Cap</th>
                <th className="text-center text-[12px] font-medium text-[#848e9c] pb-4 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {MOCK_MARKETS.map((item, idx) => {
                const dir = getDirection(item.change24h);
                return (
                  <tr
                    key={item.symbol}
                    className="border-b border-[#f0f2f5] hover:bg-[#f8f9fb] transition-colors duration-150 cursor-pointer"
                  >
                    <td className="py-4 text-[14px] text-[#848e9c]">{idx + 1}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#f5f7fa] flex items-center justify-center text-[14px] font-bold text-[#3772ff]">
                          {item.icon}
                        </div>
                        <div>
                          <span className="text-[14px] font-medium text-[#0a0b0d]">
                            {item.name}
                          </span>
                          <span className="text-[12px] text-[#848e9c] ml-2">
                            {item.symbol}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-right text-[14px] font-medium text-[#0a0b0d]">
                      ${formatPrice(item.price)}
                    </td>
                    <td className="py-4 text-right">
                      <span
                        className={`inline-flex items-center gap-1 text-[14px] font-medium ${
                          dir === "up" ? "text-[#00b87a]" : dir === "down" ? "text-[#f6475d]" : "text-[#848e9c]"
                        }`}
                      >
                        {dir === "up" ? (
                          <TrendingUp className="w-3.5 h-3.5" />
                        ) : dir === "down" ? (
                          <TrendingDown className="w-3.5 h-3.5" />
                        ) : null}
                        {dir === "up" ? "+" : ""}
                        {item.changePercent.toFixed(2)}%
                      </span>
                    </td>
                    <td className="py-4 text-right text-[14px] text-[#0a0b0d] hidden sm:table-cell">
                      {formatVolume(item.volume24h)}
                    </td>
                    <td className="py-4 text-right text-[14px] text-[#0a0b0d] hidden md:table-cell">
                      {formatVolume(item.marketCap)}
                    </td>
                    <td className="py-4 text-center">
                      <button className="text-[#b1b5c3] hover:text-[#f6c542] transition-colors">
                        <Star className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
