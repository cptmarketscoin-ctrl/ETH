import { User, Settings, TrendingUp } from "lucide-react";
import type { FeatureCard } from "@/types";

const FEATURES: FeatureCard[] = [
  {
    icon: "user",
    title: "Create an account",
    description:
      "Sign up with your email address and verify your identity to start trading in minutes. Quick and secure onboarding process.",
  },
  {
    icon: "settings",
    title: "Account settings",
    description:
      "Customize your trading experience with advanced settings, security features, and personalized preferences.",
  },
  {
    icon: "chart",
    title: "Start trading",
    description:
      "Access 200+ trading pairs with professional tools, real-time charts, and lightning-fast execution at competitive fees.",
  },
];

function FeatureIcon({ icon }: { icon: string }) {
  const iconMap: Record<string, React.ReactNode> = {
    user: <User className="w-6 h-6" />,
    settings: <Settings className="w-6 h-6" />,
    chart: <TrendingUp className="w-6 h-6" />,
  };
  return (
    <div className="w-12 h-12 rounded-2xl bg-[#eef3ff] flex items-center justify-center text-[#3772ff]">
      {iconMap[icon] || null}
    </div>
  );
}

export function FeatureCards() {
  return (
    <section className="py-16 lg:py-20 bg-[#f5f7fa]">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-[28px] font-medium text-[#0a0b0d] mb-4">
            Start Your Crypto Journey in 3 Steps
          </h2>
          <p className="text-[14px] text-[#848e9c] max-w-[480px] mx-auto">
            Getting started is simple. Follow these easy steps to begin trading
            on Klakna.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {FEATURES.map((feature, idx) => (
            <div
              key={feature.title}
              className="relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300 group"
            >
              {/* Step Number */}
              <div className="absolute top-6 right-6 text-[48px] font-bold text-[#f0f2f5] leading-none select-none">
                0{idx + 1}
              </div>

              <FeatureIcon icon={feature.icon} />

              <h3 className="text-[18px] font-medium text-[#0a0b0d] mt-6 mb-3">
                {feature.title}
              </h3>

              <p className="text-[14px] text-[#848e9c] leading-relaxed">
                {feature.description}
              </p>

              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-8 right-8 h-0.5 bg-[#3772ff] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
