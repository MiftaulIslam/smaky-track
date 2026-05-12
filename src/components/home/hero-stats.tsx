"use client";

import { motion } from "framer-motion";
import Autoplay from "embla-carousel-autoplay";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/src/components/ui/carousel";

const stats = [
    { value: "12k+", label: "Active users" },
    { value: "2.4M", label: "Logs recorded" },
    { value: "$180k", label: "Spending tracked" },
    { value: "−31%", label: "Avg. reduction" },

    { value: "98.7%", label: "Uptime reliability" },
    { value: "4.9/5", label: "User satisfaction" },
    { value: "1.2s", label: "Avg. response time" },
    { value: "45+", label: "Countries supported" },
    { value: "320k+", label: "Sessions analyzed" },
    { value: "8.3M", label: "Events processed" },
    { value: "−52%", label: "Cost optimization" },
    { value: "24/7", label: "Monitoring coverage" },
];

export function HeroStatsCarousel() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mt-16 w-full"
        >
            <Carousel
                opts={{
                    align: "start",
                    loop: true,
                }}
                plugins={[
                    Autoplay({
                        delay: 2500, // change speed here
                        stopOnInteraction: false, // keeps autoplay after user swipe
                    }),
                ]}
                className="w-full"
            >
                <CarouselContent className="cursor-pointer">
                    {stats.map((stat) => (
                        <CarouselItem
                            key={stat.label}
                            className="pl-2 basis-[85%] sm:basis-1/2 lg:basis-1/4"
                        >
                            <div className={"group relative overflow-hidden rounded-md border border-border-subtle bg-surface-glass px-6 py-7 backdrop-blur-xl transition-all duration-300 hover:border-border hover:bg-surface-hover"}>
                                <div
                                    aria-hidden="true"
                                    className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                                    style={{
                                        background:
                                            "radial-gradient(circle at top, var(--color-primary-soft), transparent 70%)",
                                    }}
                                />

                                <div className="relative z-10">
                                    <div className="text-3xl font-black tracking-tight text-foreground">
                                        {stat.value}
                                    </div>
                                    <div className="mt-2 text-sm text-foreground-subtle">
                                        {stat.label}
                                    </div>
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
        </motion.div>
    );
}