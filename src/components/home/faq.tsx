"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Is Smaky Track really free?",
    answer:
      "Yes. The free tier has no time limit and no hidden costs. Unlimited logging and 7-day charts are yours forever. Pro is an optional upgrade for users who want the full year of history and advanced analytics.",
  },
  {
    question: "How is my data stored and protected?",
    answer:
      "Your data is encrypted at rest in a Postgres database and never shared with third parties. We use industry-standard TLS for all data in transit. You can export or delete your data at any time.",
  },
  {
    question: "Can I log multiple brands?",
    answer:
      "Yes. The free plan supports up to 3 brands, and Pro gives you unlimited brand tracking so you can switch between whatever you smoke without losing history.",
  },
  {
    question: "Is there a mobile app?",
    answer:
      "Smaky Track is a progressive web app — it works great on mobile browsers and can be added to your home screen. A native iOS and Android app is on the roadmap.",
  },
  {
    question: "Can I cancel Pro anytime?",
    answer:
      "Absolutely. Cancel from your account settings at any time. You keep Pro access until the end of your billing period, then automatically revert to the free tier — no data loss.",
  },
  {
    question: "Does logging help me actually quit?",
    answer:
      "Awareness is the first step to change. Users who track consistently report greater mindfulness and more successful reduction attempts. Smaky won't force habits — it shows you the truth so you can act on it.",
  },
];

function FaqItem({ item, index }: { item: (typeof faqs)[0]; index: number }) {
  const [open, setOpen] = useState(index === 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="border border-[#21262d] rounded-xl overflow-hidden"
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
        aria-expanded={open}
      >
        <span className="text-sm font-medium text-[#e5e5e5]">{item.question}</span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="shrink-0"
        >
          <ChevronDown className="h-4 w-4 text-[#8b949e]" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 text-sm text-[#8b949e] leading-relaxed">{item.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function Faq() {
  return (
    <section
      id="faq"
      className="py-24 px-4 sm:px-6 lg:px-8 scroll-mt-[88px]"
      aria-labelledby="faq-heading"
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="text-xs font-semibold uppercase tracking-widest text-[#6b62f2] mb-4"
          >
            FAQ
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            id="faq-heading"
            className="font-heading text-3xl sm:text-4xl font-bold text-[#e5e5e5] tracking-tight mb-4"
          >
            Common questions
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-[#8b949e] text-base"
          >
            Everything you might want to know before signing up.
          </motion.p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqs.map((item, i) => (
            <FaqItem key={item.question} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
