import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseConfig } from "@/lib/env";

/** Uses NEXT_PUBLIC_* vars; in development, missing values throw a .env.local-focused error (see getSupabaseConfig). */
export function createSupabaseBrowserClient() {
  const { url, anonKey } = getSupabaseConfig();
  return createBrowserClient(url, anonKey);
}
