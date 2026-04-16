import type { Profile, SubscriptionTier } from "@/lib/types";

export function canUseLanguage(tier: SubscriptionTier, language: "python" | "java") {
  if (language === "python") return true;
  return tier === "pro" || tier === "enterprise";
}

export function canPushToGithub(tier: SubscriptionTier) {
  return tier === "pro" || tier === "enterprise";
}

export function canUseCiTarget(
  tier: SubscriptionTier,
  cicdTarget: "github-actions" | "jenkins" | "gitlab-ci"
) {
  if (cicdTarget === "github-actions") return true;
  return tier === "enterprise";
}

export function monthlyUploadLimit(tier: SubscriptionTier) {
  if (tier === "free") return 3;
  if (tier === "starter") return 10;
  return Number.POSITIVE_INFINITY;
}

export function getTier(profile?: Partial<Profile> | null): SubscriptionTier {
  return (profile?.subscription_tier as SubscriptionTier | undefined) || "free";
}
