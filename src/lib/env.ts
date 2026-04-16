const requiredServerVars = ["STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET"] as const;

function validate(keys: readonly string[]) {
  for (const key of keys) {
    if (!process.env[key]) {
      throw new Error(`Missing required env var: ${key}`);
    }
  }
}

/**
 * Public Supabase URL + anon key. In development, throws a message that points to .env.local.
 */
export function getSupabaseConfig(): { url: string; anonKey: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  const missing: string[] = [];
  if (!url) missing.push("NEXT_PUBLIC_SUPABASE_URL");
  if (!anonKey) missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  if (missing.length > 0) {
    if (process.env.NODE_ENV === "development") {
      throw new Error(
        `TestLift Supabase is not configured. Missing: ${missing.join(", ")}.\n` +
          `Copy .env.example to .env.local in the project root, set NEXT_PUBLIC_SUPABASE_URL and ` +
          `NEXT_PUBLIC_SUPABASE_ANON_KEY, then restart the dev server (npm run dev).`
      );
    }
    throw new Error(`Missing required env var: ${missing[0]}`);
  }

  return { url: url as string, anonKey: anonKey as string };
}

export function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || "https://testlift.dev";
}

export function getStripeConfig() {
  validate(requiredServerVars);
  return {
    secretKey: process.env.STRIPE_SECRET_KEY as string,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET as string,
  };
}

export function getPriceIdMap() {
  return {
    starter_monthly: process.env.STRIPE_PRICE_STARTER_MONTHLY || "",
    starter_annual: process.env.STRIPE_PRICE_STARTER_ANNUAL || "",
    pro_monthly: process.env.STRIPE_PRICE_PRO_MONTHLY || "",
    pro_annual: process.env.STRIPE_PRICE_PRO_ANNUAL || "",
    enterprise_monthly: process.env.STRIPE_PRICE_ENTERPRISE_MONTHLY || "",
    enterprise_annual: process.env.STRIPE_PRICE_ENTERPRISE_ANNUAL || "",
  } as const;
}
