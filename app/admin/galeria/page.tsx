"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import {
  Plus,
  Search,
  Trash2,
  Star,
  Eye,
  EyeOff,
  MoreVertical,
  X,
  Check,
  AlertCircle,
  ImageIcon,
  FolderOpen
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { getGaleria, createImagen, deleteImagen, toggleImagenPublicada, toggleImagenDestacada } from "@/lib/supabase/galeria"
import { ImageUploadField } from "@/components/admin/image-upload-field"

interface GaleriaItem {
  id: string
  titulo: string
  descripcion: string | null
  imagen_url: string
  album: string | null
  destacada: boolean
  publicada: boolean
  created_at: string
}

export default function AdminGaleriaPage() {
  const [galeria, setGaleria] = useState<GaleriaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [albumFilter, setAlbumFilter] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    album: "",
    imagen_url: ""
  })

  useEffect(() => {
    loadGaleria()
  }, [])

  async function loadGaleria() {
    try {
      const data = await getGaleria()
      setGaleria(data)
    } catch (err) {
      console.error("Error loading galeria:", err)
      setGaleria([])
    } finally {
      setLoading(false)
    }
  }

  // Get unique albums
  const albums = [...new Set(galeria.map(item => item.album).filter(Boolean))]

  // Filter galeria
  const filteredGaleria = galeria.filter(item => {
    const matchesSearch = item.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.descripcion?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesAlbum = !albumFilter || item.album === albumFilter
    return matchesSearch && matchesAlbum
  })

  function closeModal() {
    setShowModal(false)
    setFormData({ titulo: "", descripcion: "", album: "", imagen_url: "" })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formData.imagen_url) {
      setError("Sube una imagen")
      return
    }
    setSubmitting(true)
    setError(null)

    try {
      const newImage = await createImagen({
        titulo: formData.titulo,
        descripcion: formData.descripcion || null,
        imagen_url: formData.imagen_url,
        album: formData.album || null,
        publicada: true,
        destacada: false
      })

      setGaleria([newImage, ...galeria])
      closeModal()
      setSuccess("Imagen añadida correctamente")
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al añadir imagen")
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Estás seguro de eliminar esta imagen?")) return

    try {
      await deleteImagen(id)
      setGaleria(galeria.filter(item => item.id !== id))
      setSuccess("Imagen eliminada correctamente")
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al eliminar imagen")
    }
  }

  async function handleTogglePublicada(id: string, currentValue: boolean) {
    try {
      await toggleImagenPublicada(id, !currentValue)
      setGaleria(galeria.map(item => 
        item.id === id ? { ...item, publicada: !currentValue } : item
      ))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar imagen")
    }
  }

  async function handleToggleDestacada(id: string, currentValue: boolean) {
    try {
      await toggleImagenDestacada(id, !currentValue)
      setGaleria(galeria.map(item => 
        item.id === id ? { ...item, destacada: !currentValue } : item
      ))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar imagen")
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-zinc-900">
            Galería
          </h1>
          <p className="text-zinc-600 mt-1">
            Gestiona las imágenes y álbumes del club
          </p>
        </div>
        <Button 
          onClick={() => setShowModal(true)}
          className="bg-primary hover:bg-primary/90 gap-2"
        >
          <Plus className="w-4 h-4" />
          Nueva Imagen
        </Button>
      </div>

      {/* Alerts */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl"
        >
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error}
          <button onClick={() => setError(null)} className="ml-auto">
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl"
        >
          <Check className="w-5 h-5 shrink-0" />
          {success}
        </motion.div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-400" />
          <Input
            placeholder="Buscar imágenes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={albumFilter === null ? "default" : "outline"}
            size="sm"
            onClick={() => setAlbumFilter(null)}
          >
            Todas
          </Button>
          {albums.map(album => (
            <Button
              key={album}
              variant={albumFilter === album ? "default" : "outline"}
              size="sm"
              onClick={() => setAlbumFilter(album as string)}
            >
              {album}
            </Button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-zinc-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-900">{galeria.length}</p>
              <p className="text-sm text-zinc-600">Total</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-900">{galeria.filter(g => g.publicada).length}</p>
              <p className="text-sm text-zinc-600">Publicadas</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-900">{galeria.filter(g => g.destacada).length}</p>
              <p className="text-sm text-zinc-600">Destacadas</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <FolderOpen className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-900">{albums.length}</p>
              <p className="text-sm text-zinc-600">Álbumes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-square bg-zinc-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filteredGaleria.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-zinc-200">
          <ImageIcon className="w-12 h-12 text-zinc-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-zinc-900 mb-2">No hay imágenes</h3>
          <p className="text-zinc-600 mb-4">Añade la primera imagen a la galería</p>
          <Button onClick={() => setShowModal(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Nueva Imagen
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredGaleria.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group relative bg-white rounded-xl border border-zinc-200 overflow-hidden"
            >
              <div className="aspect-square relative bg-zinc-100">
                <Image
                  src={item.imagen_url}
                  alt={item.titulo}
                  fill
                  className="object-contain"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleDestacada(item.id, item.destacada)}
                      className={`p-2 rounded-lg transition-colors ${
                        item.destacada ? "bg-amber-500 text-white" : "bg-white/90 text-zinc-700 hover:bg-white"
                      }`}
                      title={item.destacada ? "Quitar destacado" : "Destacar"}
                    >
                      <Star className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleTogglePublicada(item.id, item.publicada)}
                      className={`p-2 rounded-lg transition-colors ${
                        item.publicada ? "bg-green-500 text-white" : "bg-white/90 text-zinc-700 hover:bg-white"
                      }`}
                      title={item.publicada ? "Ocultar" : "Publicar"}
                    >
                      {item.publicada ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 bg-white/90 text-red-600 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {/* Badges */}
                <div className="absolute top-2 left-2 flex gap-1">
                  {item.destacada && (
                    <span className="bg-amber-500 text-white text-xs px-2 py-1 rounded-full">
                      Destacada
                    </span>
                  )}
                  {!item.publicada && (
                    <span className="bg-zinc-500 text-white text-xs px-2 py-1 rounded-full">
                      Oculta
                    </span>
                  )}
                </div>
              </div>
              <div className="p-3">
                <h3 className="font-medium text-zinc-900 truncate">{item.titulo}</h3>
                {item.album && (
                  <p className="text-sm text-zinc-500">{item.album}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal Nueva Imagen */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between p-6 border-b border-zinc-200">
              <h2 className="text-xl font-heading font-bold">Nueva Imagen</h2>
              <button
                onClick={closeModal}
                className="p-2 text-zinc-400 hover:text-zinc-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="titulo">Título *</Label>
                <Input
                  id="titulo"
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  placeholder="Título de la imagen"
                  required
                />
              </div>
              <ImageUploadField
                id="archivo"
                label="Imagen"
                value={formData.imagen_url}
                onChange={(url) => setFormData({ ...formData, imagen_url: url })}
                carpeta="fotos"
                required
              />
              <div className="space-y-2">
                <Label htmlFor="album">Álbum</Label>
                <Input
                  id="album"
                  value={formData.album}
                  onChange={(e) => setFormData({ ...formData, album: e.target.value })}
                  placeholder="Ej: Temporada 2025-26, Instalaciones..."
                  list="albums-list"
                />
                <datalist id="albums-list">
                  {albums.map(album => (
                    <option key={album} value={album as string} />
                  ))}
                </datalist>
              </div>
              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  placeholder="Descripción opcional de la imagen"
                  rows={3}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeModal}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  {submitting ? "Guardando..." : "Guardar"}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
