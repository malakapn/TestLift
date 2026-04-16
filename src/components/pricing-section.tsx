"use client";

import { useState } from "react";

type Plan = {
  key: string;
  name: string;
  monthly: string;
  annual: string;
  annualLabel: string;
  description: string;
  popular?: boolean;
  features: string[];
};

/** 17% annual discount display (per task spec). */
const ANNUAL_DISPLAY: Record<string, { perMo: string; billedYearly: string }> = {
  starter: { perMo: "$8.29", billedYearly: "$99.48" },
  pro: { perMo: "$16.59", billedYearly: "$199.08" },
  enterprise: { perMo: "$33.19", billedYearly: "$398.28" },
};

export function PricingSection({ plans }: { plans: Plan[] }) {
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");

  return (
    <section className="mt-14">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Pricing</h2>
        <div
          style={{
            background: "#1a1a2e",
            border: "1px solid #2a2a3e",
            borderRadius: "8px",
            padding: "4px",
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <button
            type="button"
            onClick={() => setBilling("monthly")}
            style={{
              borderRadius: "6px",
              fontWeight: billing === "monthly" ? 600 : 400,
              background: billing === "monthly" ? "#ffffff" : "transparent",
              color: billing === "monthly" ? "#000000" : "#a1a1aa",
              border: "none",
              padding: "6px 12px",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setBilling("annual")}
            style={{
              borderRadius: "6px",
              fontWeight: billing === "annual" ? 600 : 400,
              background: billing === "annual" ? "#ffffff" : "transparent",
              color: billing === "annual" ? "#000000" : "#a1a1aa",
              border: "none",
              padding: "6px 12px",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            Annual
          </button>
          <span
            style={{
              background: "#00c9a7",
              color: "#ffffff",
              fontSize: "11px",
              fontWeight: 600,
              padding: "2px 8px",
              borderRadius: "100px",
            }}
          >
            Save 17%
          </span>
        </div>
      </div>

      <div className="mb-4 rounded-xl border border-teal-800 bg-slate-900/70 p-4">
        <h3 className="font-semibold">
          <span className="inline-block rounded-md bg-[#ffffff] px-2 py-0.5 text-[#000000]">Free Tier</span>
        </h3>
        <p className="text-sm text-slate-300">3 uploads lifetime, Python only, no credit card required.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((plan) => {
          const annualInfo = ANNUAL_DISPLAY[plan.key];
          return (
            <article key={plan.key} className="relative rounded-xl border border-slate-800 bg-slate-900 p-5">
              {plan.popular && (
                <span className="absolute -top-2 right-3 rounded-full bg-[#ffffff] px-3 py-1 text-xs font-semibold text-[#000000]">
                  Most Popular
                </span>
              )}
              <h3 className="text-xl font-semibold">{plan.name}</h3>
              {billing === "monthly" ? (
                <>
                  <p className="mt-2 text-3xl font-bold">{plan.monthly}</p>
                  <p className="text-xs text-slate-400">/month</p>
                </>
              ) : (
                <>
                  <p className="mt-2 text-3xl font-bold">{annualInfo?.perMo ?? plan.monthly}</p>
                  <p className="text-xs text-slate-400">/month</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {`Billed annually as ${annualInfo?.billedYearly ?? plan.annual}/yr`}
                  </p>
                </>
              )}
              <ul className="mt-4 space-y-2 text-sm text-slate-300">
                {plan.features.map((feature) => (
                  <li key={feature}>• {feature}</li>
                ))}
              </ul>
              <form action="/api/stripe/checkout" method="POST" className="mt-5">
                <input type="hidden" name="tier" value={plan.key} />
                <input type="hidden" name="period" value={billing} />
                <button
                  type="submit"
                  className="w-full rounded-lg bg-[var(--accent)] px-4 py-2 font-semibold text-white transition hover:brightness-110"
                >
                  Start Free Trial
                </button>
              </form>
            </article>
          );
        })}
      </div>
    </section>
  );
}
