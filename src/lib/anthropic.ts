import Anthropic from "@anthropic-ai/sdk";

export function getAnthropicClient() {
  if (!process.env.ANTHROPIC_API_KEY) {
    return null;
  }
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

export function buildFallbackParsedCases(rawText: string) {
  const lines = rawText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 25);

  return lines.map((line, index) => ({
    test_case_id: `TC-${String(index + 1).padStart(3, "0")}`,
    title: line.slice(0, 100),
    steps: line,
    expected_result: "Expected result to be validated during review.",
    priority: "Medium",
  }));
}
