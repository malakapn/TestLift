export type WorkflowStatus =
  | "uploaded"
  | "parsing"
  | "review"
  | "approved"
  | "generated"
  | "pushed"
  | "failed";

export interface ParsedResult {
  id?: string;
  test_case_id: string;
  title: string;
  steps: string;
  expected_result: string;
  priority: string;
}

export interface TestCaseRecord {
  id: string;
  user_id: string | null;
  file_name: string;
  upload_date: string;
  status: WorkflowStatus;
}

export interface GeneratedScript {
  id?: string;
  test_case_id: string;
  selenium_code: string;
  language: "python" | "java";
  created_at?: string;
}
