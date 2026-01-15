"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/foods", label: "Search", icon: "🔍" },
  { href: "/meal-logs", label: "Add", icon: "+", isAdd: true },
  { href: "/community", label: "Community", icon: "👥" },
  { href: "/dashboard", label: "Profile", icon: "👤" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-emerald-100 bg-white md:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const active = pathname === item.href;
          if (item.isAdd) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg transition-transform hover:scale-110"
              >
                <span className="text-xl font-bold">{item.icon}</span>
              </Link>
            );
          }
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-1 ${
                active ? "text-emerald-600" : "text-emerald-400"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
