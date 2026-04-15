"use client";

import { useMemo, useState } from "react";

type UiStep = 1 | 2 | 3 | 4 | 5 | 6;

interface ParsedItem {
  id?: string;
  title: string;
  steps: string;
  expected_result: string;
  priority: string;
}

interface UploadResponse {
  testCase: { id: string; file_name: string; status: string };
  parsedResults: ParsedItem[];
  nlpPreview: string[];
}

export default function Stage1Page() {
  const [file, setFile] = useState<File | null>(null);
  const [step, setStep] = useState<UiStep>(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testCaseId, setTestCaseId] = useState<string>("");
  const [parsed, setParsed] = useState<ParsedItem[]>([]);
  const [preview, setPreview] = useState<string[]>([]);
  const [language, setLanguage] = useState<"python" | "java">("python");
  const [repositoryUrl, setRepositoryUrl] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");

  const canApprove = useMemo(() => parsed.length > 0, [parsed.length]);

  async function handleUpload() {
    if (!file) {
      setError("Please choose a .xlsx, .csv or .docx file.");
      return;
    }

    setBusy(true);
    setError(null);
    setStep(2);

    try {
      const data = new FormData();
      data.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });

      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload.error ?? "Upload failed.");
      }

      const payload = (await response.json()) as UploadResponse;
      setTestCaseId(payload.testCase.id);
      setParsed(payload.parsedResults);
      setPreview(payload.nlpPreview);
      setStep(3);
    } catch (uploadError) {
      const message =
        uploadError instanceof Error ? uploadError.message : "Unknown error.";
      setError(message);
      setStep(1);
    } finally {
      setBusy(false);
    }
  }

  async function handleApprove() {
    if (!canApprove) return;
    setBusy(true);
    setError(null);
    setStep(4);

    try {
      const response = await fetch("/api/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testCaseId }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error ?? "Approve failed.");
      }
      const generationResponse = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testCaseId, language }),
      });
      const generatedPayload = await generationResponse.json();
      if (!generationResponse.ok) {
        throw new Error(generatedPayload.error ?? "Generate failed.");
      }
      setGeneratedCode(generatedPayload.script.selenium_code as string);
      setStep(5);
    } catch (approveError) {
      setError(
        approveError instanceof Error ? approveError.message : "Unknown error."
      );
      setStep(3);
    } finally {
      setBusy(false);
    }
  }

  async function handlePush() {
    if (!repositoryUrl.trim()) {
      setError("Please provide a GitHub repository URL.");
      return;
    }

    setBusy(true);
    setError(null);

    try {
      const response = await fetch("/api/push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testCaseId, repositoryUrl }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error ?? "Push failed.");
      }
      setStep(6);
    } catch (pushError) {
      setError(pushError instanceof Error ? pushError.message : "Unknown error.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main style={{ maxWidth: 1080, margin: "20px auto", padding: 24 }}>
      <h1 style={{ marginBottom: 8 }}>TestLift Stage 1</h1>
      <p style={{ marginTop: 0, marginBottom: 24, color: "#42526f" }}>
        Upload - Process - Review - Configure - Push - Complete
      </p>

      <StepBar current={step} />

      <section
        style={{
          marginTop: 20,
          background: "white",
          borderRadius: 12,
          padding: 18,
          border: "1px solid #e3e8f4",
        }}
      >
        {error && (
          <p style={{ color: "#b42318", fontWeight: 600, marginTop: 0 }}>{error}</p>
        )}

        <h2>1) Upload test case file</h2>
        <input
          type="file"
          accept=".xlsx,.xls,.csv,.docx"
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
        />
        <div style={{ marginTop: 12 }}>
          <button onClick={handleUpload} disabled={busy}>
            {busy && step <= 2 ? "Processing..." : "Upload & Parse"}
          </button>
        </div>
      </section>

      {(step >= 3 || parsed.length > 0) && (
        <section
          style={{
            marginTop: 20,
            background: "white",
            borderRadius: 12,
            padding: 18,
            border: "1px solid #e3e8f4",
          }}
        >
          <h2>2) Review AI extracted test cases</h2>
          {parsed.length === 0 ? (
            <p>No parsed test cases yet.</p>
          ) : (
            <ul style={{ paddingLeft: 18 }}>
              {parsed.map((item, index) => (
                <li key={`${item.id ?? "p"}-${index}`} style={{ marginBottom: 12 }}>
                  <strong>{item.title}</strong>
                  <div>Priority: {item.priority}</div>
                  <div>Steps: {item.steps}</div>
                  <div>Expected: {item.expected_result}</div>
                </li>
              ))}
            </ul>
          )}

          <h3>NLP preview</h3>
          {preview.length > 0 ? (
            <ul style={{ paddingLeft: 18 }}>
              {preview.map((line, index) => (
                <li key={`${line}-${index}`}>{line}</li>
              ))}
            </ul>
          ) : (
            <p>NLP preview not available.</p>
          )}

          <div style={{ marginTop: 12 }}>
            <label htmlFor="lang">Language: </label>
            <select
              id="lang"
              value={language}
              onChange={(event) =>
                setLanguage(event.target.value as "python" | "java")
              }
            >
              <option value="python">Python</option>
              <option value="java">Java</option>
            </select>
          </div>

          <div style={{ marginTop: 12 }}>
            <button onClick={handleApprove} disabled={busy || !canApprove}>
              {busy && step === 4 ? "Generating..." : "Approve & Generate Scripts"}
            </button>
          </div>
        </section>
      )}

      {(step >= 5 || generatedCode) && (
        <section
          style={{
            marginTop: 20,
            background: "white",
            borderRadius: 12,
            padding: 18,
            border: "1px solid #e3e8f4",
          }}
        >
          <h2>3) Push generated scripts</h2>
          <textarea
            value={generatedCode}
            readOnly
            style={{ width: "100%", minHeight: 180, fontFamily: "monospace" }}
          />
          <div style={{ marginTop: 12 }}>
            <input
              placeholder="https://github.com/your-org/your-repo"
              value={repositoryUrl}
              onChange={(event) => setRepositoryUrl(event.target.value)}
              style={{ width: "100%", padding: 8 }}
            />
          </div>
          <div style={{ marginTop: 12 }}>
            <button onClick={handlePush} disabled={busy}>
              Mark as pushed
            </button>
          </div>
          {step === 6 && (
            <p style={{ color: "#067647", fontWeight: 700 }}>
              Complete. Scripts are ready for CI/CD integration.
            </p>
          )}
        </section>
      )}
    </main>
  );
}

function StepBar({ current }: { current: UiStep }) {
  const steps = ["Upload", "Process", "Review", "Configure", "Push", "Complete"];
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
        gap: 8,
      }}
    >
      {steps.map((label, index) => {
        const stepNumber = (index + 1) as UiStep;
        const active = stepNumber <= current;
        return (
          <div
            key={label}
            style={{
              background: active ? "#2447d8" : "#d7def6",
              color: active ? "white" : "#35518e",
              borderRadius: 8,
              textAlign: "center",
              padding: "8px 4px",
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            {label}
          </div>
        );
      })}
    </div>
  );
}
