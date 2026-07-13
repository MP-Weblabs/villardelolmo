"use client"

import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ClubLogo } from "@/components/club-logo"
import { Eye, EyeOff, ArrowRight, AlertCircle, Shield } from "lucide-react"
import { signIn, isAdmin } from "@/lib/supabase/auth-client"
import { sanitizeInternalPath } from "@/lib/utils"

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <AdminLoginForm />
    </Suspense>
  )
}

function AdminLoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    try {
      await signIn(email, password)
      const esAdmin = await isAdmin()
      if (!esAdmin) {
        setError("Esta cuenta no tiene permisos de administración.")
        setIsLoading(false)
        return
      }
      const redirectTo = sanitizeInternalPath(searchParams.get("redirectTo"), "/admin")
      router.push(redirectTo)
      router.refresh()
    } catch (err: any) {
      setError(
        err?.message === "Invalid login credentials"
          ? "Email o contraseña incorrectos."
          : "Ha ocurrido un error al iniciar sesión. Inténtalo de nuevo."
      )
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-6">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
        <div className="flex flex-col items-center mb-8">
          <ClubLogo className="h-14 w-14 mb-4" variant="light" />
          <h1 className="text-2xl font-heading font-bold text-white">Panel de Administración</h1>
          <p className="text-zinc-400 text-sm mt-1">UD Villar del Olmo</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-zinc-300">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@udvillardelolmo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-zinc-300">Contraseña</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 font-semibold"
          >
            {isLoading ? "Accediendo..." : (
              <span className="flex items-center justify-center gap-2">
                Acceder <ArrowRight className="h-4 w-4" />
              </span>
            )}
          </Button>
        </form>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-zinc-500">
          <Shield className="h-4 w-4" />
          <span>Acceso restringido al personal autorizado</span>
        </div>
      </div>
    </div>
  )
}
