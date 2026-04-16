import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--txt)]">
      <section className="mx-auto max-w-7xl px-6 pb-20 pt-10 md:pb-24 md:pt-14">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg2)] p-8 md:p-12">
          <p className="mb-4 text-sm font-medium tracking-wide text-[var(--txt2)]">QA Governance Platform</p>
          <h1 className="max-w-4xl text-4xl font-extrabold leading-tight md:text-6xl">
            Stop broken test logic from reaching production
          </h1>
          <p className="mt-6 max-w-3xl text-lg text-[var(--txt2)]">
            TestLift is a QA governance layer that ensures only validated test cases enter CI/CD
            pipelines through structured multi-user approvals.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/workflow"
              className="rounded-lg bg-[var(--accent)] px-6 py-3 font-semibold text-black transition hover:brightness-110"
            >
              Get Started for Free
            </Link>
            <Link
              href="/signin"
              className="rounded-lg border border-[var(--border2)] bg-[var(--bg3)] px-6 py-3 font-semibold text-[var(--txt)] transition hover:border-[var(--accent)]"
            >
              Sign Up
            </Link>
          </div>
        </div>

        <section className="mt-12 rounded-2xl border border-[var(--border)] bg-[var(--bg2)] p-6 md:p-8">
          <h2 className="text-2xl font-bold">Pipeline Reliability Flow</h2>
          <div className="mt-6 grid gap-3 md:grid-cols-5">
            {["Author", "Structured", "Review", "Approval Gate", "CI/CD Ready"].map((step) => (
              <div
                key={step}
                className={`rounded-xl border p-4 text-center transition ${
                  step === "Review"
                    ? "border-[var(--warn)] bg-[rgba(245,158,11,0.12)] text-[var(--warn)]"
                    : "border-[var(--border)] bg-[var(--bg3)] text-[var(--txt2)]"
                }`}
              >
                <p className="font-medium">{step}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg2)] p-6">
            <h3 className="text-xl font-bold">Without governance</h3>
            <ul className="mt-4 space-y-3 text-[var(--txt2)]">
              <li>✕ No approval gate = flaky pipelines</li>
              <li>✕ No ownership = low trust</li>
            </ul>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg2)] p-6">
            <h3 className="text-xl font-bold text-[var(--accent)]">With TestLift governance</h3>
            <ul className="mt-4 space-y-3 text-[var(--txt2)]">
              <li>✓ Multi-user test logic approvals before merge</li>
              <li>✓ Pipeline gates enforce reviewed logic only</li>
            </ul>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            "Multi-user approval workflows",
            "Pipeline gate enforcement",
            "Real-time approval tracking",
            "Role-based access control",
          ].map((feature) => (
            <article
              key={feature}
              className="rounded-xl border border-[var(--border)] bg-[var(--bg2)] p-5 text-[var(--txt2)]"
            >
              <h4 className="text-lg font-semibold text-[var(--txt)]">{feature}</h4>
            </article>
          ))}
        </section>

        <section className="mt-8 grid gap-4 rounded-xl border border-[var(--border)] bg-[var(--bg2)] p-6 md:grid-cols-4">
          {[
            ["99%", "pipeline gate accuracy"],
            ["3x", "fewer flaky builds"],
            ["~0", "unchecked test merges"],
            ["Full", "audit trail retention"],
          ].map(([value, label]) => (
            <div key={label} className="rounded-lg border border-[var(--border)] bg-[var(--bg3)] p-4">
              <p className="text-3xl font-extrabold text-[var(--accent)]">{value}</p>
              <p className="mt-1 text-sm text-[var(--txt2)]">{label}</p>
            </div>
          ))}
        </section>

        <div className="mt-10 text-sm text-[var(--txt3)]">© {new Date().getFullYear()} TestLift</div>
      </section>
    </main>
  );
}
