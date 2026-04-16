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
        <Link
          href="/"
          className="text-inherit no-underline outline-none"
          style={{ textDecoration: "none", background: "none", border: "none", padding: 0, margin: 0 }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer",
              background: "none",
              border: "none",
              boxShadow: "none",
              borderRadius: 0,
              padding: 0,
              margin: 0,
            }}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="22" height="22" rx="5" fill="#4f8ff8" />
              <rect x="3" y="3" width="7" height="7" rx="1.5" fill="transparent" stroke="#4f8ff8" strokeWidth="1.2" />
              <rect x="12" y="3" width="7" height="7" rx="1.5" fill="transparent" stroke="#4f8ff8" strokeWidth="1.2" />
              <rect x="3" y="12" width="7" height="7" rx="1.5" fill="transparent" stroke="#4f8ff8" strokeWidth="1.2" />
              <rect x="12" y="12" width="7" height="7" rx="3.5" fill="transparent" stroke="#4f8ff8" strokeWidth="1.2" />
              <path
                d="M15.5 18 L15.5 14 M13.8 15.8 L15.5 14 L17.2 15.8"
                stroke="#ffffff"
                strokeWidth="1.1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span
              style={{
                fontWeight: 800,
                fontSize: "14px",
                color: "#ffffff",
                letterSpacing: "-0.3px",
                fontFamily: "Inter, sans-serif",
                background: "none",
                border: "none",
                padding: 0,
                margin: 0,
              }}
            >
              TestLift
            </span>
          </div>
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
