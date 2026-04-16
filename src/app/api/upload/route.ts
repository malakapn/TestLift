import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";
import { extractFileText } from "@/lib/file-parser";
import type { ParsedResult } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const uploadedFile = formData.get("file");
    const userId = (formData.get("userId") as string | null) ?? null;

    if (!(uploadedFile instanceof File)) {
      return NextResponse.json({ error: "Missing upload file." }, { status: 400 });
    }

    const supabase = getSupabaseClient();

    const storagePath = `${Date.now()}-${uploadedFile.name}`;
    const uploadBuffer = Buffer.from(await uploadedFile.arrayBuffer());
    const { error: storageError } = await supabase.storage
      .from("test-case-files")
      .upload(storagePath, uploadBuffer, {
        contentType: uploadedFile.type || "application/octet-stream",
        upsert: false,
      });

    const { data: testCaseData, error: insertError } = await supabase
      .from("test_cases")
      .insert({
        user_id: userId,
        file_name: uploadedFile.name,
        status: "uploaded",
      })
      .select()
      .single();

    if (insertError || !testCaseData) {
      const details = insertError?.message ?? "Failed to create test case record.";
      if (details.includes("Could not find the table") || details.includes("schema cache")) {
        return NextResponse.json(
          {
            error:
              "Database schema is not initialized. Run supabase/migrations/202604150001_create_testlift_core.sql in your Supabase SQL editor, then retry upload.",
            code: "DB_SCHEMA_MISSING",
            details,
          },
          { status: 500 }
        );
      }
      return NextResponse.json(
        { error: details },
        { status: 500 }
      );
    }

    const extractedText = await extractFileText(uploadedFile);

    const edgeResponse = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/parse-test-cases`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
        },
        body: JSON.stringify({
          fileName: uploadedFile.name,
          extractedText,
          testCaseRecordId: testCaseData.id,
        }),
      }
    );

    if (!edgeResponse.ok) {
      const edgeError = await edgeResponse.text();
      await supabase
        .from("test_cases")
        .update({ status: "failed" })
        .eq("id", testCaseData.id);
      return NextResponse.json(
        { error: `Edge function failed: ${edgeError}` },
        { status: 500 }
      );
    }

    const parsedPayload = await edgeResponse.json();
    const parsedResults = (parsedPayload.testCases ?? []) as Array<{
      title: string;
      steps: string;
      expected_result: string;
      priority: string;
    }>;

    const rows: ParsedResult[] = parsedResults.map((item) => ({
      test_case_id: testCaseData.id,
      title: item.title ?? "Untitled Test",
      steps: item.steps ?? "",
      expected_result: item.expected_result ?? "",
      priority: item.priority ?? "Medium",
    }));

    const { data: insertedResults, error: parsedInsertError } = await supabase
      .from("parsed_results")
      .insert(rows)
      .select();

    if (parsedInsertError) {
      await supabase
        .from("test_cases")
        .update({ status: "failed" })
        .eq("id", testCaseData.id);
      return NextResponse.json(
        { error: parsedInsertError.message },
        { status: 500 }
      );
    }

    await supabase
      .from("test_cases")
      .update({ status: "review" })
      .eq("id", testCaseData.id);

    return NextResponse.json({
      testCase: testCaseData,
      parsedResults: insertedResults ?? [],
      nlpPreview: parsedPayload.nlpPreview ?? [],
      storageWarning: storageError?.message ?? null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
