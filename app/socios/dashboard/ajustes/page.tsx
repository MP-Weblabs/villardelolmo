"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updatePassword } from "@/lib/supabase/auth-client"
import { ArrowLeft, CheckCircle, AlertCircle, Loader2, Shield } from "lucide-react"

export default function AjustesSocioPage() {
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [updating, setUpdating] = useState(false)
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null)

  const handleUpdatePassword = async () => {
    setMessage(null)
    if (newPassword.length < 8) {
      setMessage({ type: "error", text: "La nueva contraseña debe tener al menos 8 caracteres." })
      return
    }
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Las contraseñas no coinciden." })
      return
    }
    setUpdating(true)
    try {
      await updatePassword(newPassword)
      setMessage({ type: "ok", text: "Contraseña actualizada correctamente." })
      setNewPassword("")
      setConfirmPassword("")
    } catch {
      setMessage({ type: "error", text: "No se ha podido actualizar la contraseña." })
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/socios/dashboard/perfil">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-heading font-bold">Ajustes</h1>
          <p className="text-muted-foreground">Gestiona la seguridad de tu cuenta</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-2xl border border-border p-6 md:p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-5 h-5 text-primary" />
          <h2 className="font-heading font-bold text-lg">Cambiar contraseña</h2>
        </div>

        {message && (
          <div
            className={`mb-4 p-3 rounded-lg text-sm flex items-center gap-2 ${
              message.type === "ok"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {message.type === "ok" ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {message.text}
          </div>
        )}

        <div className="max-w-md space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newPassword">Nueva contraseña</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="h-12"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="h-12"
            />
          </div>
          <Button onClick={handleUpdatePassword} disabled={updating} className="bg-primary hover:bg-primary/90">
            {updating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Actualizar contraseña
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
