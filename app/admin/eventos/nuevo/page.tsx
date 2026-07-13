"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { ImageUploadField } from "@/components/admin/image-upload-field"

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

export default function NuevoEventoPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    descripcion_larga: "",
    publicado: false,
    imagen_url: "",
    fecha_inicio: "",
    fecha_fin: "",
    lugar: "",
    precio: "",
    capacidad: "",
    inscripcion_requerida: false,
    url_inscripcion: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    if (!formData.titulo || !formData.fecha_inicio) {
      setError("El título y la fecha de inicio son obligatorios")
      setSaving(false)
      return
    }

    try {
      const supabase = createClient()

      const slug = `${generateSlug(formData.titulo)}-${Date.now().toString(36)}`

      const { error: insertError } = await supabase.from("eventos").insert({
        titulo: formData.titulo,
        slug,
        descripcion: formData.descripcion || null,
        descripcion_larga: formData.descripcion_larga || null,
        publicado: formData.publicado,
        imagen_url: formData.imagen_url || null,
        fecha_inicio: new Date(formData.fecha_inicio).toISOString(),
        fecha_fin: formData.fecha_fin ? new Date(formData.fecha_fin).toISOString() : null,
        lugar: formData.lugar || null,
        precio: formData.precio ? parseFloat(formData.precio) : null,
        capacidad: formData.capacidad ? parseInt(formData.capacidad) : null,
        inscripcion_requerida: formData.inscripcion_requerida,
        url_inscripcion: formData.url_inscripcion || null,
      })

      if (insertError) throw insertError

      setSaved(true)
      setTimeout(() => {
        router.push("/admin/eventos")
      }, 1200)
    } catch (err) {
      console.log("[v0] Error creating evento:", err)
      setError(err instanceof Error ? err.message : "Error al guardar el evento")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <Link href="/admin/eventos">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-heading font-bold text-zinc-900">Nuevo Evento</h1>
            <p className="text-zinc-600">Visible solo para socios con sesión iniciada</p>
          </div>
        </div>
      </motion.div>

      {/* Success */}
      {saved && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3"
        >
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-green-800 font-medium">Evento guardado correctamente. Redirigiendo...</span>
        </motion.div>
      )}

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3"
        >
          <AlertCircle className="w-5 h-5 text-red-600" />
          <span className="text-red-800 font-medium">{error}</span>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Título y descripciones */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl border border-zinc-200 p-6"
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="titulo">Título *</Label>
                  <Input
                    id="titulo"
                    value={formData.titulo}
                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                    placeholder="Ej: Cena de fin de temporada"
                    className="text-lg"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="descripcion">Descripción breve</Label>
                  <Input
                    id="descripcion"
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    placeholder="Breve resumen del evento"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="descripcion_larga">Descripción larga</Label>
                  <textarea
                    id="descripcion_larga"
                    value={formData.descripcion_larga}
                    onChange={(e) => setFormData({ ...formData, descripcion_larga: e.target.value })}
                    placeholder="Detalles completos del evento..."
                    className="w-full h-40 px-3 py-2 rounded-lg border border-zinc-200 resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>
            </motion.div>

            {/* Detalles */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl border border-zinc-200 p-6"
            >
              <h3 className="font-heading font-bold mb-4">Detalles del evento</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fecha_inicio">Fecha inicio *</Label>
                    <Input
                      id="fecha_inicio"
                      type="datetime-local"
                      value={formData.fecha_inicio}
                      onChange={(e) => setFormData({ ...formData, fecha_inicio: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fecha_fin">Fecha fin</Label>
                    <Input
                      id="fecha_fin"
                      type="datetime-local"
                      value={formData.fecha_fin}
                      onChange={(e) => setFormData({ ...formData, fecha_fin: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lugar">Lugar</Label>
                  <Input
                    id="lugar"
                    value={formData.lugar}
                    onChange={(e) => setFormData({ ...formData, lugar: e.target.value })}
                    placeholder="Ej: Campo Municipal de Villar del Olmo"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="precio">Precio (€)</Label>
                    <Input
                      id="precio"
                      type="number"
                      step="0.01"
                      value={formData.precio}
                      onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capacidad">Capacidad</Label>
                    <Input
                      id="capacidad"
                      type="number"
                      value={formData.capacidad}
                      onChange={(e) => setFormData({ ...formData, capacidad: e.target.value })}
                      placeholder="Número de plazas"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Inscripción */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl border border-zinc-200 p-6"
            >
              <h3 className="font-heading font-bold mb-4">Inscripción</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="inscripcion_requerida"
                    checked={formData.inscripcion_requerida}
                    onChange={(e) => setFormData({ ...formData, inscripcion_requerida: e.target.checked })}
                    className="rounded border-zinc-300"
                  />
                  <Label htmlFor="inscripcion_requerida" className="text-sm cursor-pointer">
                    Se requiere inscripción
                  </Label>
                </div>
                {formData.inscripcion_requerida && (
                  <div className="space-y-2">
                    <Label htmlFor="url_inscripcion">URL de inscripción</Label>
                    <Input
                      id="url_inscripcion"
                      type="url"
                      value={formData.url_inscripcion}
                      onChange={(e) => setFormData({ ...formData, url_inscripcion: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publicar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl border border-zinc-200 p-6"
            >
              <h3 className="font-heading font-bold mb-4">Publicar</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Estado</Label>
                  <select
                    value={formData.publicado ? "publicado" : "borrador"}
                    onChange={(e) => setFormData({ ...formData, publicado: e.target.value === "publicado" })}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm"
                  >
                    <option value="borrador">Borrador</option>
                    <option value="publicado">Publicado</option>
                  </select>
                </div>
                <p className="text-xs text-zinc-500">
                  Este evento solo será visible para socios con sesión iniciada. No aparece en ninguna
                  página pública del sitio.
                </p>
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 gap-2" disabled={saving || saved}>
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? "Guardando..." : "Guardar"}
                </Button>
              </div>
            </motion.div>

            {/* Imagen */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl border border-zinc-200 p-6"
            >
              <h3 className="font-heading font-bold mb-4">Imagen</h3>
              <ImageUploadField
                label=""
                value={formData.imagen_url}
                onChange={(url) => setFormData({ ...formData, imagen_url: url })}
                carpeta="eventos"
              />
            </motion.div>
          </div>
        </div>
      </form>
    </div>
  )
}
