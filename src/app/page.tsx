import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { MarketTable } from "@/components/MarketTable";
import { FeatureCards } from "@/components/FeatureCards";
import { PromoSection } from "@/components/PromoSection";
import { CTASection } from "@/components/CTASection";
import { FAQSection } from "@/components/FAQSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <MarketTable />
        <FeatureCards />
        <PromoSection />
        <CTASection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
}
