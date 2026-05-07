import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-r from-[#3772ff] to-[#5b8fff] relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="relative max-w-[1200px] mx-auto px-6 text-center">
        <h2 className="text-[32px] lg:text-[40px] font-bold text-white leading-tight mb-6">
          Ready to start your
          <br />
          crypto journey?
        </h2>

        <p className="text-[16px] text-white/80 max-w-[480px] mx-auto mb-10">
          Join millions of traders on Klakna. Create your free account today
          and start trading with confidence.
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <a
            href="#/register"
            className="inline-flex items-center gap-2 bg-white text-[#3772ff] text-[16px] font-semibold rounded-xl px-8 py-3.5 hover:bg-white/90 transition-all duration-200 shadow-md"
          >
            Create Free Account
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="#/explore"
            className="inline-flex items-center justify-center text-white text-[16px] font-semibold rounded-xl px-8 py-3.5 border-2 border-white/30 hover:border-white/60 transition-all duration-200"
          >
            Explore Features
          </a>
        </div>
      </div>
    </section>
  );
}
