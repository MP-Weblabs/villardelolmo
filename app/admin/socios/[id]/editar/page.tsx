"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  ArrowLeft,
  User,
  Mail,
  Shield,
  CreditCard,
  Save,
  CheckCircle,
  AlertCircle,
  Loader2,
  Trash2,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"

const tipos = ["Infantil", "Juvenil", "Adulto", "Veterano", "Honorario"] as const
const estados = ["activo", "pendiente", "inactivo", "baja"] as const
const formasPago = ["domiciliacion", "transferencia", "efectivo"] as const

export default function EditarSocioPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    email: "",
    telefono: "",
    dni: "",
    direccion: "",
    codigo_postal: "",
    localidad: "",
    fecha_nacimiento: "",
    tipo: "Adulto" as (typeof tipos)[number],
    estado: "activo" as (typeof estados)[number],
    forma_pago: "domiciliacion" as (typeof formasPago)[number],
    notas: "",
  })

  useEffect(() => {
    async function loadSocio() {
      const supabase = createClient()
      const { data: socio, error: fetchError } = await supabase.from("socios").select("*").eq("id", id).single()

      if (fetchError || !socio) {
        setError("No se ha podido cargar el socio")
        setLoading(false)
        return
      }

      setFormData({
        nombre: socio.nombre,
        apellidos: socio.apellidos,
        email: socio.email,
        telefono: socio.telefono || "",
        dni: socio.dni || "",
        direccion: socio.direccion || "",
        codigo_postal: socio.codigo_postal || "",
        localidad: socio.localidad || "",
        fecha_nacimiento: socio.fecha_nacimiento || "",
        tipo: socio.tipo,
        estado: socio.estado,
        forma_pago: socio.forma_pago || "domiciliacion",
        notas: socio.notas || "",
      })
      setLoading(false)
    }
    loadSocio()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const supabase = createClient()
      const { error: updateError } = await supabase
        .from("socios")
        .update({
          nombre: formData.nombre,
          apellidos: formData.apellidos,
          email: formData.email,
          telefono: formData.telefono || null,
          dni: formData.dni || null,
          direccion: formData.direccion || null,
          codigo_postal: formData.codigo_postal || null,
          localidad: formData.localidad || null,
          fecha_nacimiento: formData.fecha_nacimiento || null,
          tipo: formData.tipo,
          estado: formData.estado,
          forma_pago: formData.forma_pago,
          notas: formData.notas || null,
        })
        .eq("id", id)

      if (updateError) throw updateError

      setSaved(true)
      setTimeout(() => router.push(`/admin/socios/${id}`), 1200)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar los cambios")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("¿Seguro que quieres eliminar este socio? Esta acción no se puede deshacer.")) return
    const supabase = createClient()
    const { error: deleteError } = await supabase.from("socios").delete().eq("id", id)
    if (deleteError) {
      alert("No se ha podido eliminar el socio")
      return
    }
    router.push("/admin/socios")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
        <Link href={`/admin/socios/${id}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-heading font-bold text-zinc-900">Editar Socio</h1>
          <p className="text-zinc-600">Actualiza los datos del socio</p>
        </div>
      </motion.div>

      {saved && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-green-800 font-medium">Cambios guardados. Redirigiendo...</span>
        </motion.div>
      )}

      {error && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <span className="text-red-800 font-medium">{error}</span>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl border border-zinc-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="font-heading font-bold text-lg">Datos Personales</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre *</Label>
              <Input id="nombre" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apellidos">Apellidos *</Label>
              <Input id="apellidos" value={formData.apellidos} onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dni">DNI/NIE</Label>
              <Input id="dni" value={formData.dni} onChange={(e) => setFormData({ ...formData, dni: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fecha_nacimiento">Fecha de nacimiento</Label>
              <Input id="fecha_nacimiento" type="date" value={formData.fecha_nacimiento} onChange={(e) => setFormData({ ...formData, fecha_nacimiento: e.target.value })} />
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl border border-zinc-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="font-heading font-bold text-lg">Contacto</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input id="telefono" value={formData.telefono} onChange={(e) => setFormData({ ...formData, telefono: e.target.value })} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="direccion">Dirección</Label>
              <Input id="direccion" value={formData.direccion} onChange={(e) => setFormData({ ...formData, direccion: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="codigo_postal">Código Postal</Label>
              <Input id="codigo_postal" value={formData.codigo_postal} onChange={(e) => setFormData({ ...formData, codigo_postal: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="localidad">Localidad</Label>
              <Input id="localidad" value={formData.localidad} onChange={(e) => setFormData({ ...formData, localidad: e.target.value })} />
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-xl border border-zinc-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="font-heading font-bold text-lg">Tipo y Estado</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de socio</Label>
              <select
                id="tipo"
                value={formData.tipo}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value as typeof formData.tipo })}
                className="w-full h-10 px-3 rounded-lg border border-zinc-200 text-sm bg-white"
              >
                {tipos.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <select
                id="estado"
                value={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value as typeof formData.estado })}
                className="w-full h-10 px-3 rounded-lg border border-zinc-200 text-sm bg-white"
              >
                {estados.map((e) => (
                  <option key={e} value={e}>{e}</option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-xl border border-zinc-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-orange-600" />
            </div>
            <h2 className="font-heading font-bold text-lg">Pago y Notas</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="forma_pago">Método de pago</Label>
              <select
                id="forma_pago"
                value={formData.forma_pago}
                onChange={(e) => setFormData({ ...formData, forma_pago: e.target.value as typeof formData.forma_pago })}
                className="w-full h-10 px-3 rounded-lg border border-zinc-200 text-sm bg-white"
              >
                {formasPago.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="notas">Notas internas</Label>
              <Input id="notas" value={formData.notas} onChange={(e) => setFormData({ ...formData, notas: e.target.value })} />
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex justify-between gap-3">
          <Button type="button" variant="outline" className="gap-2 text-red-600 border-red-200 hover:bg-red-50" onClick={handleDelete}>
            <Trash2 className="w-4 h-4" /> Eliminar socio
          </Button>
          <div className="flex gap-3">
            <Link href={`/admin/socios/${id}`}>
              <Button variant="outline" type="button" disabled={saving}>Cancelar</Button>
            </Link>
            <Button type="submit" className="bg-primary hover:bg-primary/90 gap-2" disabled={saving || saved}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </motion.div>
      </form>
    </div>
  )
}
