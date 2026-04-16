"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Stage1Page() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleUpload() {
    if (!file) return;
    setBusy(true);
    setError("");
    setProgress(20);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/upload", { method: "POST", body: formData });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error?.message || payload.error || "Upload failed");
      setProgress(100);
      localStorage.setItem("testliftUploadId", payload.upload.id);
      router.push("/stage2");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
      setProgress(0);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-3xl font-bold">Stage 1: Upload</h1>
      <p className="mt-2 text-slate-300">Upload your test case document (.xlsx or .csv).</p>

      <section className="mt-6 rounded-xl border border-dashed border-slate-700 bg-slate-900 p-6">
        <input type="file" accept=".xlsx,.csv" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        {file && (
          <p className="mt-3 text-sm text-slate-300">
            Selected: {file.name} ({Math.round(file.size / 1024)} KB)
          </p>
        )}
        <button
          onClick={handleUpload}
          disabled={busy || !file}
          className="mt-4 rounded-lg bg-teal-400 px-4 py-2 font-semibold text-slate-950 disabled:opacity-50"
        >
          {busy ? "Uploading..." : "Upload File"}
        </button>
        <div className="mt-4 h-2 w-full overflow-hidden rounded bg-slate-800">
          <div className="h-full bg-teal-400 transition-all" style={{ width: `${progress}%` }} />
        </div>
        {error && <p className="mt-3 text-sm text-rose-300">{error}</p>}
      </section>
    </main>
  );
}
