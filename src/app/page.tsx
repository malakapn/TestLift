import Link from "next/link";

export default function HomePage() {
  return (
    <main style={{ maxWidth: 960, margin: "40px auto", padding: 24 }}>
      <h1 style={{ fontSize: 36, marginBottom: 12 }}>TestLift</h1>
      <p style={{ lineHeight: 1.6, marginBottom: 24 }}>
        Convert manual QA documents into Selenium automation with a guided flow:
        Upload - Process - Review - Configure - Push - Complete.
      </p>
      <Link
        href="/stage1"
        style={{
          display: "inline-block",
          padding: "12px 18px",
          borderRadius: 10,
          background: "#2a4ddc",
          color: "white",
          textDecoration: "none",
          fontWeight: 700,
        }}
      >
        Open Stage 1 Workflow
      </Link>
    </main>
  );
}
