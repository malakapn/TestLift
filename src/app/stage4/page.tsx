"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Stage4Page() {
  const router = useRouter();
  const [language, setLanguage] = useState<"python" | "java">("python");
  const [cicdTarget, setCicdTarget] = useState<"github-actions" | "jenkins" | "gitlab-ci">(
    "github-actions"
  );
  const [error, setError] = useState("");

  async function generateScripts() {
    const uploadId = localStorage.getItem("testliftUploadId");
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uploadId, language, framework: "selenium", cicdTarget }),
    });
    const payload = await res.json();
    if (!res.ok) return setError(payload.error?.message || "Generate failed");
    router.push("/stage5");
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-3xl font-bold">Stage 4: Configure</h1>
      <div className="mt-6 space-y-4 rounded-xl border border-slate-800 bg-slate-900 p-6">
        <label className="block">
          <span className="text-sm text-slate-300">Output language</span>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as "python" | "java")}
            className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2"
          >
            <option value="python">Python</option>
            <option value="java">Java</option>
          </select>
        </label>

        <label className="block">
          <span className="text-sm text-slate-300">Framework</span>
          <input value="Selenium WebDriver" readOnly className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" />
        </label>

        <label className="block">
          <span className="text-sm text-slate-300">CI/CD target</span>
          <select
            value={cicdTarget}
            onChange={(e) => setCicdTarget(e.target.value as any)}
            className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2"
          >
            <option value="github-actions">GitHub Actions</option>
            <option value="jenkins">Jenkins</option>
            <option value="gitlab-ci">GitLab CI</option>
          </select>
        </label>
        <button onClick={generateScripts} className="rounded bg-teal-400 px-4 py-2 font-semibold text-slate-950">
          Generate Scripts
        </button>
        {error && <p className="text-sm text-rose-300">{error}</p>}
      </div>
    </main>
  );
}
