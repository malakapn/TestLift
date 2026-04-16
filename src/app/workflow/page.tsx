"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type CaseStatus = "draft" | "review" | "approved" | "pipeline" | "rejected";
type Role = "QA Engineer" | "SDET" | "QA Lead" | "Eng Manager" | "AI Assist";

type ApprovalStage = {
  title: string;
  role: Role;
  assignedTo: string;
  state: "completed" | "active" | "locked";
  reviewer?: string;
  comment?: string;
  timestamp?: string;
};

type TestCase = {
  id: string;
  tag: string;
  title: string;
  status: CaseStatus;
  owner: string;
  reviewer: string;
  lastUpdated: string;
  steps: string[];
  detailOwner: string;
  stages: ApprovalStage[];
  activity: string[];
};

const seedCases: TestCase[] = [
  {
    id: "TL-001",
    tag: "Auth",
    title: "Login Flow — SSO Token Expiry",
    status: "pipeline",
    owner: "Kira P.",
    reviewer: "Marcus S.",
    lastUpdated: "2 min ago",
    detailOwner: "Dev Team A",
    steps: [
      "Navigate to login page",
      "Enter valid SSO credentials",
      "Let session expire (simulated timeout)",
      "Attempt re-authentication",
      "Validate redirect to dashboard",
    ],
    stages: [
      {
        title: "Stage 1 — QA Engineer Review",
        role: "QA Engineer",
        assignedTo: "Sarah K.",
        state: "completed",
        reviewer: "Sarah K.",
        comment: "Looks stable, edge case covered",
        timestamp: "1h 45m ago",
      },
      {
        title: "Stage 2 — SDET Validation",
        role: "SDET",
        assignedTo: "Marcus Singh",
        state: "completed",
        reviewer: "Marcus Singh",
        comment: "Validation complete against auth timeout matrix.",
        timestamp: "58m ago",
      },
      {
        title: "Stage 3 — QA Lead Approval",
        role: "QA Lead",
        assignedTo: "Jae-lin Oh",
        state: "completed",
        reviewer: "Jae-lin Oh",
        comment: "Ready for merge gate.",
        timestamp: "18m ago",
      },
      {
        title: "Stage 4 — Pipeline Gate",
        role: "Eng Manager",
        assignedTo: "Taylor Moss",
        state: "completed",
        reviewer: "Taylor Moss",
        comment: "Gate open.",
        timestamp: "2m ago",
      },
    ],
    activity: ["Pipeline gate unlocked and test marked CI/CD ready."],
  },
  {
    id: "TL-002",
    tag: "API",
    title: "API Rate Limit Enforcement across OAuth Scopes",
    status: "review",
    owner: "Kira P.",
    reviewer: "Marcus S.",
    lastUpdated: "7 min ago",
    detailOwner: "Dev Team B",
    steps: [
      "Issue API requests with multiple OAuth scopes",
      "Trigger rate limit thresholds",
      "Verify throttling response per scope",
      "Confirm retry-after header behavior",
    ],
    stages: [
      {
        title: "Stage 1 — QA Engineer Review",
        role: "QA Engineer",
        assignedTo: "Sarah K.",
        state: "completed",
        reviewer: "Sarah K.",
        comment: "Baseline API checks complete.",
        timestamp: "2h ago",
      },
      {
        title: "Stage 2 — SDET Validation",
        role: "SDET",
        assignedTo: "Marcus Singh",
        state: "active",
      },
      {
        title: "Stage 3 — QA Lead Approval",
        role: "QA Lead",
        assignedTo: "Jae-lin Oh",
        state: "locked",
      },
      {
        title: "Stage 4 — Pipeline Gate",
        role: "Eng Manager",
        assignedTo: "Taylor Moss",
        state: "locked",
      },
    ],
    activity: ["Awaiting SDET sign-off for scope edge-case matrix."],
  },
  {
    id: "TL-003",
    tag: "Data Validation",
    title: "CSV Export Schema on Null Field Values",
    status: "draft",
    owner: "Marcus S.",
    reviewer: "Jae-lin O.",
    lastUpdated: "21 min ago",
    detailOwner: "Data Quality Team",
    steps: [
      "Generate CSV export with null-inclusive payload",
      "Validate schema headers",
      "Validate row consistency on null values",
      "Compare output to contract snapshot",
    ],
    stages: [
      { title: "Stage 1 — QA Engineer Review", role: "QA Engineer", assignedTo: "Kira Patel", state: "active" },
      { title: "Stage 2 — SDET Validation", role: "SDET", assignedTo: "Marcus Singh", state: "locked" },
      { title: "Stage 3 — QA Lead Approval", role: "QA Lead", assignedTo: "Jae-lin Oh", state: "locked" },
      { title: "Stage 4 — Pipeline Gate", role: "Eng Manager", assignedTo: "Taylor Moss", state: "locked" },
    ],
    activity: ["Draft created and pending initial QA review."],
  },
  {
    id: "TL-004",
    tag: "UI Regression",
    title: "Checkout Flow with Expired Promo Codes",
    status: "draft",
    owner: "Jae-lin O.",
    reviewer: "Taylor M.",
    lastUpdated: "39 min ago",
    detailOwner: "Growth Team",
    steps: [
      "Apply expired promo at checkout",
      "Verify validation messaging",
      "Ensure total remains unchanged",
      "Confirm telemetry event fired",
    ],
    stages: [
      { title: "Stage 1 — QA Engineer Review", role: "QA Engineer", assignedTo: "Kira Patel", state: "active" },
      { title: "Stage 2 — SDET Validation", role: "SDET", assignedTo: "Marcus Singh", state: "locked" },
      { title: "Stage 3 — QA Lead Approval", role: "QA Lead", assignedTo: "Jae-lin Oh", state: "locked" },
      { title: "Stage 4 — Pipeline Gate", role: "Eng Manager", assignedTo: "Taylor Moss", state: "locked" },
    ],
    activity: ["Pending QA Engineer review assignment acceptance."],
  },
  {
    id: "TL-005",
    tag: "Performance",
    title: "Load Test: 500 concurrent users on payment gateway",
    status: "approved",
    owner: "Taylor M.",
    reviewer: "Marcus S.",
    lastUpdated: "1h ago",
    detailOwner: "Perf Guild",
    steps: [
      "Run 500 virtual users against checkout",
      "Capture gateway p95 latency",
      "Validate error budget threshold",
      "Confirm rollback trigger guardrails",
    ],
    stages: [
      { title: "Stage 1 — QA Engineer Review", role: "QA Engineer", assignedTo: "Sarah K.", state: "completed", reviewer: "Sarah K.", comment: "Coverage complete.", timestamp: "2h ago" },
      { title: "Stage 2 — SDET Validation", role: "SDET", assignedTo: "Marcus Singh", state: "completed", reviewer: "Marcus Singh", comment: "Load profile validated.", timestamp: "1h 20m ago" },
      { title: "Stage 3 — QA Lead Approval", role: "QA Lead", assignedTo: "Jae-lin Oh", state: "active" },
      { title: "Stage 4 — Pipeline Gate", role: "Eng Manager", assignedTo: "Taylor Moss", state: "locked" },
    ],
    activity: ["Approved and awaiting final pipeline gate action."],
  },
];

