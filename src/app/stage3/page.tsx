"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Stage3Page() {
  const router = useRouter();
  const [rows, setRows] = useState<any[]>([]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [error, setError] = useState("");

  useEffect(() => {
    const uploadId = localStorage.getItem("testliftUploadId");
    if (!uploadId) return;
    fetch(`/api/approve?uploadId=${uploadId}`)
      .then((res) => res.json())
      .then((payload) => setRows(payload.testCases || []))
      .catch(() => setError("Failed to load test cases."));
  }, []);

  async function approveSelected() {
    const ids = Object.keys(selected).filter((id) => selected[id]);
    const uploadId = localStorage.getItem("testliftUploadId");
    const res = await fetch("/api/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uploadId, testCaseIds: ids }),
    });
    const payload = await res.json();
    if (!res.ok) {
      setError(payload.error?.message || "Approve failed");
      return;
    }
    router.push("/stage4");
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-bold">Stage 3: Review & Approve</h1>
      {error && <p className="mt-3 text-rose-300">{error}</p>}
      <div className="mt-6 space-y-4">
        {rows.map((row) => (
          <label key={row.id} className="block rounded-xl border border-slate-800 bg-slate-900 p-4">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={!!selected[row.id]}
                onChange={(e) => setSelected((prev) => ({ ...prev, [row.id]: e.target.checked }))}
              />
              <div>
                <p className="font-semibold">{row.title}</p>
                <p className="text-sm text-slate-300">Steps: {row.steps}</p>
                <p className="text-sm text-slate-300">Expected: {row.expected_result}</p>
                <p className="text-sm text-teal-300">NLP summary: {row.nlp_summary || "No summary generated yet."}</p>
              </div>
            </div>
          </label>
        ))}
      </div>
      <button onClick={approveSelected} className="mt-6 rounded bg-teal-400 px-4 py-2 font-semibold text-slate-950">
        Approve Selected
      </button>
    </main>
  );
}
