"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { cn } from "@/src/lib/utils";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-white/5 transition-colors lg:hidden"
        aria-label="Open navigation"
        aria-expanded={open}
      >
        <Menu className="h-5 w-5 text-ghost-white" />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 transition-transform duration-200 ease-in-out lg:hidden",
          open ? "translate-x-0" : "-translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation drawer"
      >
        <div className="relative h-full">
          <Sidebar />
          <button
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/5 transition-colors"
            aria-label="Close navigation"
          >
            <X className="h-4 w-4 text-ghost-white" />
          </button>
        </div>
      </div>
    </>
  );
}
