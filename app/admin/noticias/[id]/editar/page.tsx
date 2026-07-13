"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save, CheckCircle, AlertCircle, Loader2, Trash2 } from "lucide-react"
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

export default function EditarNoticiaPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [slug, setSlug] = useState("")
  const [formData, setFormData] = useState({
    titulo: "",
    extracto: "",
    contenido: "",
    publicada: false,
    destacada: false,
    imagen_principal: "",
  })

  useEffect(() => {
    async function loadNoticia() {
      const supabase = createClient()
      const { data: noticia, error: fetchError } = await supabase.from("noticias").select("*").eq("id", id).single()

      if (fetchError || !noticia) {
        setError("No se ha podido cargar la noticia")
        setLoading(false)
        return
      }

      setSlug(noticia.slug)
      setFormData({
        titulo: noticia.titulo,
        extracto: noticia.extracto || "",
        contenido: noticia.contenido,
        publicada: noticia.publicada,
        destacada: noticia.destacada,
        imagen_principal: noticia.imagen_principal || "",
      })
      setLoading(false)
    }
    loadNoticia()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    if (!formData.titulo || !formData.contenido) {
      setError("El título y el contenido son obligatorios")
      setSaving(false)
      return
    }

    try {
      const supabase = createClient()
      const newSlug = formData.titulo ? generateSlug(formData.titulo) : slug

      const { error: updateError } = await supabase
        .from("noticias")
        .update({
          titulo: formData.titulo,
          slug: newSlug,
          extracto: formData.extracto || null,
          contenido: formData.contenido,
          publicada: formData.publicada,
          destacada: formData.destacada,
          imagen_principal: formData.imagen_principal || null,
          fecha_publicacion: formData.publicada
            ? new Date().toISOString().split("T")[0]
            : null,
        })
        .eq("id", id)

      if (updateError) throw updateError

      setSaved(true)
      setTimeout(() => {
        router.push("/admin/noticias")
      }, 1200)
    } catch (err) {
      console.log("[v0] Error updating noticia:", err)
      setError(err instanceof Error ? err.message : "Error al guardar la noticia")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("¿Seguro que quieres eliminar esta noticia? Esta acción no se puede deshacer.")) return
    const supabase = createClient()
    const { error: deleteError } = await supabase.from("noticias").delete().eq("id", id)
    if (deleteError) {
      alert("No se ha podido eliminar la noticia")
      return
    }
    router.push("/admin/noticias")
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
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <Link href="/admin/noticias">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-heading font-bold text-zinc-900">Editar Noticia</h1>
            <p className="text-zinc-600">Modifica los datos de la noticia</p>
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
          <span className="text-green-800 font-medium">Noticia actualizada correctamente. Redirigiendo...</span>
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
            {/* Título */}
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
                    placeholder="Escribe el título de la noticia"
                    className="text-lg"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="extracto">Extracto</Label>
                  <Input
                    id="extracto"
                    value={formData.extracto}
                    onChange={(e) => setFormData({ ...formData, extracto: e.target.value })}
                    placeholder="Breve descripción de la noticia"
                  />
                </div>
              </div>
            </motion.div>

            {/* Contenido */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl border border-zinc-200 p-6"
            >
              <Label htmlFor="contenido" className="mb-4 block">Contenido *</Label>
              <textarea
                id="contenido"
                value={formData.contenido}
                onChange={(e) => setFormData({ ...formData, contenido: e.target.value })}
                placeholder="Escribe el contenido completo de la noticia..."
                className="w-full h-64 px-3 py-2 rounded-lg border border-zinc-200 resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                required
              />
              <p className="text-sm text-zinc-500 mt-2">Soporta formato Markdown</p>
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
                    value={formData.publicada ? "publicada" : "borrador"}
                    onChange={(e) => setFormData({ ...formData, publicada: e.target.value === "publicada" })}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm"
                  >
                    <option value="borrador">Borrador</option>
                    <option value="publicada">Publicada</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="destacada"
                    checked={formData.destacada}
                    onChange={(e) => setFormData({ ...formData, destacada: e.target.checked })}
                    className="rounded border-zinc-300"
                  />
                  <Label htmlFor="destacada" className="text-sm cursor-pointer">Marcar como destacada</Label>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 gap-2"
                  disabled={saving || saved}
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {saving ? "Guardando..." : "Guardar cambios"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50 gap-2"
                  onClick={handleDelete}
                  disabled={saving}
                >
                  <Trash2 className="w-4 h-4" />
                  Eliminar noticia
                </Button>
              </div>
            </motion.div>

            {/* Imagen destacada */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl border border-zinc-200 p-6"
            >
              <h3 className="font-heading font-bold mb-4">Imagen Destacada</h3>
              <ImageUploadField
                label=""
                value={formData.imagen_principal}
                onChange={(url) => setFormData({ ...formData, imagen_principal: url })}
                carpeta="noticias"
              />
            </motion.div>
          </div>
        </div>
      </form>
    </div>
  )
}
