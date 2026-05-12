"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const reviews = [
  {
    initials: "MK",
    name: "Marcus K.",
    role: "Designer · Berlin",
    color: "bg-[#6b62f2]",
    quote:
      '"Seeing the heatmap made me realise I smoke way more on weekends. That single insight helped me cut down 30% in just one month."',
  },
  {
    initials: "SR",
    name: "Sofia R.",
    role: "Product Manager · London",
    color: "bg-[#3fb950]",
    quote:
      '"The spending tracker was a genuine wake-up call. I was burning $180 a month without realising it. Now I track every single one."',
  },
  {
    initials: "JL",
    name: "James L.",
    role: "Engineer · Toronto",
    color: "bg-[#58a6ff]",
    quote:
      '"Clean UI, zero friction. I tried 3 other apps and gave up within a week. Smaky is the only one I\'ve stuck with for 4+ months."',
  },
  {
    initials: "AM",
    name: "Amir M.",
    role: "Nurse · Dubai",
    color: "bg-[#f78166]",
    quote:
      '"I work night shifts and always smoked more without noticing. The heatmap showed me exactly when, and I fixed it within two weeks."',
  },
  {
    initials: "LP",
    name: "Layla P.",
    role: "Teacher · Paris",
    color: "bg-[#e3b341]",
    quote:
      '"My partner and I both use it. Seeing each other\'s progress is incredibly motivating. Down from 18 to 9 per day in six weeks."',
  },
  {
    initials: "KN",
    name: "Kenji N.",
    role: "Data Analyst · Tokyo",
    color: "bg-[#8b949e]",
    quote:
      '"I\'m a data person, so the CSV export was the feature that sold me. Being able to run my own analysis on top is a huge bonus."',
  },
];

function StarRow() {
  return (
    <div className="flex gap-0.5" aria-label="5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="h-3.5 w-3.5 fill-[#6b62f2] text-[#6b62f2]" />
      ))}
    </div>
  );
}

export function Reviews() {
  return (
    <section
      id="reviews"
      className="py-24 px-4 sm:px-6 lg:px-8 scroll-mt-[88px]"
      aria-labelledby="reviews-heading"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="text-xs font-semibold uppercase tracking-widest text-[#6b62f2] mb-4"
          >
            Reviews
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            id="reviews-heading"
            className="font-heading text-3xl sm:text-4xl font-bold text-[#e5e5e5] tracking-tight mb-4"
          >
            Smokers who track, win
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-[#8b949e] text-base"
          >
            Real words from real users taking back control of their habits.
          </motion.p>
        </div>

        {/* Grid */}
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" role="list">
          {reviews.map((review, i) => (
            <motion.li
              key={review.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-2xl border border-[#21262d] bg-[#161b22] p-6 space-y-4 flex flex-col"
            >
              <StarRow />
              <p className="text-sm text-[#c2c2c2] leading-relaxed flex-1">{review.quote}</p>
              <div className="flex items-center gap-3 pt-1">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full ${review.color} text-xs font-bold text-white shrink-0`}
                  aria-hidden="true"
                >
                  {review.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#e5e5e5]">{review.name}</p>
                  <p className="text-xs text-[#8b949e]">{review.role}</p>
                </div>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
