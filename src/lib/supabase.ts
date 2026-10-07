import { createClient } from "@supabase/supabase-js"

function requiredPublicEnv(name: "VITE_SUPABASE_URL" | "VITE_SUPABASE_ANON_KEY"): string {
  const value = import.meta.env[name]?.trim()
  if (!value) throw new Error(`${name} is not configured`)
  return value
}

export const supabaseUrl = requiredPublicEnv("VITE_SUPABASE_URL")
export const supabaseAnonKey = requiredPublicEnv("VITE_SUPABASE_ANON_KEY")

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
