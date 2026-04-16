"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const links = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/stage1", label: "Workflow" },
  { href: "/pricing", label: "Pricing" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold text-teal-300">
            TestLift
          </Link>
          <nav className="flex items-center gap-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  "rounded-md px-3 py-2 text-sm",
                  pathname === link.href ? "bg-teal-500 text-slate-950" : "text-slate-300"
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/auth" className="rounded-md bg-slate-800 px-3 py-2 text-sm text-white">
              Sign In
            </Link>
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}
