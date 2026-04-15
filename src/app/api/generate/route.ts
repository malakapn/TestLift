import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const testCaseId = body.testCaseId as string | undefined;
    const language = (body.language as "python" | "java" | undefined) ?? "python";

    if (!testCaseId) {
      return NextResponse.json({ error: "testCaseId is required." }, { status: 400 });
    }

    const supabase = getSupabaseClient();
    const { data: parsedRows, error: parsedError } = await supabase
      .from("parsed_results")
      .select("*")
      .eq("test_case_id", testCaseId);

    if (parsedError) {
      return NextResponse.json({ error: parsedError.message }, { status: 500 });
    }

    const seleniumCode = buildTemplate(parsedRows ?? [], language);
    const { data, error } = await supabase
      .from("generated_scripts")
      .insert({ test_case_id: testCaseId, selenium_code: seleniumCode, language })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await supabase.from("test_cases").update({ status: "generated" }).eq("id", testCaseId);

    return NextResponse.json({ script: data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function buildTemplate(rows: Array<{ title?: string; steps?: string }>, language: "python" | "java") {
  if (language === "java") {
    return `public class GeneratedTests {\n${rows
      .map(
        (row, i) =>
          `  // ${sanitize(row.title)}\n  // Steps: ${sanitize(row.steps)}\n  public void test${i + 1}() {}\n`
      )
      .join("\n")}\n}`;
  }
  return rows
    .map(
      (row, i) =>
        `# ${sanitize(row.title)}\n# Steps: ${sanitize(row.steps)}\ndef test_${i + 1}(driver):\n    pass\n`
    )
    .join("\n");
}

function sanitize(value?: string) {
  return (value ?? "").replace(/\s+/g, " ").trim();
}
