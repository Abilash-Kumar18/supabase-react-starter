import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// ---------------------------------------------------------------------------
// STEP 1 — Where the credentials come from
// ---------------------------------------------------------------------------
// The URL and anon key are read from the .env file (see .env.example).
// "VITE_" prefix = Vite bakes this variable into the frontend bundle.
// The anon key is safe to expose in the browser (it is protected by your
// Row Level Security rules). NEVER put your "service_role" key here.
// ---------------------------------------------------------------------------
const supabaseUrl: string | undefined = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey: string | undefined = import.meta.env.VITE_SUPABASE_ANON_KEY

// ---------------------------------------------------------------------------
// STEP 2 — One shared client for the whole app
// ---------------------------------------------------------------------------
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl as string, supabaseAnonKey as string)
  : null
