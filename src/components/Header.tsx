"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Home", href: "#/" },
  { label: "Markets", href: "#/markets" },
  { label: "Spot", href: "#/spot" },
  { label: "Contract", href: "#/contract" },
  { label: "Finance", href: "#/finance" },
  { label: "ICO", href: "#/ico" },
  { label: "Beginner Academy", href: "#/academy" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300",
        scrolled
          ? "bg-white shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo + Nav */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="text-[22px] font-bold text-[#0a0b0d] tracking-tight"
          >
            Klakna
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[14px] text-[#0a0b0d] hover:text-[#3772ff] transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="#/login"
            className="hidden sm:inline-flex text-[14px] text-[#0a0b0d] hover:text-[#3772ff] transition-colors duration-200 px-3 py-2"
          >
            Log In
          </Link>
          <Link
            href="#/register"
            className="hidden sm:inline-flex items-center justify-center bg-[#3772ff] text-white text-[14px] font-semibold rounded-lg px-5 py-2 hover:bg-[#2b5ce5] transition-colors duration-200"
          >
            Register
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#0a0b0d] hover:text-[#3772ff] transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-[#e7ebee] shadow-md">
          <nav className="max-w-[1200px] mx-auto px-6 py-4 flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[14px] text-[#0a0b0d] hover:text-[#3772ff] transition-colors duration-200 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex gap-3 pt-3 border-t border-[#e7ebee]">
              <Link
                href="#/login"
                className="flex-1 text-center text-[14px] text-[#0a0b0d] border border-[#e7ebee] rounded-lg px-4 py-2.5 hover:bg-[#f5f7fa] transition-colors"
              >
                Log In
              </Link>
              <Link
                href="#/register"
                className="flex-1 text-center bg-[#3772ff] text-white text-[14px] font-semibold rounded-lg px-4 py-2.5 hover:bg-[#2b5ce5] transition-colors"
              >
                Register
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
