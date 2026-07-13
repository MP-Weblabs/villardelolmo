import { createClient } from './server'

// Obtener usuario actual (server)
export async function getCurrentUser() {
  const supabase = await createClient()

  const { data: { user }, error } = await supabase.auth.getUser()

  if (error) throw error
  return user
}

// Verificar si es admin (server), vía email en NEXT_PUBLIC_ADMIN_EMAILS
export async function isAdmin() {
  let user
  try {
    user = await getCurrentUser()
  } catch {
    // Sin sesión activa: no es admin.
    return false
  }
  if (!user?.email) return false

  const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)

  return adminEmails.includes(user.email.toLowerCase())
}
