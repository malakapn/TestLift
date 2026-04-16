import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--txt)]">
      <section className="mx-auto max-w-7xl px-6 pb-20 pt-12 md:pb-24 md:pt-16">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg2)] p-8 md:p-14">
          <p className="mb-5 text-sm font-medium tracking-wide text-[var(--txt2)]">QA Governance Platform</p>
          <h1 className="max-w-5xl text-5xl font-extrabold leading-tight md:text-7xl">
            Stop broken test logic from reaching production
          </h1>
          <p className="mt-7 max-w-3xl text-lg leading-relaxed text-[var(--txt2)]">
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

        <section className="mt-10">
          <h2 className="text-2xl font-bold">Problem Overview</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              "Test suite instability from unchecked test logic changes",
              "No clear ownership for pre-execution test validation",
              "CI/CD pipeline failures triggered by bad automated tests",
              "QA governance complexity increases with scale",
            ].map((item) => (
              <article key={item} className="rounded-xl border border-[var(--border)] bg-[var(--bg2)] p-5">
                <p className="text-sm leading-relaxed text-[var(--txt2)]">{item}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-[var(--border)] bg-[var(--bg2)] p-6 md:p-8">
          <h2 className="text-2xl font-bold">Solution Overview</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-4">
            {[
              "Create / Import test case",
              "Review layer (multi-user approval)",
              "Approve / Reject / Modify",
              "CI/CD readiness gate",
            ].map((step, idx) => (
              <div key={step} className="rounded-xl border border-[var(--border)] bg-[var(--bg3)] p-4">
                <p className="text-xs uppercase tracking-wide text-[var(--txt3)]">Step {idx + 1}</p>
                <p className="mt-1 text-sm font-medium text-[var(--txt)]">{step}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg2)] p-6">
            <h2 className="text-2xl font-bold">Why TestLift</h2>
            <div className="mt-4 space-y-2 text-[var(--txt2)]">
              <p>TestLift is NOT just a QA automation tool.</p>
              <p>TestLift is NOT just a test generator.</p>
              <p>TestLift is NOT just a CI/CD plugin.</p>
            </div>
            <div className="mt-4 space-y-2 text-[var(--accent)]">
              <p>TestLift IS a QA governance layer.</p>
              <p>TestLift IS a control system for test reliability.</p>
              <p>TestLift IS a pre-execution validation system for automation pipelines.</p>
            </div>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg2)] p-6">
            <h2 className="text-2xl font-bold">Target Users</h2>
            <div className="mt-4 grid grid-cols-1 gap-2 text-sm text-[var(--txt2)] md:grid-cols-2">
              {[
                "QA Engineers",
                "SDET teams",
                "QA Leads",
                "Engineering Managers",
                "DevOps / Platform Engineers",
                "Enterprise software teams with CI/CD pipelines",
              ].map((user) => (
                <div key={user} className="rounded-md border border-[var(--border)] bg-[var(--bg3)] px-3 py-2">
                  {user}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-[var(--border)] bg-[var(--bg2)] p-8 text-center">
          <h2 className="text-3xl font-bold">Govern test quality before it reaches your pipeline</h2>
          <p className="mx-auto mt-3 max-w-2xl text-[var(--txt2)]">
            Replace fragile automation trust with a structured approval gate built for enterprise
            engineering teams.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
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
        </section>

        <div className="mt-10 text-sm text-[var(--txt3)]">© {new Date().getFullYear()} TestLift</div>
      </section>
    </main>
  );
}
