import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseConfig } from "./env";

let supabase: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (!supabase) {
    const { url, anonKey } = getSupabaseConfig();
    supabase = createClient(url, anonKey);
  }
  return supabase;
}
