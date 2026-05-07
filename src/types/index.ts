// ========================================
// Klakna - TypeScript Type Definitions
// ========================================

/** Crypto market data */
export interface MarketItem {
  name: string;
  symbol: string;
  icon: string;
  price: number;
  change24h: number;
  changePercent: number;
  volume24h: number;
  marketCap: number;
  high24h: number;
  low24h: number;
}

/** Navigation link */
export interface NavLink {
  label: string;
  href: string;
  children?: NavLink[];
}

/** FAQ item */
export interface FAQItem {
  question: string;
  answer: string;
}

/** Feature card data */
export interface FeatureCard {
  icon: string;
  title: string;
  description: string;
}

/** Hero section data */
export interface HeroData {
  headline: string;
  subheadline: string;
  searchPlaceholder: string;
  ctaText: string;
  ctaLink: string;
}

/** CTA section data */
export interface CTAData {
  headline: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

/** Footer link group */
export interface FooterLinkGroup {
  title: string;
  links: { label: string; href: string }[];
}

/** Social link */
export interface SocialLink {
  name: string;
  href: string;
  icon: string;
}

/** Price change indicator */
export type PriceDirection = "up" | "down" | "neutral";

/** Theme mode */
export type ThemeMode = "light" | "dark";
