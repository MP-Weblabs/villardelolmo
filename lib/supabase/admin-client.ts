import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import type { Database } from "../database.types"

// Cliente con la service_role key: solo puede usarse en código de servidor
// (API routes / server actions), nunca en componentes "use client".
export function createAdminClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}

export function generarPasswordSegura(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%"
  const bytes = crypto.getRandomValues(new Uint32Array(14))
  return Array.from(bytes, (b) => chars[b % chars.length]).join("")
}
