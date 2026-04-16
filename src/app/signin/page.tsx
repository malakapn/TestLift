"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignInPage() {
  const router = useRouter();
  const [toast, setToast] = useState<string | null>(null);

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setToast("Signed in successfully");
    setTimeout(() => router.push("/workflow"), 300);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--bg)] px-6 py-12 text-[var(--txt)]">
      <div className="w-full max-w-[380px] rounded-[14px] border border-[var(--border)] bg-[var(--bg2)] p-7 shadow-2xl shadow-black/20">
        <p className="text-sm font-medium text-[var(--accent)]">TestLift</p>
        <h2 className="mt-3 text-3xl font-extrabold">Welcome back</h2>
        <p className="mt-2 text-sm text-[var(--txt2)]">Sign in to your QA governance dashboard</p>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="mb-2 block text-sm text-[var(--txt2)]">Work email</label>
            <input
              required
              type="email"
              className="w-full rounded-[10px] border border-[var(--border)] bg-[var(--bg4)] px-3 py-2 outline-none transition focus:border-[var(--accent)]"
            />
          </div>
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="block text-sm text-[var(--txt2)]">Password</label>
              <button type="button" className="text-xs text-[var(--txt3)]">
                Forgot password?
              </button>
            </div>
            <input
              required
              type="password"
              className="w-full rounded-[10px] border border-[var(--border)] bg-[var(--bg4)] px-3 py-2 outline-none transition focus:border-[var(--accent)]"
            />
          </div>
          <button className="w-full rounded-[10px] bg-[var(--accent)] px-4 py-2.5 font-semibold text-black transition hover:brightness-110">
            Sign in →
          </button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-[var(--border)]" />
          <span className="text-xs text-[var(--txt3)]">or</span>
          <div className="h-px flex-1 bg-[var(--border)]" />
        </div>

        <button className="w-full rounded-[10px] border border-[var(--border2)] bg-transparent px-4 py-2.5 font-medium text-[var(--txt)] transition hover:border-[var(--accent)]">
          Continue with SSO
        </button>

        <p className="mt-6 text-center text-sm text-[var(--txt2)]">
          Don&apos;t have an account?{" "}
          <Link href="/workflow" className="text-[var(--accent)]">
            Get started free →
          </Link>
        </p>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 rounded-[10px] border border-[var(--border2)] bg-[var(--bg3)] px-4 py-3 text-sm text-[var(--txt)] shadow-lg transition">
          {toast}
        </div>
      )}
    </main>
  );
}