const reviewers = ["Kira Patel", "Marcus Singh", "Jae-lin Oh", "Taylor Moss", "AI Assist"];
const categories = ["Authentication", "API Contract", "Data Validation", "UI Regression", "Performance", "Integration"];

function statusMeta(status: CaseStatus) {
  if (status === "draft") return { label: "Draft", color: "text-zinc-300", border: "border-zinc-600", bg: "bg-zinc-800/70" };
  if (status === "review") return { label: "In Review", color: "text-amber-300", border: "border-amber-500/80", bg: "bg-amber-500/10" };
  if (status === "approved") return { label: "Approved", color: "text-green-300", border: "border-green-500/80", bg: "bg-green-500/10" };
  if (status === "rejected") return { label: "Rejected", color: "text-red-300", border: "border-red-500/80", bg: "bg-red-500/10" };
  return { label: "Pipeline Ready", color: "text-[var(--accent)]", border: "border-[var(--accent)]", bg: "bg-[rgba(0,212,170,0.12)]" };
}

export default function WorkflowPage() {
  const [cases, setCases] = useState<TestCase[]>(seedCases);
  const [selectedId, setSelectedId] = useState(seedCases[0].id);
  const [toast, setToast] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newTag, setNewTag] = useState(categories[0]);
  const [newReviewer, setNewReviewer] = useState(reviewers[0]);
  const [flashKey, setFlashKey] = useState(0);

  const selected = useMemo(() => cases.find((item) => item.id === selectedId) ?? cases[0], [cases, selectedId]);

  const counts = useMemo(() => {
    const pending = cases.filter((item) => item.status === "draft").length;
    const inReview = cases.filter((item) => item.status === "review").length;
    const approved = cases.filter((item) => item.status === "approved").length;
    const pipelineReady = cases.filter((item) => item.status === "pipeline").length;
    const rejected = cases.filter((item) => item.status === "rejected").length;
    return { pending, inReview, approved, pipelineReady, rejected };
  }, [cases]);

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 2200);
  }

  function updateCaseStatus(next: CaseStatus, action: "approve" | "reject" | "request") {
    if (!selected) return;
    const nextStages = selected.stages.map((stage, index) => {
      if (next === "pipeline") {
        return { ...stage, state: "completed" as const, reviewer: stage.reviewer ?? stage.assignedTo, timestamp: "just now", comment: stage.comment ?? "Approved." };
      }
      if (next === "approved") {
        if (index < 2) {
          return { ...stage, state: "completed" as const, reviewer: stage.reviewer ?? stage.assignedTo, timestamp: stage.timestamp ?? "just now", comment: stage.comment ?? "Reviewed." };
        }
        if (index === 2) return { ...stage, state: "active" as const };
        return { ...stage, state: "locked" as const };
      }
      if (next === "review") {
        if (index === 0) return { ...stage, state: "completed" as const, reviewer: stage.reviewer ?? stage.assignedTo, timestamp: stage.timestamp ?? "just now", comment: stage.comment ?? "Initial review complete." };
        if (index === 1) return { ...stage, state: "active" as const };
        return { ...stage, state: "locked" as const };
      }
      if (next === "rejected") {
        if (index < 1) return { ...stage, state: "completed" as const };
        return { ...stage, state: "locked" as const };
      }
      return stage;
    });

    setCases((prev) =>
      prev.map((item) =>
        item.id === selected.id
          ? {
              ...item,
              status: next,
              lastUpdated: "just now",
              stages: nextStages,
              activity: [
                `${action === "approve" ? "Approved" : action === "reject" ? "Rejected" : "Requested changes"} by current reviewer`,
                ...item.activity,
              ],
            }
          : item
      )
    );
    setFlashKey((key) => key + 1);
  }

  function onApprove() {
    if (!selected) return;
    if (selected.status === "review") {
      updateCaseStatus("approved", "approve");
      showToast(`${selected.id} moved to Approved.`);
      return;
    }
    if (selected.status === "approved") {
      updateCaseStatus("pipeline", "approve");
      showToast(`${selected.id} is now Pipeline Ready.`);
    }
  }

  function onReject() {
    if (!selected) return;
    if (selected.status === "review" || selected.status === "approved") {
      updateCaseStatus("rejected", "reject");
      showToast(`${selected.id} rejected and blocked from pipeline.`);
    }
  }

  function onRequestChanges() {
    if (!selected) return;
    setCases((prev) =>
      prev.map((item) =>
        item.id === selected.id ? { ...item, activity: ["Requested changes — status retained.", ...item.activity], lastUpdated: "just now" } : item
      )
    );
    setFlashKey((key) => key + 1);
    showToast("Change request logged.");
  }

  function onCreateCase(event: React.FormEvent) {
    event.preventDefault();
    if (cases.length >= 5) {
      showToast("Free tier limit reached: 5 test cases max");
      return;
    }
    const nextId = `TL-${String(cases.length + 1).padStart(3, "0")}`;
    const created: TestCase = {
      id: nextId,
      tag: newTag,
      title: newTitle,
      status: "review",
      owner: "Kira P.",
      reviewer: newReviewer,
      lastUpdated: "just now",
      detailOwner: "Governance Team",
      steps: ["Step definition pending author input."],
      stages: [
        { title: "Stage 1 — QA Engineer Review", role: "QA Engineer", assignedTo: "Kira Patel", state: "active" },
        { title: "Stage 2 — SDET Validation", role: "SDET", assignedTo: "Marcus Singh", state: "locked" },
        { title: "Stage 3 — QA Lead Approval", role: "QA Lead", assignedTo: "Jae-lin Oh", state: "locked" },
        { title: "Stage 4 — Pipeline Gate", role: "Eng Manager", assignedTo: "Taylor Moss", state: "locked" },
      ],
      activity: ["Test case submitted — awaiting reviewer sign-off"],
    };
    setCases((prev) => [created, ...prev]);
    setSelectedId(created.id);
    setOpenModal(false);
    setNewTitle("");
    setNewTag(categories[0]);
    setNewReviewer(reviewers[0]);
    showToast("Test case submitted — awaiting reviewer sign-off");
    setFlashKey((key) => key + 1);
  }

  const disableActions = !selected || selected.status === "pipeline" || selected.status === "rejected";

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--txt)]">
      <header className="fixed left-0 right-0 top-0 z-30 flex h-14 items-center justify-between border-b border-[var(--border)] bg-[var(--bg2)] px-5">
        <div>
          <p className="text-sm text-[var(--txt3)]">TestLift Governance Console</p>
          <p className="text-sm font-medium">Pipeline validation overview</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setOpenModal(true)}
            className="rounded-md border border-[var(--border2)] bg-[var(--bg3)] px-3 py-1.5 text-sm transition hover:border-[var(--accent)]"
          >
            + New Test Case
          </button>
          <Link href="/signin" className="rounded-md bg-[var(--accent)] px-3 py-1.5 text-sm font-semibold text-white">
            Account
          </Link>
        </div>
      </header>

      <div className="flex pt-14">
        <aside className="fixed left-0 top-14 flex h-[calc(100vh-56px)] w-[220px] flex-col justify-between border-r border-[var(--border)] bg-[var(--bg2)] p-4">
          <div className="space-y-2 text-sm">
            <SidebarItem label="Overview" active />
            <SidebarItem label={`Test Cases (${cases.length})`} />
            <SidebarItem label={`Approvals (${counts.inReview})`} warn />
            <SidebarItem label="Pipeline Status" />
            <SidebarItem label="Settings" disabled />
          </div>
          <div className="rounded-[10px] border border-[var(--border)] bg-[var(--bg3)] p-3 text-xs">
            <StatusLine label="Pending" value={counts.pending} color="text-[var(--warn)]" />
            <StatusLine label="In Review" value={counts.inReview} color="text-[var(--info)]" />
            <StatusLine label="Approved" value={counts.approved} color="text-[var(--green)]" />
            <StatusLine label="Pipeline Ready" value={counts.pipelineReady} color="text-[var(--accent)]" />
            <StatusLine label="Rejected" value={counts.rejected} color="text-[var(--danger)]" />
          </div>
        </aside>

        <section className="ml-[220px] grid min-h-[calc(100vh-56px)] flex-1 grid-cols-1 lg:grid-cols-[420px_1fr]">
          <div className="border-r border-[var(--border)] bg-[var(--bg2)] p-4">
            <div key={flashKey} className="flash-highlight mb-4 grid grid-cols-2 gap-2 xl:grid-cols-4">
              <MetricCard label="Pending Approval" value={counts.pending} tone="text-[var(--warn)]" />
              <MetricCard label="In Review" value={counts.inReview} tone="text-[var(--info)]" />
              <MetricCard label="Approved" value={counts.approved} tone="text-[var(--green)]" />
              <MetricCard label="Pipeline Ready" value={counts.pipelineReady} tone="text-[var(--accent)]" />
            </div>

            <div className="max-h-[calc(100vh-240px)] space-y-3 overflow-auto pr-1">
              {cases.map((item) => {
                const meta = statusMeta(item.status);
                const selectedCard = item.id === selected?.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedId(item.id)}
                    className={`w-full rounded-[10px] border bg-[var(--bg3)] p-4 text-left transition ${
                      selectedCard ? "border-[var(--accent)] shadow-md shadow-[rgba(0,212,170,0.2)]" : "border-[var(--border)] hover:border-[var(--border2)]"
                    }`}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <p className="mono text-xs text-[var(--txt3)]">{item.id}</p>
                      <span className="rounded-md border border-[var(--border2)] px-2 py-0.5 text-xs text-[var(--txt2)]">{item.tag}</span>
                    </div>
                    <p className="font-medium">{item.title}</p>
                    <div className={`mt-2 inline-flex items-center gap-2 rounded-full border px-2 py-0.5 text-xs ${meta.border} ${meta.bg} ${meta.color}`}>
                      <span className="h-2 w-2 rounded-full bg-current" />
                      {meta.label}
                    </div>
                    <p className="mt-2 text-xs text-[var(--txt2)]">
                      Owner: {item.owner} → Reviewer: {item.reviewer}
                    </p>
                    <p className="mt-1 text-xs text-[var(--txt3)]">Last updated: {item.lastUpdated}</p>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 rounded-[10px] border border-[var(--border)] bg-[var(--bg3)] p-3 text-sm">
              <p className="mb-2 font-semibold">CI/CD Pipeline Status</p>
              <p className="text-[var(--green)]">✔ Approved Tests Ready: {counts.pipelineReady}</p>
              <p className="text-[var(--warn)]">⏳ Pending Approval: {counts.pending + counts.inReview}</p>
              <p className="text-[var(--danger)]">✖ Rejected: {counts.rejected}</p>
              <div className="mt-3 rounded-md border border-[var(--accent)] bg-[rgba(59,130,246,0.1)] px-2 py-1 text-xs text-[var(--accent)]">
                <span className="pulse-dot mr-2 inline-block h-2 w-2 rounded-full bg-[var(--accent)]" />
                {counts.pipelineReady > 0
                  ? `Validation gate open — ${counts.pipelineReady} test case(s) pipeline-ready`
                  : `Blocked — awaiting governance approval on ${Math.max(1, counts.pending + counts.inReview)} test case(s)`}
              </div>
            </div>
          </div>

          <div className="relative bg-[var(--bg)] p-5 pb-24">
            {selected && (
              <>
                <section className="rounded-[14px] border border-[var(--border)] bg-[var(--bg2)] p-5">
                  <p className="mono text-xs text-[var(--txt3)]">
                    {selected.id} · {selected.tag}
                  </p>
                  <h2 className="mt-2 text-2xl font-bold">{selected.title}</h2>
                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-[var(--txt2)]">
                    <p>Status: {statusMeta(selected.status).label}</p>
                    <p>Owner: {selected.detailOwner}</p>
                    <p>Last updated: {selected.lastUpdated}</p>
                  </div>
                </section>

                <section className="mt-4 rounded-[14px] border border-[var(--border)] bg-[var(--bg2)] p-5">
                  <h3 className="text-lg font-bold">Step Breakdown</h3>
                  <ol className="mt-3 list-decimal space-y-2 pl-5 text-[var(--txt2)]">
                    {selected.steps.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                </section>

                <section className="mt-4 rounded-[14px] border border-[var(--border)] bg-[var(--bg2)] p-5">
                  <h3 className="text-lg font-bold">Approval Workflow</h3>
                  <div className="mt-4 space-y-3">
                    {selected.stages.map((stage, index) => (
                      <div key={stage.title} className="relative rounded-[10px] border border-[var(--border)] bg-[var(--bg3)] p-4 shadow-sm">
                        {index < selected.stages.length - 1 && (
                          <div
                            className={`absolute left-5 top-12 h-8 w-0.5 transition-all duration-300 ${
                              stage.state === "completed" ? "bg-[var(--green)]" : "bg-[var(--border2)]"
                            }`}
                          />
                        )}
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-medium">{stage.title}</p>
                          <RoleBadge role={stage.role} />
                        </div>
                        <p className="mt-2 text-sm text-[var(--txt2)]">
                          {stage.state === "completed"
                            ? `Approved by: ${stage.reviewer} · ${stage.timestamp}`
                            : stage.state === "active"
                            ? `Pending review · Assigned to: ${stage.assignedTo}`
                            : "🔒 LOCKED — Pending upstream approvals"}
                        </p>
                        {stage.comment && <p className="mt-1 text-sm text-[var(--txt3)]">Comment: "{stage.comment}"</p>}
                      </div>
                    ))}
                  </div>
                </section>

                <section className="mt-4 rounded-[14px] border border-[var(--border)] bg-[var(--bg2)] p-5">
                  <h3 className="text-lg font-bold">Activity</h3>
                  <ul className="mt-3 space-y-2 text-sm text-[var(--txt2)]">
                    {selected.activity.slice(0, 4).map((line) => (
                      <li key={line}>• {line}</li>
                    ))}
                  </ul>
                </section>
              </>
            )}

            <div className="fixed bottom-0 left-[220px] right-0 z-20 border-t border-[var(--border)] bg-[var(--bg2)] p-3">
              <div className="mx-auto flex max-w-5xl flex-wrap gap-2">
                <button
                  onClick={onApprove}
                  disabled={disableActions}
                  className="rounded-md bg-[var(--green)] px-4 py-2 text-sm font-semibold text-black disabled:cursor-not-allowed disabled:opacity-40"
                >
                  ✓ Approve
                </button>
                <button
                  onClick={onReject}
                  disabled={disableActions}
                  className="rounded-md bg-[var(--danger)] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  ✕ Reject
                </button>
                <button
                  onClick={onRequestChanges}
                  disabled={disableActions}
                  className="rounded-md bg-[var(--warn)] px-4 py-2 text-sm font-semibold text-black disabled:cursor-not-allowed disabled:opacity-40"
                >
                  ↺ Request Changes
                </button>
                <button
                  onClick={() => showToast("Comment panel opened")}
                  disabled={disableActions}
                  className="rounded-md border border-[var(--border2)] bg-transparent px-4 py-2 text-sm font-semibold text-[var(--txt)] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  + Comment
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {openModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/55 p-4 transition">
          <form
            onSubmit={onCreateCase}
            className="w-full max-w-lg rounded-[14px] border border-[var(--border2)] bg-[var(--bg2)] p-6 shadow-xl transition"
          >
            <h3 className="text-2xl font-bold">New Test Case</h3>
            <p className="mt-1 text-sm text-[var(--txt2)]">Submit a governance case for review.</p>
            <div className="mt-4 space-y-3">
              <div>
                <label className="mb-1 block text-sm text-[var(--txt2)]">Test case title</label>
                <input
                  required
                  value={newTitle}
                  onChange={(event) => setNewTitle(event.target.value)}
                  className="w-full rounded-[10px] border border-[var(--border)] bg-[var(--bg4)] px-3 py-2"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-[var(--txt2)]">Category / tag</label>
                <select
                  value={newTag}
                  onChange={(event) => setNewTag(event.target.value)}
                  className="w-full rounded-[10px] border border-[var(--border)] bg-[var(--bg4)] px-3 py-2"
                >
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm text-[var(--txt2)]">Assign reviewer</label>
                <select
                  value={newReviewer}
                  onChange={(event) => setNewReviewer(event.target.value)}
                  className="w-full rounded-[10px] border border-[var(--border)] bg-[var(--bg4)] px-3 py-2"
                >
                  {reviewers.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setOpenModal(false)} className="rounded-md border border-[var(--border2)] bg-transparent px-4 py-2 text-sm text-[var(--txt)]">
                Cancel
              </button>
              <button type="submit" className="rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white">
                Submit
              </button>
            </div>
          </form>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-[10px] border border-[var(--border2)] bg-[var(--bg3)] px-4 py-3 text-sm shadow-xl transition">
          {toast}
        </div>
      )}
    </main>
  );
}

