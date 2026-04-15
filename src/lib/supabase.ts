import { createClient } from "@supabase/supabase-js";
import { getSupabaseConfig } from "./env";

const { url, anonKey } = getSupabaseConfig();

export function getSupabaseClient() {
  return createClient(url, anonKey);
}
