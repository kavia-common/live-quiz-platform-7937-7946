import { createClient } from "@supabase/supabase-js";

// PUBLIC_INTERFACE
export function getSupabaseClient() {
  /**
   * Returns a Supabase client initialized using REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_KEY.
   * Ensure these are set in environment (.env) by the orchestrator.
   */
  const url = process.env.REACT_APP_SUPABASE_URL;
  const key = process.env.REACT_APP_SUPABASE_KEY;
  if (!url || !key) {
    console.warn("Supabase env vars missing. Please set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_KEY.");
  }
  return createClient(url || "https://placeholder.supabase.co", key || "public-anon-key");
}
