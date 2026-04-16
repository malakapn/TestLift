const requiredPublicVars = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"] as const;
const requiredServerVars = ["STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET"] as const;

function validate(keys: readonly string[]) {
  for (const key of keys) {
    if (!process.env[key]) {
      throw new Error(`Missing required env var: ${key}`);
    }
  }
}

export function getSupabaseConfig() {
  validate(requiredPublicVars);
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
  };
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
