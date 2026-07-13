"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save, CheckCircle, AlertCircle, Loader2, Shield, Trash2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { ImageUploadField } from "@/components/admin/image-upload-field"
import type { Database } from "@/lib/database.types"

type CategoriaEquipo = Database["public"]["Tables"]["categorias_equipo"]["Row"]

export default function EditarEquipoPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [categorias, setCategorias] = useState<CategoriaEquipo[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    nombre: "",
    categoria_id: "",
    temporada: "",
    entrenador: "",
    delegado: "",
    grupo_liga: "",
    descripcion: "",
    imagen_url: "",
    activo: true,
  })

  useEffect(() => {
    async function loadData() {
      const supabase = createClient()
      const [{ data: cats }, { data: equipo, error: fetchError }] = await Promise.all([
        supabase.from("categorias_equipo").select("*").order("orden"),
        supabase.from("equipos").select("*").eq("id", id).single(),
      ])

      setCategorias(cats || [])

      if (fetchError || !equipo) {
        setError("No se ha podido cargar el equipo")
        setLoading(false)
        return
      }

      setFormData({
        nombre: equipo.nombre,
        categoria_id: equipo.categoria_id,
        temporada: equipo.temporada,
        entrenador: equipo.entrenador || "",
        delegado: equipo.delegado || "",
        grupo_liga: equipo.grupo_liga || "",
        descripcion: equipo.descripcion || "",
        imagen_url: equipo.imagen_url || "",
        activo: equipo.activo,
      })
      setLoading(false)
    }
    loadData()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const supabase = createClient()
      const { error: updateError } = await supabase
        .from("equipos")
        .update({
          nombre: formData.nombre,
          categoria_id: formData.categoria_id,
          temporada: formData.temporada,
          entrenador: formData.entrenador || null,
          delegado: formData.delegado || null,
          grupo_liga: formData.grupo_liga || null,
          descripcion: formData.descripcion || null,
          imagen_url: formData.imagen_url || null,
          activo: formData.activo,
        })
        .eq("id", id)

      if (updateError) throw updateError

      setSaved(true)
      setTimeout(() => router.push(`/admin/equipos/${id}`), 1200)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar los cambios")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("¿Seguro que quieres eliminar este equipo? Esta acción no se puede deshacer.")) return
    const supabase = createClient()
    const { error: deleteError } = await supabase.from("equipos").delete().eq("id", id)
    if (deleteError) {
      alert("No se ha podido eliminar el equipo")
      return
    }
    router.push("/admin/equipos")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
        <Link href={`/admin/equipos/${id}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-heading font-bold text-zinc-900">Editar Equipo</h1>
          <p className="text-zinc-600">Actualiza los datos del equipo</p>
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
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="font-heading font-bold text-lg">Datos del Equipo</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre *</Label>
              <Input id="nombre" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="categoria">Categoría *</Label>
              <select
                id="categoria"
                value={formData.categoria_id}
                onChange={(e) => setFormData({ ...formData, categoria_id: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-zinc-200 text-sm bg-white"
                required
              >
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="temporada">Temporada *</Label>
              <Input id="temporada" value={formData.temporada} onChange={(e) => setFormData({ ...formData, temporada: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="grupo_liga">Grupo / Liga</Label>
              <Input id="grupo_liga" value={formData.grupo_liga} onChange={(e) => setFormData({ ...formData, grupo_liga: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="entrenador">Entrenador</Label>
              <Input id="entrenador" value={formData.entrenador} onChange={(e) => setFormData({ ...formData, entrenador: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="delegado">Delegado</Label>
              <Input id="delegado" value={formData.delegado} onChange={(e) => setFormData({ ...formData, delegado: e.target.value })} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <ImageUploadField
                id="imagen_url"
                label="Imagen del equipo"
                value={formData.imagen_url}
                onChange={(url) => setFormData({ ...formData, imagen_url: url })}
                carpeta="equipos"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea id="descripcion" value={formData.descripcion} onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })} rows={3} />
            </div>
            <div className="flex items-center gap-2 sm:col-span-2">
              <input
                id="activo"
                type="checkbox"
                checked={formData.activo}
                onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                className="rounded border-zinc-300"
              />
              <Label htmlFor="activo">Equipo activo (visible en la web pública)</Label>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex justify-between gap-3">
          <Button type="button" variant="outline" className="gap-2 text-red-600 border-red-200 hover:bg-red-50" onClick={handleDelete}>
            <Trash2 className="w-4 h-4" /> Eliminar equipo
          </Button>
          <div className="flex gap-3">
            <Link href={`/admin/equipos/${id}`}>
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
