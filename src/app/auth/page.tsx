"use client";

import { useMemo, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function AuthPage() {
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
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [message, setMessage] = useState("");

  async function handleAuth() {
    if (!supabase) return;
    setMessage("");
    const fn = mode === "login" ? supabase.auth.signInWithPassword : supabase.auth.signUp;
    const { error } = await fn({ email, password });
    if (error) setMessage(error.message);
    else window.location.href = "/dashboard";
  }

  async function oauth(provider: "google" | "github") {
    if (!supabase) return;
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    });
    if (error) setMessage(error.message);
  }

  return (
    <main className="mx-auto max-w-md px-6 py-14">
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        <h1 className="text-2xl font-semibold">Sign in to TestLift</h1>
        <p className="mt-2 text-sm text-slate-400">Use Google, GitHub, or email/password.</p>
        {supabaseError && (
          <p className="mt-3 rounded bg-rose-950/50 p-2 text-xs text-rose-300">
            Auth is unavailable: {supabaseError}
          </p>
        )}
        <div className="mt-5 grid gap-2">
          <button onClick={() => oauth("google")} className="rounded bg-slate-800 px-4 py-2">
            Continue with Google
          </button>
          <button onClick={() => oauth("github")} className="rounded bg-slate-800 px-4 py-2">
            Continue with GitHub
          </button>
        </div>
        <form
          className="mt-5 space-y-2"
          autoComplete="off"
          onSubmit={(e) => {
            e.preventDefault();
            void handleAuth();
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
          <input
            className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2"
            placeholder="Email"
            value={email}
            name="no-autofill-email"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2"
            type="password"
            placeholder="Password"
            value={password}
            name="no-autofill-password"
            autoComplete="new-password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="w-full rounded bg-teal-400 px-4 py-2 font-semibold text-slate-950">
            {mode === "login" ? "Login" : "Create account"}
          </button>
          <button
            type="button"
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="w-full text-sm text-teal-300"
          >
            {mode === "login" ? "Need an account? Sign up" : "Have an account? Log in"}
          </button>
        </form>
        {message && <p className="mt-3 text-sm text-rose-300">{message}</p>}
      </div>
    </main>
  );
}
