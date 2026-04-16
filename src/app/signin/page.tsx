"use client";

import { useMemo, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function SignInPage() {
  const supabaseInit = useMemo(() => {
    try {
      return { client: createSupabaseBrowserClient(), error: null as string | null };
    } catch (error) {
      return {
        client: null,
        error: error instanceof Error ? error.message : "Supabase environment is not configured.",
      };
    }
  }, []);
  const supabase = supabaseInit.client;
  const supabaseError = supabaseInit.error;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleEmailSignIn() {
    if (!supabase) return;
    setMessage("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage(error.message);
      return;
    }
    window.location.href = "/workflow";
  }

  async function handleGithubSignIn() {
    if (!supabase) return;
    setMessage("");
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${appUrl}/auth/callback?next=/workflow`,
      },
    });
    if (error) setMessage(error.message);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--bg)] px-6 py-12 text-[var(--txt)]">
      <div className="w-full max-w-[380px] rounded-[14px] border border-[var(--border)] bg-[var(--bg2)] p-7 shadow-2xl shadow-black/20">
        <p className="text-sm font-medium text-[var(--accent)]">TestLift</p>
        <h2 className="mt-3 text-3xl font-extrabold">Welcome back</h2>
        <p className="mt-2 text-sm text-[var(--txt2)]">Sign in to your QA governance dashboard</p>
        {supabaseError && (
          <p className="mt-3 rounded bg-red-950/40 p-2 text-xs text-red-300">
            Auth is unavailable: {supabaseError}
          </p>
        )}

        <div className="mt-6">
          <button
            type="button"
            onClick={() => void handleGithubSignIn()}
            className="w-full rounded-[10px] border border-[var(--border2)] bg-transparent px-4 py-2.5 font-medium text-[var(--txt)] transition hover:border-[var(--accent)]"
          >
            Continue with GitHub
          </button>
        </div>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-[var(--border)]" />
          <span className="text-xs text-[var(--txt3)]">or</span>
          <div className="h-px flex-1 bg-[var(--border)]" />
        </div>

        <form
          className="space-y-4"
          autoComplete="off"
          onSubmit={(event) => {
            event.preventDefault();
            void handleEmailSignIn();
          }}
        >
          <input
            type="text"
            name="fake-username"
            autoComplete="username"
            tabIndex={-1}
            className="hidden"
            aria-hidden="true"
          />
          <input
            type="password"
            name="fake-password"
            autoComplete="new-password"
            tabIndex={-1}
            className="hidden"
            aria-hidden="true"
          />
          <div>
            <label className="mb-2 block text-sm text-[var(--txt2)]">Work email</label>
            <input
              required
              type="email"
              value={email}
              name="no-autofill-email"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck={false}
              onChange={(event) => setEmail(event.target.value)}
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
              value={password}
              name="no-autofill-password"
              autoComplete="new-password"
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-[10px] border border-[var(--border)] bg-[var(--bg4)] px-3 py-2 outline-none transition focus:border-[var(--accent)]"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-[10px] bg-[var(--accent)] px-4 py-2.5 font-semibold text-black transition hover:brightness-110"
          >
            Sign in →
          </button>
        </form>
        {message && <p className="mt-4 text-sm text-red-300">{message}</p>}
      </div>
    </main>
  );
}
