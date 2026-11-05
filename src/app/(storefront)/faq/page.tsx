"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle, Mail, MessageSquare } from "lucide-react";
import Link from "next/link";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQS: FAQItem[] = [
  {
    category: "Orders & Shipping",
    question: "What are your shipping rates and estimated delivery times?",
    answer: "We offer complimentary standard carbon-neutral shipping worldwide on orders above $150. For orders under $150, standard shipping is a flat rate of $15. Domestic shipments typically arrive within 3-5 business days. Large furniture pieces travel via our dedicated white-glove freight network and take 7-12 business days.",
  },
  {
    category: "Orders & Shipping",
    question: "Do you ship internationally?",
    answer: "Yes, we ship to over 65 countries worldwide including the UK, EU, Japan, Australia, and Canada with all duties and import taxes calculated transparently at checkout.",
  },
  {
    category: "Returns & Warranty",
    question: "What is your 30-Day Sanctuary Guarantee?",
    answer: "We believe an object must harmonize with your home. You have 30 days from delivery to evaluate your pieces. If you are not completely satisfied, we arrange complimentary pickup in original protective packaging for a full refund.",
  },
  {
    category: "Returns & Warranty",
    question: "What warranty covers your furniture and lighting?",
    answer: "All solid wood furniture carries our 10-year structural integrity guarantee covering joinery and wood movements. Lighting fixtures and electronics include a 3-year complete replacement warranty.",
  },
  {
    category: "Materials & Care",
    question: "How do I care for solid oak and walnut with natural oil finishes?",
    answer: "Dust regularly with a dry lint-free cloth. For spills, wipe immediately with a slightly damp cloth. We recommend applying our organic beeswax furniture balm once every 6 months to preserve the velvety natural matte sheen.",
  },
  {
    category: "Materials & Care",
    question: "Is your stoneware dishwasher and microwave safe?",
    answer: "Yes, our high-fired ceramic collections are vitrified at 1,280°C (cone 10), rendering them non-porous, microwave safe, and commercial dishwasher safe. Hand-washing is recommended for teaware with raw brass elements.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center space-y-3">
        <p className="text-xs font-semibold tracking-widest uppercase text-amber-700">
          Answers &amp; Assistance
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-light text-zinc-950">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 font-light max-w-md mx-auto">
          Everything you need to know about our craft, delivery schedules, return policies, and materials care.
        </p>
      </div>

      {/* Accordion List */}
      <div className="divide-y divide-zinc-200/80 border-y border-zinc-200/80">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={idx} className="py-5">
              <button
                onClick={() => toggle(idx)}
                className="w-full flex items-center justify-between text-left gap-4 group"
              >
                <span className="font-serif text-base sm:text-lg font-normal text-zinc-900 group-hover:text-amber-800 transition-colors">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-zinc-400 transition-transform duration-200 shrink-0 ${
                    isOpen ? "rotate-180 text-zinc-900" : ""
                  }`}
                />
              </button>
              {isOpen && (
                <div className="mt-3 text-xs sm:text-sm text-zinc-600 font-light leading-relaxed pr-8 animate-in fade-in-50">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Contact Concierge banner */}
      <div className="bg-zinc-50 rounded-2xl p-8 border border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        <div className="space-y-1">
          <h3 className="font-serif text-lg font-medium text-zinc-950">
            Have a question not addressed here?
          </h3>
          <p className="text-xs text-zinc-500">
            Our atelier concierge team responds within 4 business hours.
          </p>
        </div>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-zinc-800 transition-colors shrink-0"
        >
          <Mail className="w-3.5 h-3.5" /> Message Concierge
        </Link>
      </div>
    </div>
  );
}
