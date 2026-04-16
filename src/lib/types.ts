export type SubscriptionTier = "free" | "starter" | "pro" | "enterprise";
export type SubscriptionStatus = "active" | "cancelled" | "past_due" | "trialing";
export type SubscriptionPeriod = "monthly" | "annual";
export type WorkflowStatus =
  | "uploaded"
  | "parsing"
  | "parsed"
  | "review"
  | "approved"
  | "generating"
  | "generated"
  | "pushing"
  | "complete"
  | "failed";

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  subscription_tier: SubscriptionTier;
  subscription_status: SubscriptionStatus;
  subscription_period: SubscriptionPeriod | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
}

export interface Upload {
  id: string;
  user_id: string;
  file_name: string;
  file_url: string;
  status: WorkflowStatus;
  error_message: string | null;
  created_at: string;
}

export interface TestCase {
  id: string;
  upload_id: string;
  user_id: string;
  title: string;
  steps: string;
  expected_result: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  approved: boolean;
  nlp_summary: string | null;
}

export interface ParsedResult {
  id?: string;
  test_case_id: string;
  title: string;
  steps: string;
  expected_result: string;
  priority: string;
}

export interface GeneratedScript {
  id: string;
  upload_id: string;
  user_id: string;
  language: "python" | "java";
  framework: "selenium";
  cicd_target: "github-actions" | "jenkins" | "gitlab-ci";
  script_content: string;
  created_at: string;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: string;
  };
}
