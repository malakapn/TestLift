"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import JSZip from "jszip";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function Stage5Page() {
  const router = useRouter();
  const [scripts, setScripts] = useState<any[]>([]);
  const [repo, setRepo] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const uploadId = localStorage.getItem("testliftUploadId");
    if (!uploadId) return;
    fetch(`/api/generate?uploadId=${uploadId}`)
      .then((r) => r.json())
      .then((payload) => setScripts(payload.scripts || []))
      .catch(() => setError("Failed to load scripts"));
  }, []);

  async function downloadZip() {
    const zip = new JSZip();
    scripts.forEach((script, index) => {
      const ext = script.language === "java" ? "java" : "py";
      zip.file(`test_${index + 1}.${ext}`, script.script_content);
    });
    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "testlift-scripts.zip";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function pushGithub() {
    const uploadId = localStorage.getItem("testliftUploadId");
    const res = await fetch("/api/push", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uploadId, repositoryUrl: repo }),
    });
    const payload = await res.json();
    if (!res.ok) return setError(payload.error?.message || "Push failed");
    router.push("/complete");
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Stage 5: Push</h1>
      {error && <p className="mt-3 text-rose-300">{error}</p>}
      <div className="mt-6 space-y-4">
        {scripts.map((script) => (
          <div key={script.id} className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
            <div className="border-b border-slate-800 px-4 py-2 text-sm text-slate-300">
              {script.language.toUpperCase()}
            </div>
            <SyntaxHighlighter language={script.language} style={oneDark}>
              {script.script_content}
            </SyntaxHighlighter>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-3 md:flex-row">
        <button onClick={downloadZip} className="rounded bg-slate-700 px-4 py-2 font-semibold">
          Download as ZIP
        </button>
        <input
          value={repo}
          onChange={(e) => setRepo(e.target.value)}
          placeholder="https://github.com/org/repo"
          className="flex-1 rounded border border-slate-700 bg-slate-900 px-3 py-2"
        />
        <button onClick={pushGithub} className="rounded bg-teal-400 px-4 py-2 font-semibold text-slate-950">
          Push to GitHub
        </button>
      </div>
    </main>
  );
}
