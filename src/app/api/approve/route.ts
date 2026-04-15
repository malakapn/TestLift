import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const testCaseId = body.testCaseId as string | undefined;
    if (!testCaseId) {
      return NextResponse.json({ error: "testCaseId is required." }, { status: 400 });
    }

    const supabase = getSupabaseClient();

    await supabase
      .from("test_cases")
      .update({ status: "approved" })
      .eq("id", testCaseId);

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
