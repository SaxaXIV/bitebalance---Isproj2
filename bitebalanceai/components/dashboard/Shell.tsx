"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/meal-logs", label: "Food Log", icon: "🍽️" },
  { href: "/foods", label: "Food Database", icon: "📚" },
  { href: "/meal-planner", label: "Meal Plan", icon: "📅" },
  { href: "/community", label: "Community", icon: "👥" },
  { href: "/challenges", label: "Challenges", icon: "🏆" },
  { href: "/subscriptions", label: "Subscription", icon: "💳" },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <div className="flex min-h-screen bg-emerald-50">
      {/* Left Sidebar */}
      <aside className="hidden w-64 border-r border-emerald-100 bg-white px-4 py-6 text-sm md:flex md:flex-col">
        <div className="mb-8 text-xl font-bold text-emerald-700">Bite Balance</div>
        
        <div className="mb-4 text-xs font-semibold uppercase tracking-wider text-emerald-600">
          MAIN MENU
        </div>
        
        <nav className="space-y-1 flex-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                  active
                    ? "bg-emerald-100 text-emerald-900 font-semibold"
                    : "text-emerald-700 hover:bg-emerald-50"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile at Bottom */}
        <div className="mt-auto border-t border-emerald-100 pt-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-emerald-200 flex items-center justify-center text-xs font-semibold text-emerald-700">
              {session?.user?.name?.[0]?.toUpperCase() || session?.user?.email?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-emerald-900 truncate">
                {session?.user?.name || session?.user?.email || "User"}
              </div>
              <div className="text-xs text-emerald-600">Free Plan</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="sticky top-0 z-10 border-b border-emerald-100 bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-emerald-900 capitalize">
              {navItems.find((item) => item.href === pathname)?.label || "Dashboard"}
            </h1>
            <div className="flex items-center gap-4">
              <Link
                href="/subscriptions"
                className="rounded-lg border border-emerald-300 bg-white px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
              >
                Subscription
              </Link>
              <button className="relative">
                <span className="text-xl">🔔</span>
                <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 border-2 border-white"></span>
              </button>
              <div className="h-8 w-8 rounded-full bg-emerald-200 flex items-center justify-center text-xs font-semibold text-emerald-700">
                {session?.user?.name?.[0]?.toUpperCase() || session?.user?.email?.[0]?.toUpperCase() || "U"}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-emerald-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
