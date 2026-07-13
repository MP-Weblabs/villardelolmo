"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  ArrowLeft,
  Save,
  Eye,
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react"
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

export default function NuevaNoticiaPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    titulo: "",
    extracto: "",
    contenido: "",
    publicada: false,
    destacada: false,
    imagen_principal: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const supabase = createClient()
      
      const slug = generateSlug(formData.titulo)
      
      const { error: insertError } = await supabase
        .from("noticias")
        .insert({
          titulo: formData.titulo,
          slug: slug,
          extracto: formData.extracto || null,
          contenido: formData.contenido,
          publicada: formData.publicada,
          destacada: formData.destacada,
          imagen_principal: formData.imagen_principal || null,
          fecha_publicacion: formData.publicada
            ? new Date().toISOString().split("T")[0]
            : null
        })

      if (insertError) throw insertError

      setSaved(true)
      setTimeout(() => {
        router.push("/admin/noticias")
      }, 1500)
    } catch (err) {
      console.log("[v0] Error creating noticia:", err)
      setError(err instanceof Error ? err.message : "Error al guardar la noticia")
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
          <Link href="/admin/noticias">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-heading font-bold text-zinc-900">Nueva Noticia</h1>
            <p className="text-zinc-600">Crea una nueva noticia para el sitio</p>
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
          <span className="text-green-800 font-medium">Noticia guardada correctamente. Redirigiendo...</span>
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
                  {saving ? "Guardando..." : "Guardar"}
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
