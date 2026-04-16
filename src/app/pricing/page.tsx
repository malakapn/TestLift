import { PricingSection } from "@/components/pricing-section";
import { plans } from "@/lib/pricing";

export default function PricingPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-4xl font-bold">Choose your TestLift plan</h1>
      <p className="mt-3 text-slate-300">
        Start with free usage, then upgrade for higher limits and deployment integrations.
      </p>
      <PricingSection plans={plans as any} />
    </main>
  );
}
