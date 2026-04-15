import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const testCaseId = body.testCaseId as string | undefined;
    const repositoryUrl = body.repositoryUrl as string | undefined;

    if (!testCaseId || !repositoryUrl) {
      return NextResponse.json(
        { error: "testCaseId and repositoryUrl are required." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseClient();
    const { error } = await supabase
      .from("test_cases")
      .update({ status: "pushed" })
      .eq("id", testCaseId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      message: "Scripts marked as pushed. Integrate GitHub token-based push next.",
      repositoryUrl,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