function SidebarItem({ label, active, warn, disabled }: { label: string; active?: boolean; warn?: boolean; disabled?: boolean }) {
  return (
    <div
      className={`rounded-md px-3 py-2 transition ${
        disabled
          ? "cursor-not-allowed text-[var(--txt3)] opacity-50"
          : active
          ? "bg-[var(--bg3)] text-[var(--txt)]"
          : warn
          ? "text-[var(--warn)]"
          : "text-[var(--txt2)] hover:bg-[var(--bg3)]"
      }`}
    >
      {label}
    </div>
  );
}

function StatusLine({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="mb-1 flex items-center justify-between">
      <span className="text-[var(--txt2)]">{label}</span>
      <span className={`font-semibold ${color}`}>{value}</span>
    </div>
  );
}

function MetricCard({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className="rounded-md border border-[var(--border)] bg-[var(--bg3)] p-2.5">
      <p className="text-[10px] uppercase tracking-wide text-[var(--txt3)]">{label}</p>
      <p className={`mt-1 text-xl font-extrabold ${tone}`}>{value}</p>
    </div>
  );
}

function RoleBadge({ role }: { role: Role }) {
  const palette: Record<Role, string> = {
    "QA Engineer": "bg-blue-500/20 text-blue-300 border-blue-500/50",
    SDET: "bg-purple-500/20 text-purple-300 border-purple-500/50",
    "QA Lead": "bg-amber-500/20 text-amber-300 border-amber-500/50",
    "Eng Manager": "bg-red-500/20 text-red-300 border-red-500/50",
    "AI Assist": "bg-[rgba(167,139,250,0.16)] text-[var(--purple)] border-[var(--purple)]/50",
  };
  return <span className={`rounded-md border px-2 py-0.5 text-xs ${palette[role]}`}>{role}</span>;
}
