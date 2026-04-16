import Link from "next/link";
import { plans } from "@/lib/pricing";
import { PricingSection } from "@/components/pricing-section";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <section className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-10">
        <p className="mb-3 text-sm text-teal-300">AI-powered test automation</p>
        <h1 className="max-w-3xl text-4xl font-bold leading-tight md:text-5xl">
          Turn Manual Test Cases into Automated Scripts in Minutes
        </h1>
        <p className="mt-4 max-w-2xl text-slate-300">
          Upload your Excel test cases, AI parses and translates them to Selenium — ready for
          CI/CD.
        </p>
        <div className="mt-8 flex gap-3">
          <Link href="/auth" className="rounded-lg bg-teal-400 px-5 py-3 font-semibold text-slate-950">
            Get Started Free
          </Link>
          <Link href="/pricing" className="rounded-lg border border-slate-700 px-5 py-3 font-semibold">
            View pricing
          </Link>
        </div>
      </section>

      <section className="mt-12 grid gap-4 md:grid-cols-3">
        {[
          ["Upload", "Drop .xlsx/.csv test files into secure storage."],
          ["AI Parse", "Claude extracts steps, expected results, and priorities."],
          ["Generate Scripts", "Produce Selenium Python/Java code for CI pipelines."],
        ].map(([title, text]) => (
          <article key={title} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
            <h3 className="text-lg font-semibold text-teal-300">{title}</h3>
            <p className="mt-2 text-sm text-slate-300">{text}</p>
          </article>
        ))}
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold">How it works</h2>
        <ol className="mt-4 grid gap-3 md:grid-cols-3">
          {["Upload", "Process", "Review", "Configure", "Push", "Complete"].map((step, index) => (
            <li key={step} className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">Step {index + 1}</p>
              <p className="mt-1 font-semibold">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      <PricingSection plans={plans as any} />

      <footer className="mt-16 border-t border-slate-800 py-8 text-sm text-slate-400">
        © {new Date().getFullYear()} TestLift · testlift.dev
      </footer>
    </main>
  );
}
