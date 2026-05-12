"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  History,
  BarChart3,
  Calendar,
  Wallet,
  Cigarette,
  Settings,
  User,
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { Logo } from "./Logo";
import { Separator } from "@/src/components/ui/separator";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Smoke History", href: "/history", icon: History },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Calendar View", href: "/calendar", icon: Calendar },
  { label: "Spending Reports", href: "/spending", icon: Wallet },
  { label: "Brand Statistics", href: "/brands", icon: Cigarette },
];

const bottomNavItems = [
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Profile", href: "/profile", icon: User },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  function isActive(href: string) {
    return pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
  }

  return (
    <aside
      className={cn(
        "flex flex-col h-full w-60 shrink-0 border-r border-border bg-background/80 backdrop-blur-[4px]",
        className
      )}
      aria-label="Main navigation"
    >
      <div className="flex items-center h-16 px-5 shrink-0">
        <Logo />
      </div>

      <Separator />

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5" aria-label="Navigation links">
        {navItems.map((item) => (
          <SidebarLink key={item.href} {...item} active={isActive(item.href)} />
        ))}
      </nav>

      <Separator />

      <div className="py-4 px-3 space-y-0.5">
        {bottomNavItems.map((item) => (
          <SidebarLink key={item.href} {...item} active={isActive(item.href)} />
        ))}
      </div>
    </aside>
  );
}

interface SidebarLinkProps {
  href: string;
  label: string;
  icon: React.ElementType;
  active: boolean;
}

function SidebarLink({ href, label, icon: Icon, active }: SidebarLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
        active
          ? "bg-surface-elevated text-foreground font-medium"
          : "text-foreground-subtle hover:bg-surface-hover hover:text-foreground"
      )}
      aria-current={active ? "page" : undefined}
    >
      <Icon className={cn("h-4 w-4 shrink-0", active ? "text-foreground" : "text-muted-foreground")} aria-hidden="true" />
      {label}
    </Link>
  );
}
