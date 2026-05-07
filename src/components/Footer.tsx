import Link from "next/link";
import type { FooterLinkGroup } from "@/types";

const FOOTER_LINKS: FooterLinkGroup[] = [
  {
    title: "About",
    links: [
      { label: "About Us", href: "#/about" },
      { label: "Careers", href: "#/careers" },
      { label: "Blog", href: "#/blog" },
      { label: "Press", href: "#/press" },
    ],
  },
  {
    title: "Products",
    links: [
      { label: "Exchange", href: "#/exchange" },
      { label: "Spot Trading", href: "#/spot" },
      { label: "Futures", href: "#/futures" },
      { label: "NFT Marketplace", href: "#/nft" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "API", href: "#/api" },
      { label: "Institutional", href: "#/institutional" },
      { label: "Affiliate", href: "#/affiliate" },
      { label: "Referral", href: "#/referral" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", href: "#/help" },
      { label: "Contact Us", href: "#/contact" },
      { label: "Submit a Request", href: "#/request" },
      { label: "System Status", href: "#/status" },
    ],
  },
];

const SOCIAL_LINKS = [
  { name: "Twitter", href: "https://twitter.com" },
  { name: "Telegram", href: "https://t.me" },
  { name: "Discord", href: "https://discord.gg" },
  { name: "Reddit", href: "https://reddit.com" },
  { name: "GitHub", href: "https://github.com" },
];

export function Footer() {
  return (
    <footer className="bg-[#0c0c0f] text-[#b1b5c3]">
      <div className="max-w-[1200px] mx-auto px-6 pt-16 pb-8">
        {/* Top Section */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <Link
              href="/"
              className="text-[22px] font-bold text-white tracking-tight"
            >
              Klakna
            </Link>
            <p className="text-[12px] text-[#848e9c] mt-3 leading-relaxed max-w-[200px]">
              The next generation cryptocurrency trading platform. Buy, sell
              and trade with confidence.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 mt-6">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-[#1e2025] flex items-center justify-center text-[#848e9c] hover:text-white hover:bg-[#3772ff] transition-all duration-200"
                  aria-label={s.name}
                >
                  <span className="text-[11px] font-bold">
                    {s.name[0]}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {FOOTER_LINKS.map((group) => (
            <div key={group.title}>
              <h4 className="text-[14px] font-medium text-white mb-4">
                {group.title}
              </h4>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-[#848e9c] hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-[#2c2e36] pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[12px] text-[#848e9c]">
              © {new Date().getFullYear()} Klakna. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link
                href="#/privacy"
                className="text-[12px] text-[#848e9c] hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="#/terms"
                className="text-[12px] text-[#848e9c] hover:text-white transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="#/cookies"
                className="text-[12px] text-[#848e9c] hover:text-white transition-colors"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
