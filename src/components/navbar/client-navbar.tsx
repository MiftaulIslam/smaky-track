"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";
import { Button } from "../ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerTitle,
  DrawerDescription
} from "../ui/drawer";

const NavBarItems = [
  { title: "Overview", href: "/#overview" },
  { title: "Features", href: "/#features" },
  { title: "How it works", href: "/#how-it-works" },
  { title: "Compare", href: "/#compare" },
  { title: "Reviews", href: "/#reviews" },
  { title: "Pricing", href: "/#pricing" },
  { title: "FAQ", href: "/#faq" },
] as const;

function scrollToSectionFromHref(href: string): boolean {
  const hash = href.split("#")[1];
  if (!hash) return false;
  const el = document.getElementById(hash);
  if (!el) return false;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  window.history.replaceState(null, "", href);
  return true;
}

export function ClientNavBar({ isLoggedIn }: { isLoggedIn: boolean }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Stagger variants for mobile menu
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    show: {
      opacity: 1,
      x: 0,
      transition: { type: "spring" as const, stiffness: 300, damping: 24 },
    },
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 h-[72px] border-b border-border-subtle bg-background/70 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-full px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 w-auto md:w-48 z-50 relative group rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        >
          <div className="flex p-1.5 items-center justify-center rounded-xl bg-surface-hover border border-border-strong group-hover:border-primary/50 transition-colors">
            <span className="text-sm leading-none" role="img" aria-label="cigarette">
              🚬
            </span>
          </div>
          <span className="font-heading text-base font-semibold text-foreground tracking-tight">
            Smaky Track
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center justify-center gap-1 relative w-full">
          {NavBarItems.map((item, index) => (
            <Link
              key={item.title}
              href={item.href}
              scroll={false}
              onClick={(e) => {
                if (pathname === "/" && scrollToSectionFromHref(item.href)) {
                  e.preventDefault();
                }
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="relative px-4 py-2 text-sm text-foreground-subtle hover:text-foreground transition-colors rounded-full"
            >
              {hoveredIndex === index && (
                <motion.div
                  layoutId="navbar-hover"
                  className="absolute inset-0 bg-surface-hover rounded-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{item.title}</span>
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3 w-auto md:w-48 justify-end">
          {isLoggedIn ? (
            <Button asChild size="sm" variant="default">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Sign in</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/signup">Get started free</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Navigation Toggle */}
        <div className="md:hidden flex items-center">
          <Drawer open={isOpen} onOpenChange={setIsOpen} direction="right">
            <DrawerTrigger asChild>
              <button
                className="p-2 cursor-pointer text-foreground-subtle hover:text-foreground transition-colors relative z-50"
                aria-label="Toggle Menu"
              >
                <AnimatePresence mode="wait">
                  {isOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </DrawerTrigger>
            <DrawerContent direction="right" className="bg-background border-border-subtle p-6 flex flex-col h-full w-[80vw] max-w-sm rounded-none shadow-2xl">
              <DrawerTitle onClick={() => setIsOpen(false)} className="cursor-pointer w-8 h-8 flex justify-center items-center border-border-strong border bg-surface rounded-full hover:bg-surface-hover transition-colors">
                <ArrowRight className="w-4 h-4 text-foreground-subtle" />
              </DrawerTitle>
              <DrawerDescription className="sr-only">Access site navigation and account settings</DrawerDescription>
              <div className="mt-12 flex-1">
                <motion.div
                  className="flex flex-col gap-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                >
                  {NavBarItems.map((item) => (
                    <motion.div key={item.title} variants={itemVariants}>
                      <Link
                        href={item.href}
                        scroll={false}
                        onClick={(e) => {
                          if (pathname === "/" && scrollToSectionFromHref(item.href)) {
                            e.preventDefault();
                          }
                          setIsOpen(false);
                        }}
                        className="block text-2xl font-heading font-medium text-foreground-subtle hover:text-foreground transition-colors"
                      >
                        {item.title}
                      </Link>
                    </motion.div>
                  ))}

                  <motion.div variants={itemVariants} className="w-full h-px bg-border-subtle my-4" />

                  <motion.div variants={itemVariants} className="flex flex-col gap-4">
                    {isLoggedIn ? (
                      <Button asChild size="lg" className="w-full">
                        <Link href="/dashboard" onClick={() => setIsOpen(false)}>Dashboard</Link>
                      </Button>
                    ) : (
                      <>
                        <Button asChild variant="outline" size="lg" className="w-full">
                          <Link href="/login" onClick={() => setIsOpen(false)}>Sign in</Link>
                        </Button>
                        <Button asChild size="lg" className="w-full">
                          <Link href="/signup" onClick={() => setIsOpen(false)}>Get started free</Link>
                        </Button>
                      </>
                    )}
                  </motion.div>
                </motion.div>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </header>
  );
}
