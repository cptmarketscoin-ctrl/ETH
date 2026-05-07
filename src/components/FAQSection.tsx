"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FAQItem } from "@/types";

const FAQ_ITEMS: FAQItem[] = [
  {
    question: "What is Klakna?",
    answer:
      "Klakna is a comprehensive cryptocurrency trading platform that allows users to buy, sell, and trade a wide range of digital assets including Bitcoin, Ethereum, and hundreds of other cryptocurrencies.",
  },
  {
    question: "How do I create an account?",
    answer:
      'Creating an account is simple. Click the "Register" button in the top right corner, enter your email address and password, verify your identity, and you can start trading within minutes.',
  },
  {
    question: "What payment methods are supported?",
    answer:
      "We support various payment methods including bank transfers, credit/debit cards, and cryptocurrency deposits. Available methods may vary depending on your region.",
  },
  {
    question: "Is my account secure?",
    answer:
      "Absolutely. Klakna uses bank-level encryption (AES-256), two-factor authentication (2FA), cold storage for the majority of funds, and regular security audits to protect your assets.",
  },
  {
    question: "What are the trading fees?",
    answer:
      "Klakna offers competitive trading fees starting from 0.1% per trade. VIP users enjoy even lower fees based on their 30-day trading volume. There are no hidden charges.",
  },
  {
    question: "How do I contact support?",
    answer:
      "Our support team is available 24/7 through live chat, email, and our help center. You can also reach us on social media for general inquiries.",
  },
];

function FAQAccordionItem({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-[#e7ebee]">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <span className="text-[16px] font-medium text-[#0a0b0d] pr-4 group-hover:text-[#3772ff] transition-colors duration-200">
          {item.question}
        </span>
        <ChevronDown
          className={cn(
            "w-5 h-5 text-[#848e9c] flex-shrink-0 transition-transform duration-300",
            isOpen && "rotate-180 text-[#3772ff]"
          )}
        />
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-300",
          isOpen ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <p className="pb-5 text-[14px] text-[#848e9c] leading-relaxed">
          {item.answer}
        </p>
      </div>
    </div>
  );
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-16 lg:py-20 bg-[#f5f7fa]">
      <div className="max-w-[800px] mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-[28px] font-medium text-[#0a0b0d] mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-[14px] text-[#848e9c]">
            Everything you need to know about trading on Klakna
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="bg-white rounded-2xl px-8 shadow-sm">
          {FAQ_ITEMS.map((item, idx) => (
            <FAQAccordionItem
              key={idx}
              item={item}
              isOpen={openIndex === idx}
              onToggle={() => setOpenIndex(openIndex === idx ? null : idx)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
