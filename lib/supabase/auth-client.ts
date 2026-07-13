"use client"

import { createBrowserClient } from './client'

// Login con email y password
export async function signIn(email: string, password: string) {
  const supabase = createBrowserClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data
}

// Cerrar sesión
export async function signOut() {
  const supabase = createBrowserClient()

  const { error } = await supabase.auth.signOut()

  if (error) throw error
  return true
}

// Verificar si el usuario logueado es admin (vía email en NEXT_PUBLIC_ADMIN_EMAILS)
export async function isAdmin() {
  const supabase = createBrowserClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email) return false

  const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)

  return adminEmails.includes(user.email.toLowerCase())
}

// Recuperar contraseña
export async function resetPassword(email: string) {
  const supabase = createBrowserClient()

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  })

  if (error) throw error
  return true
}

// Actualizar contraseña
export async function updatePassword(newPassword: string) {
  const supabase = createBrowserClient()

  const { error } = await supabase.auth.updateUser({
    password: newPassword
  })

  if (error) throw error
  return true
}
