"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/workflow", label: "Workflow" },
  { href: "/pricing", label: "Pricing" },
  { href: "/signin", label: "Signin" },
];

export function GlobalNav() {
  const pathname = usePathname();

  return (
    <header className="fixed left-0 right-0 top-0 z-40 border-b border-[var(--border)] bg-[var(--bg2)]/92 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="text-sm font-semibold tracking-wide text-[var(--txt)]">
          TestLift
        </Link>
        <nav className="flex items-center gap-2">
          {navItems.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-md px-3 py-1.5 text-sm transition ${
                  active
                    ? "border border-[var(--border2)] bg-[var(--bg3)] text-[var(--txt)]"
                    : "border border-transparent text-[var(--txt2)] hover:border-[var(--border)] hover:bg-[var(--bg3)] hover:text-[var(--txt)]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
