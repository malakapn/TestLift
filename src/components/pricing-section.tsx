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

export function PricingSection({ plans }: { plans: Plan[] }) {
  const [period, setPeriod] = useState<"monthly" | "annual">("monthly");

  return (
    <section className="mt-14">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Pricing</h2>
        <div className="inline-flex items-center rounded-lg border border-slate-700 p-1 text-sm">
          <button
            onClick={() => setPeriod("monthly")}
            className={`rounded-md px-3 py-1.5 ${period === "monthly" ? "bg-teal-400 text-slate-950" : ""}`}
          >
            Monthly
          </button>
          <button
            onClick={() => setPeriod("annual")}
            className={`rounded-md px-3 py-1.5 ${period === "annual" ? "bg-teal-400 text-slate-950" : ""}`}
          >
            Annual <span className="ml-1 rounded bg-emerald-600 px-1.5 py-0.5 text-xs">Save 17%</span>
          </button>
        </div>
      </div>

      <div className="mb-4 rounded-xl border border-teal-800 bg-slate-900/70 p-4">
        <h3 className="font-semibold text-teal-300">Free Tier</h3>
        <p className="text-sm text-slate-300">3 uploads lifetime, Python only, no credit card required.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((plan) => (
          <article key={plan.key} className="relative rounded-xl border border-slate-800 bg-slate-900 p-5">
            {plan.popular && (
              <span className="absolute -top-2 right-3 rounded-full bg-teal-400 px-3 py-1 text-xs font-semibold text-slate-950">
                Most Popular
              </span>
            )}
            <h3 className="text-xl font-semibold">{plan.name}</h3>
            <p className="mt-2 text-3xl font-bold">{period === "monthly" ? plan.monthly : plan.annual}</p>
            <p className="text-xs text-slate-400">{period === "monthly" ? "/month" : `${plan.annualLabel} /year`}</p>
            <ul className="mt-4 space-y-2 text-sm text-slate-300">
              {plan.features.map((feature) => (
                <li key={feature}>• {feature}</li>
              ))}
            </ul>
            <form action="/api/stripe/checkout" method="POST" className="mt-5">
              <input type="hidden" name="tier" value={plan.key} />
              <input type="hidden" name="period" value={period} />
              <button
                type="submit"
                className="w-full rounded-lg bg-[var(--accent)] px-4 py-2 font-semibold text-white transition hover:brightness-110"
              >
                Start Free Trial
              </button>
            </form>
          </article>
        ))}
      </div>
    </section>
  );
}
