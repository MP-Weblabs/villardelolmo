"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Loader2
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { ImagePlaceholder } from "@/components/image-placeholder"
import type { Database } from "@/lib/database.types"

type Noticia = Database["public"]["Tables"]["noticias"]["Row"]

export default function AdminNoticiasPage() {
  const [noticias, setNoticias] = useState<Noticia[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [menuOpen, setMenuOpen] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    fetchNoticias()
  }, [])

  async function fetchNoticias() {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("noticias")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setNoticias(data || [])
    } catch (error) {
      console.log("[v0] Error fetching noticias:", error)
    } finally {
      setLoading(false)
    }
  }

  async function deleteNoticia(id: string) {
    if (!confirm("¿Estás seguro de eliminar esta noticia?")) return
    
    setDeleting(id)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("noticias")
        .delete()
        .eq("id", id)

      if (error) throw error
      setNoticias(noticias.filter(n => n.id !== id))
    } catch (error) {
      console.log("[v0] Error deleting noticia:", error)
      alert("Error al eliminar la noticia")
    } finally {
      setDeleting(null)
      setMenuOpen(null)
    }
  }

  const noticiasFiltradas = noticias.filter(n => 
    n.titulo.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-heading font-bold text-zinc-900">Gestión de Noticias</h1>
          <p className="text-zinc-600">{noticias.length} noticias en total</p>
        </div>
        <Link href="/admin/noticias/nueva">
          <Button className="bg-primary hover:bg-primary/90 gap-2">
            <Plus className="w-4 h-4" />
            Nueva Noticia
          </Button>
        </Link>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative"
      >
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
        <Input
          placeholder="Buscar noticias..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-white"
        />
      </motion.div>

      {/* Grid */}
      {noticiasFiltradas.length === 0 ? (
        <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center text-zinc-500">
          No hay noticias. Crea la primera haciendo clic en "Nueva Noticia".
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 gap-6"
        >
          {noticiasFiltradas.map((noticia, index) => (
            <motion.div
              key={noticia.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white rounded-xl border border-zinc-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative h-48 bg-zinc-100">
                {noticia.imagen_principal ? (
                  <Image
                    src={noticia.imagen_principal}
                    alt={noticia.titulo}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <ImagePlaceholder />
                )}
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    noticia.publicada
                      ? "bg-green-100 text-green-700"
                      : "bg-zinc-100 text-zinc-700"
                  }`}>
                    {noticia.publicada ? "publicada" : "borrador"}
                  </span>
                  {noticia.destacada && (
                    <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-medium">
                      Destacada
                    </span>
                  )}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-heading font-bold text-lg line-clamp-2">{noticia.titulo}</h3>
                <p className="text-sm text-zinc-600 mt-2 line-clamp-2">{noticia.extracto}</p>
                
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-zinc-100">
                  <div className="flex items-center gap-4 text-sm text-zinc-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {noticia.fecha_publicacion 
                        ? new Date(noticia.fecha_publicacion).toLocaleDateString("es-ES")
                        : "Sin fecha"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Link href={`/noticias/${noticia.slug}`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Link href={`/admin/noticias/${noticia.id}/editar`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    <div className="relative">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => setMenuOpen(menuOpen === noticia.id ? null : noticia.id)}
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                      {menuOpen === noticia.id && (
                        <div className="absolute right-0 bottom-full mb-1 w-40 bg-white rounded-lg shadow-lg border border-zinc-200 py-1 z-10">
                          <button 
                            className="w-full px-4 py-2 text-left text-sm hover:bg-zinc-50 text-red-600 flex items-center gap-2"
                            onClick={() => deleteNoticia(noticia.id)}
                            disabled={deleting === noticia.id}
                          >
                            {deleting === noticia.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                            Eliminar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
