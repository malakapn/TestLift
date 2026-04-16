"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Stage2Page() {
  const router = useRouter();
  const [rows, setRows] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    const uploadId = localStorage.getItem("testliftUploadId");
    if (!uploadId) return;
    fetch("/api/parse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uploadId }),
    })
      .then(async (res) => {
        const payload = await res.json();
        if (!res.ok) throw new Error(payload.error?.message || "Parse failed");
        setRows(payload.testCases || []);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Parse failed"))
      .finally(() => setBusy(false));
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Stage 2: Process</h1>
      <p className="mt-2 text-slate-300">AI parsing in progress and extracted test case table.</p>
      {busy && <p className="mt-6 text-teal-300">Processing with Claude...</p>}
      {error && <p className="mt-6 text-rose-300">{error}</p>}
      {!busy && !error && (
        <>
          <div className="mt-6 overflow-auto rounded-xl border border-slate-800">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-900">
                <tr>
                  {["Test Case ID", "Title", "Steps", "Expected Result", "Priority"].map((h) => (
                    <th key={h} className="px-3 py-2 text-left">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-t border-slate-800">
                    <td className="px-3 py-2">{row.id.slice(0, 8)}</td>
                    <td className="px-3 py-2">{row.title}</td>
                    <td className="px-3 py-2">{row.steps}</td>
                    <td className="px-3 py-2">{row.expected_result}</td>
                    <td className="px-3 py-2">{row.priority}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button onClick={() => router.push("/stage3")} className="mt-6 rounded bg-teal-400 px-4 py-2 font-semibold text-slate-950">
            Continue to Review
          </button>
        </>
      )}
    </main>
  );
}
