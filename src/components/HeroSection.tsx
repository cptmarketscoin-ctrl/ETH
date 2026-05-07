"use client";

import { Search } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#eef3ff] via-[#f8faff] to-white pt-32 pb-20 lg:pt-40 lg:pb-28">
      {/* Decorative floating elements */}
      <div className="absolute top-20 left-[10%] w-16 h-16 bg-[#3772ff] rounded-2xl rotate-12 opacity-20 animate-float" />
      <div className="absolute top-40 right-[15%] w-12 h-12 bg-[#adff2f] rounded-full opacity-30 animate-float [animation-delay:1s]" />
      <div className="absolute bottom-20 left-[20%] w-10 h-10 bg-[#f6475d] rounded-xl rotate-45 opacity-15 animate-float [animation-delay:2s]" />
      <div className="absolute top-32 right-[25%] w-8 h-8 bg-[#9147ff] rounded-lg opacity-20 animate-float [animation-delay:0.5s]" />

      <div className="relative max-w-[1200px] mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-1.5 shadow-sm mb-8 animate-fade-in-down">
          <span className="w-2 h-2 bg-[#00b87a] rounded-full" />
          <span className="text-[12px] text-[#848e9c] font-medium">
            Trusted by 10M+ users worldwide
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-[48px] lg:text-[64px] font-bold text-[#0a0b0d] leading-tight tracking-tight mb-6 animate-fade-in-up">
          Trade like a
          <br />
          <span className="text-[#3772ff]">pro</span>
        </h1>

        {/* Subheadline */}
        <p className="text-[16px] lg:text-[18px] text-[#848e9c] max-w-[480px] mx-auto mb-10 leading-relaxed animate-fade-in-up [animation-delay:0.1s]">
          Complimentary Lorem Ipsum is simply dummy text of the printing and
          typesetting industry.{" "}
        </p>

        {/* Search Bar */}
        <div className="max-w-[520px] mx-auto mb-8 animate-fade-in-up [animation-delay:0.2s]">
          <div className="relative flex items-center bg-white rounded-2xl shadow-md border border-[#e7ebee] px-5 py-3.5">
            <Search className="w-5 h-5 text-[#848e9c] mr-3 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search coin name or paste contract address..."
              className="flex-1 text-[14px] text-[#0a0b0d] placeholder:text-[#b1b5c3] outline-none bg-transparent"
            />
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex items-center justify-center gap-3 flex-wrap animate-fade-in-up [animation-delay:0.3s]">
          {["BTC", "ETH", "XRP", "DOGE", "BNB", "SHIB", "SOL", "TRX"].map(
            (coin) => (
              <span
                key={coin}
                className="inline-flex items-center bg-white text-[13px] font-medium text-[#0a0b0d] rounded-full px-4 py-2 shadow-sm border border-[#f0f2f5] hover:border-[#3772ff] hover:text-[#3772ff] transition-colors duration-200 cursor-pointer"
              >
                {coin}
              </span>
            )
          )}
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center justify-center gap-4 mt-10 animate-fade-in-up [animation-delay:0.4s]">
          <a
            href="#/register"
            className="inline-flex items-center justify-center bg-[#3772ff] text-white text-[16px] font-semibold rounded-xl px-8 py-3.5 hover:bg-[#2b5ce5] transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Get Started
          </a>
          <a
            href="#/markets"
            className="inline-flex items-center justify-center bg-white text-[#0a0b0d] text-[16px] font-semibold rounded-xl px-8 py-3.5 border border-[#e7ebee] hover:border-[#3772ff] hover:text-[#3772ff] transition-all duration-200"
          >
            Explore Markets
          </a>
        </div>
      </div>
    </section>
  );
}
