"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ClubLogo } from "@/components/club-logo"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { createBrowserClient } from "@/lib/supabase/client"
import { updatePassword } from "@/lib/supabase/auth-client"

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  )
}

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [ready, setReady] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const establecerSesion = async () => {
      const supabase = createBrowserClient()
      const code = searchParams.get("code")

      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
        if (exchangeError) {
          setError("El enlace de recuperación no es válido o ha caducado. Solicita uno nuevo.")
          setReady(true)
          return
        }
      }

      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setError("El enlace de recuperación no es válido o ha caducado. Solicita uno nuevo.")
      }
      setReady(true)
    }

    establecerSesion()
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.")
      return
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.")
      return
    }

    setIsLoading(true)
    try {
      await updatePassword(password)
      setSuccess(true)
      setTimeout(() => router.push("/socios/login"), 2000)
    } catch {
      setError("No se ha podido actualizar la contraseña. Vuelve a intentarlo.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header lightHero />
      <main className="flex-1 pt-20 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center">
            <ClubLogo className="h-16 w-16 mb-8 mx-auto" />
            <h1 className="text-3xl font-black text-foreground tracking-tight mb-3">
              Restablecer contraseña
            </h1>
            <p className="text-muted-foreground">
              Introduce tu nueva contraseña de acceso.
            </p>
          </div>

          {!ready ? (
            <p className="text-center text-muted-foreground">Comprobando enlace...</p>
          ) : success ? (
            <div className="flex items-center gap-2 rounded-xl bg-green-50 border border-green-200 text-green-700 px-4 py-3 text-sm">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>Contraseña actualizada. Redirigiendo al inicio de sesión...</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="password">Nueva contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="h-14 rounded-xl border-2 border-border bg-background px-4 text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirma la contraseña</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  className="h-14 rounded-xl border-2 border-border bg-background px-4 text-base"
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 rounded-xl text-base font-semibold"
              >
                {isLoading ? "Guardando..." : "Guardar contraseña"}
              </Button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
