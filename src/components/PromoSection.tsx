"use client";

import { ArrowRight, Smartphone, Shield, Zap, Globe } from "lucide-react";

const PROMO_FEATURES = [
  {
    icon: <Shield className="w-5 h-5" />,
    title: "Secure",
    desc: "Bank-level encryption",
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: "Fast",
    desc: "Lightning execution",
  },
  {
    icon: <Globe className="w-5 h-5" />,
    title: "Global",
    desc: "200+ countries",
  },
];

export function PromoSection() {
  return (
    <section className="py-16 lg:py-24 bg-white overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text Content */}
          <div>
            <div className="inline-flex items-center gap-2 bg-[#eef3ff] rounded-full px-4 py-1.5 mb-6">
              <span className="text-[12px] font-medium text-[#3772ff]">
                Mobile App
              </span>
            </div>

            <h2 className="text-[32px] lg:text-[40px] font-bold text-[#0a0b0d] leading-tight mb-6">
              Trade Anytime,
              <br />
              Anywhere
            </h2>

            <p className="text-[16px] text-[#848e9c] leading-relaxed mb-8 max-w-[420px]">
              Download the Klakna app and manage your portfolio on the go.
              Available on iOS and Android with all the features you need.
            </p>

            {/* Feature List */}
            <div className="grid grid-cols-3 gap-4 mb-10">
              {PROMO_FEATURES.map((f) => (
                <div key={f.title} className="text-center">
                  <div className="w-12 h-12 rounded-2xl bg-[#f5f7fa] flex items-center justify-center text-[#3772ff] mx-auto mb-3">
                    {f.icon}
                  </div>
                  <div className="text-[14px] font-medium text-[#0a0b0d]">
                    {f.title}
                  </div>
                  <div className="text-[12px] text-[#848e9c]">{f.desc}</div>
                </div>
              ))}
            </div>

            <a
              href="#/download"
              className="inline-flex items-center gap-2 text-[14px] font-semibold text-[#3772ff] hover:gap-3 transition-all duration-200"
            >
              Download Now <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Right: Phone Mockup */}
          <div className="relative flex justify-center">
            {/* Phone Frame */}
            <div className="relative w-[280px] h-[560px] bg-[#0a0b0d] rounded-[40px] p-3 shadow-2xl">
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[28px] bg-[#0a0b0d] rounded-b-[16px] z-10" />

              {/* Screen */}
              <div className="w-full h-full bg-gradient-to-b from-[#1e2025] to-[#0c0c0f] rounded-[32px] overflow-hidden flex flex-col items-center justify-center p-6">
                <Smartphone className="w-16 h-16 text-[#3772ff] mb-4" />
                <div className="text-[20px] font-bold text-white mb-2">
                  Klakna
                </div>
                <div className="text-[12px] text-[#848e9c] mb-8">
                  Crypto Trading
                </div>

                {/* Mock chart bars */}
                <div className="flex items-end gap-1.5 h-[120px] w-full px-4">
                  {[40, 55, 35, 70, 60, 85, 50, 90, 65, 75, 95, 70, 80, 60, 88, 72, 92, 78, 85, 95].map(
                    (h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-sm transition-all duration-500"
                        style={{
                          height: `${h}%`,
                          background:
                            i >= 15
                              ? "#00b87a"
                              : i >= 10
                              ? "#3772ff"
                              : "#2c2e36",
                          animationDelay: `${i * 50}ms`,
                        }}
                      />
                    )
                  )}
                </div>

                {/* Mock price */}
                <div className="mt-6 text-center">
                  <div className="text-[24px] font-bold text-white">
                    $67,234.50
                  </div>
                  <div className="text-[14px] text-[#00b87a] font-medium">
                    +1.87%
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#adff2f] rounded-full opacity-10 blur-2xl" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-[#3772ff] rounded-full opacity-10 blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
