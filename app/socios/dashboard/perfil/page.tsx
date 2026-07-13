"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSocio } from "@/lib/hooks/use-socio"
import { createBrowserClient } from "@/lib/supabase/client"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Save,
  Camera,
  Shield,
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react"

export default function PerfilSocioPage() {
  const { socio, loading, error, refetch } = useSocio()
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    email: "",
    telefono: "",
    direccion: "",
    fecha_nacimiento: "",
  })

  useEffect(() => {
    if (socio) {
      setFormData({
        nombre: socio.nombre || "",
        apellidos: socio.apellidos || "",
        email: socio.email || "",
        telefono: socio.telefono || "",
        direccion: socio.direccion || "",
        fecha_nacimiento: socio.fecha_nacimiento || "",
      })
    }
  }, [socio])

  const handleSave = async () => {
    if (!socio) return
    setSaving(true)
    setSaveError(null)
    try {
      const supabase = createBrowserClient()
      const { error: updateError } = await supabase
        .from("socios")
        .update({
          nombre: formData.nombre,
          apellidos: formData.apellidos,
          telefono: formData.telefono,
          direccion: formData.direccion,
          fecha_nacimiento: formData.fecha_nacimiento || null,
        })
        .eq("id", socio.id)

      if (updateError) throw updateError

      await refetch()
      setSaved(true)
      setIsEditing(false)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setSaveError("No se han podido guardar los cambios. Inténtalo de nuevo.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !socio) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
        <p className="text-red-700 font-medium">{error || "No se ha encontrado tu ficha de socio."}</p>
        <p className="text-sm text-muted-foreground mt-2">
          Si crees que es un error, contacta con la secretaría del club.
        </p>
      </div>
    )
  }

  const tipoSocioLabel: Record<string, string> = {
    Adulto: "Adulto",
    Juvenil: "Juvenil",
    Infantil: "Infantil",
    Veterano: "Veterano",
    Honorario: "Honorario",
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Mi Perfil</h1>
          <p className="text-muted-foreground mt-1">Gestiona tu información personal</p>
        </div>
        <div className="flex gap-3">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} className="bg-primary hover:bg-primary/90">
              Editar perfil
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false)
                  if (socio) {
                    setFormData({
                      nombre: socio.nombre || "",
                      apellidos: socio.apellidos || "",
                      email: socio.email || "",
                      telefono: socio.telefono || "",
                      direccion: socio.direccion || "",
                      fecha_nacimiento: socio.fecha_nacimiento || "",
                    })
                  }
                }}
                disabled={saving}
              >
                Cancelar
              </Button>
              <Button onClick={handleSave} className="bg-primary hover:bg-primary/90" disabled={saving}>
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Guardar cambios
              </Button>
            </>
          )}
        </div>
      </motion.div>

      {saved && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex items-center gap-3"
        >
          <CheckCircle className="w-5 h-5 text-primary" />
          <span className="text-primary font-medium">Cambios guardados correctamente</span>
        </motion.div>
      )}

      {saveError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-red-700 font-medium">{saveError}</span>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1"
        >
          <div className="bg-card rounded-2xl border border-border p-6 text-center">
            <div className="relative inline-block">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white text-4xl font-heading font-bold mx-auto">
                {formData.nombre[0]}{formData.apellidos[0]}
              </div>
              {isEditing && (
                <button
                  type="button"
                  title="Próximamente: subir foto"
                  className="absolute bottom-0 right-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white shadow-lg hover:bg-primary/90 transition-colors"
                >
                  <Camera className="w-5 h-5" />
                </button>
              )}
            </div>

            <h2 className="text-xl font-heading font-bold mt-4">
              {formData.nombre} {formData.apellidos}
            </h2>
            <p className="text-muted-foreground">Socio #{socio.numero_socio || "----"}</p>

            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex items-center justify-center gap-2 text-primary">
                <Shield className="w-5 h-5" />
                <span className="font-semibold">Socio {tipoSocioLabel[socio.tipo] || socio.tipo}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Miembro desde {new Date(socio.fecha_alta).toLocaleDateString("es-ES", {
                  month: "long",
                  year: "numeric"
                })}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <div className="bg-card rounded-2xl border border-border p-6 md:p-8">
            <h3 className="text-lg font-heading font-bold mb-6">Información Personal</h3>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="nombre" className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  Nombre
                </Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  disabled={!isEditing}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="apellidos" className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  Apellidos
                </Label>
                <Input
                  id="apellidos"
                  value={formData.apellidos}
                  onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                  disabled={!isEditing}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  Email
                </Label>
                <Input id="email" type="email" value={formData.email} disabled className="h-12 bg-muted/50" />
                <p className="text-xs text-muted-foreground">
                  El email de acceso no se puede cambiar aquí. Contacta con secretaría.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefono" className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  Teléfono
                </Label>
                <Input
                  id="telefono"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  disabled={!isEditing}
                  className="h-12"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="direccion" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  Dirección
                </Label>
                <Input
                  id="direccion"
                  value={formData.direccion}
                  onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                  disabled={!isEditing}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fechaNacimiento" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  Fecha de nacimiento
                </Label>
                <Input
                  id="fechaNacimiento"
                  type="date"
                  value={formData.fecha_nacimiento}
                  onChange={(e) => setFormData({ ...formData, fecha_nacimiento: e.target.value })}
                  disabled={!isEditing}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dni" className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-muted-foreground" />
                  DNI
                </Label>
                <Input id="dni" value={socio.dni || "No registrado"} disabled className="h-12 bg-muted/50" />
                <p className="text-xs text-muted-foreground">El DNI no se puede modificar</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card rounded-2xl border border-border p-6 md:p-8"
      >
        <h3 className="text-lg font-heading font-bold mb-6">Seguridad</h3>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-muted/30 rounded-xl">
          <div>
            <p className="font-medium">Contraseña</p>
            <p className="text-sm text-muted-foreground">Cambia tu contraseña de acceso</p>
          </div>
          <Button variant="outline" onClick={() => (window.location.href = "/socios/dashboard/ajustes")}>
            Cambiar contraseña
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
