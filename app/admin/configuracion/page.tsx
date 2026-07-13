"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createBrowserClient } from "@/lib/supabase/client"
import { updatePassword } from "@/lib/supabase/auth-client"
import {
  Settings,
  Globe,
  Mail,
  Bell,
  Shield,
  Palette,
  Save,
  CheckCircle,
  Upload,
  Loader2,
  AlertCircle
} from "lucide-react"

type Config = {
  nombreClub: string
  abreviatura: string
  fundacion: string
  cif: string
  descripcion: string
  email: string
  telefono: string
  direccion: string
  horario: string
  facebook: string
  instagram: string
  twitter: string
  youtube: string
}

const DEFAULTS: Config = {
  nombreClub: "C.D. Unión Deportiva Villar del Olmo",
  abreviatura: "UD Villar",
  fundacion: "1970",
  cif: "",
  descripcion: "Club de fútbol de Villar del Olmo, Madrid.",
  email: "",
  telefono: "",
  direccion: "",
  horario: "",
  facebook: "",
  instagram: "",
  twitter: "",
  youtube: "",
}

export default function AdminConfiguracionPage() {
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("general")
  const [config, setConfig] = useState<Config>(DEFAULTS)

  useEffect(() => {
    const fetchConfig = async () => {
      const supabase = createBrowserClient()
      const { data } = await supabase.from("configuracion_web").select("clave, valor").eq("clave", "sitio")
      const row = data?.[0]
      if (row?.valor) {
        try {
          setConfig({ ...DEFAULTS, ...JSON.parse(row.valor) })
        } catch {
          // Configuración guardada con un formato antiguo/inválido: se ignora y se usan los valores por defecto.
        }
      }
      setLoading(false)
    }
    fetchConfig()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setSaveError(null)
    try {
      const supabase = createBrowserClient()
      const { error } = await supabase
        .from("configuracion_web")
        .upsert({ clave: "sitio", valor: JSON.stringify(config), descripcion: "Configuración general del sitio web" }, { onConflict: "clave" })

      if (error) throw error
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setSaveError("No se ha podido guardar la configuración.")
    } finally {
      setSaving(false)
    }
  }

  const update = (field: keyof Config, value: string) => setConfig((c) => ({ ...c, [field]: value }))

  const tabs = [
    { id: "general", label: "General", icon: Settings },
    { id: "contacto", label: "Contacto", icon: Mail },
    { id: "redes", label: "Redes Sociales", icon: Globe },
    { id: "notificaciones", label: "Notificaciones", icon: Bell },
    { id: "seguridad", label: "Seguridad", icon: Shield },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-zinc-900">Configuración</h1>
          <p className="text-zinc-600">Ajustes generales del sitio web</p>
        </div>
        {activeTab !== "seguridad" && (
          <Button onClick={handleSave} disabled={saving} className="bg-primary hover:bg-primary/90 gap-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Guardar cambios
          </Button>
        )}
      </motion.div>

      {saved && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-green-800 font-medium">Configuración guardada correctamente</span>
        </motion.div>
      )}
      {saveError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <span className="text-red-800 font-medium">{saveError}</span>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-xl border border-zinc-200 p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id ? "bg-primary text-white" : "text-zinc-600 hover:bg-zinc-50"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex-1">
          {activeTab === "general" && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-zinc-200 p-6">
                <h2 className="font-heading font-bold text-lg mb-6">Información del Club</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombreClub">Nombre del club</Label>
                    <Input id="nombreClub" value={config.nombreClub} onChange={(e) => update("nombreClub", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="abreviatura">Abreviatura</Label>
                    <Input id="abreviatura" value={config.abreviatura} onChange={(e) => update("abreviatura", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fundacion">Año de fundación</Label>
                    <Input id="fundacion" value={config.fundacion} onChange={(e) => update("fundacion", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cif">CIF</Label>
                    <Input id="cif" value={config.cif} onChange={(e) => update("cif", e.target.value)} />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="descripcion">Descripción</Label>
                    <textarea
                      id="descripcion"
                      className="w-full px-3 py-2 rounded-lg border border-zinc-200 h-24 resize-none"
                      value={config.descripcion}
                      onChange={(e) => update("descripcion", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-zinc-200 p-6">
                <h2 className="font-heading font-bold text-lg mb-6">Logo y Colores</h2>
                <p className="text-sm text-zinc-500 mb-4">
                  La subida de logo y selección de colores aún no está implementada. El logo y colores
                  actuales se gestionan directamente en el código del proyecto.
                </p>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <Label className="mb-3 block">Logo del club</Label>
                    <div className="border-2 border-dashed border-zinc-200 rounded-xl p-6 text-center">
                      <div className="w-20 h-20 bg-primary/10 rounded-xl mx-auto flex items-center justify-center">
                        <Palette className="w-8 h-8 text-primary" />
                      </div>
                      <Button variant="outline" size="sm" className="mt-4 gap-2" disabled>
                        <Upload className="w-4 h-4" />
                        Próximamente
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "contacto" && (
            <div className="bg-white rounded-xl border border-zinc-200 p-6">
              <h2 className="font-heading font-bold text-lg mb-6">Información de Contacto</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={config.email} onChange={(e) => update("email", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input id="telefono" value={config.telefono} onChange={(e) => update("telefono", e.target.value)} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="direccion">Dirección</Label>
                  <Input id="direccion" value={config.direccion} onChange={(e) => update("direccion", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="horario">Horario de atención</Label>
                  <Input id="horario" value={config.horario} onChange={(e) => update("horario", e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {activeTab === "redes" && (
            <div className="bg-white rounded-xl border border-zinc-200 p-6">
              <h2 className="font-heading font-bold text-lg mb-6">Redes Sociales</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input id="facebook" placeholder="https://facebook.com/..." value={config.facebook} onChange={(e) => update("facebook", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input id="instagram" placeholder="https://instagram.com/..." value={config.instagram} onChange={(e) => update("instagram", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter / X</Label>
                  <Input id="twitter" placeholder="https://twitter.com/..." value={config.twitter} onChange={(e) => update("twitter", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="youtube">YouTube</Label>
                  <Input id="youtube" placeholder="https://youtube.com/..." value={config.youtube} onChange={(e) => update("youtube", e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {activeTab === "notificaciones" && (
            <div className="bg-white rounded-xl border border-zinc-200 p-6">
              <h2 className="font-heading font-bold text-lg mb-6">Notificaciones</h2>
              <p className="text-sm text-zinc-500 mb-4">
                El envío de notificaciones por email todavía no está implementado. Estos interruptores
                no tienen efecto por ahora.
              </p>
              <div className="space-y-4 opacity-60 pointer-events-none">
                {[
                  { label: "Nuevo socio registrado", desc: "Recibe una notificación cuando un nuevo socio se registre" },
                  { label: "Mensajes de contacto", desc: "Alertas de mensajes nuevos sin leer" },
                  { label: "Resumen semanal", desc: "Recibe un resumen semanal de actividad" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-zinc-50 rounded-xl">
                    <div>
                      <p className="font-medium">{item.label}</p>
                      <p className="text-sm text-zinc-500">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" disabled />
                      <div className="w-11 h-6 bg-zinc-200 rounded-full peer after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "seguridad" && <SeguridadTab />}
        </motion.div>
      </div>
    </div>
  )
}

function SeguridadTab() {
  const [currentPassword, setCurrentPassword] = useState("")
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
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (err) {
      setMessage({ type: "error", text: "No se ha podido actualizar la contraseña." })
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-zinc-200 p-6">
        <h2 className="font-heading font-bold text-lg mb-6">Cambiar Contraseña</h2>

        {message && (
          <div className={`mb-4 p-3 rounded-lg text-sm flex items-center gap-2 ${
            message.type === "ok" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
          }`}>
            {message.type === "ok" ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {message.text}
          </div>
        )}

        <div className="max-w-md space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newPassword">Nueva contraseña</Label>
            <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
            <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          </div>
          <Button onClick={handleUpdatePassword} disabled={updating} className="bg-primary hover:bg-primary/90">
            {updating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Actualizar contraseña
          </Button>
        </div>
      </div>
    </div>
  )
}
