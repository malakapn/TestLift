// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");

    if (!authHeader || !anonKey || authHeader !== `Bearer ${anonKey}`) {
      return json({ error: "Unauthorized request." }, 401);
    }

    const body = await req.json();
    const extractedText = (body.extractedText as string | undefined) ?? "";
    const fileName = (body.fileName as string | undefined) ?? "unknown-file";

    const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY");
    const testCases = anthropicKey
      ? await parseWithAnthropic(anthropicKey, extractedText, fileName)
      : fallbackParse(extractedText);

    const nlpPreview = testCases.map(
      (tc: any, index: number) =>
        `${index + 1}. ${tc.title} -> ${tc.expected_result} (Priority: ${tc.priority})`
    );

    return json({ fileName, testCases, nlpPreview }, 200);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown parse error";
    return json({ error: message }, 500);
  }
});

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function parseWithAnthropic(
  apiKey: string,
  extractedText: string,
  fileName: string
) {
  const prompt = `
You are parsing manual test cases from file "${fileName}".
Return valid JSON with this exact shape:
{
  "testCases": [
    {
      "title": "string",
      "steps": "string",
      "expected_result": "string",
      "priority": "High|Medium|Low"
    }
  ]
}

Input:
${extractedText.slice(0, 12000)}
`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 2000,
      temperature: 0,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    throw new Error(`Anthropic API failed (${response.status})`);
  }

  const payload = await response.json();
  const text = payload?.content?.[0]?.text as string | undefined;
  if (!text) {
    throw new Error("Anthropic returned empty content.");
  }

  const parsed = safeJsonExtract(text);
  const testCases = (parsed?.testCases as any[]) ?? [];
  if (!Array.isArray(testCases) || testCases.length === 0) {
    return fallbackParse(extractedText);
  }

  return testCases.map((tc) => ({
    title: String(tc.title ?? "Untitled test case"),
    steps: String(tc.steps ?? ""),
    expected_result: String(tc.expected_result ?? ""),
    priority: normalizePriority(String(tc.priority ?? "Medium")),
  }));
}

function fallbackParse(raw: string) {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 20)
    .map((line, index) => ({
      title: line.slice(0, 100) || `Test case ${index + 1}`,
      steps: line,
      expected_result: "Expected result to be confirmed in review.",
      priority: "Medium",
    }));
}

function normalizePriority(priority: string) {
  const value = priority.trim().toLowerCase();
  if (value === "high") return "High";
  if (value === "low") return "Low";
  return "Medium";
}

function safeJsonExtract(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start >= 0 && end > start) {
      return JSON.parse(text.slice(start, end + 1));
    }
    throw new Error("Unable to parse JSON from Anthropic response.");
  }
}
