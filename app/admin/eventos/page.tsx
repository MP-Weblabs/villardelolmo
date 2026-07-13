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
  Calendar,
  MapPin,
  Lock,
  Loader2
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { ImagePlaceholder } from "@/components/image-placeholder"
import type { Database } from "@/lib/database.types"

type Evento = Database["public"]["Tables"]["eventos"]["Row"]

export default function AdminEventosPage() {
  const [eventos, setEventos] = useState<Evento[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [menuOpen, setMenuOpen] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    fetchEventos()
  }, [])

  async function fetchEventos() {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("eventos")
        .select("*")
        .order("fecha_inicio", { ascending: false })

      if (error) throw error
      setEventos(data || [])
    } catch (error) {
      console.log("[v0] Error fetching eventos:", error)
    } finally {
      setLoading(false)
    }
  }

  async function deleteEvento(id: string) {
    if (!confirm("¿Estás seguro de eliminar este evento?")) return

    setDeleting(id)
    try {
      const supabase = createClient()
      const { error } = await supabase.from("eventos").delete().eq("id", id)

      if (error) throw error
      setEventos(eventos.filter((e) => e.id !== id))
    } catch (error) {
      console.log("[v0] Error deleting evento:", error)
      alert("Error al eliminar el evento")
    } finally {
      setDeleting(null)
      setMenuOpen(null)
    }
  }

  const eventosFiltrados = eventos.filter((e) =>
    e.titulo.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-2xl font-heading font-bold text-zinc-900">Gestión de Eventos</h1>
          <p className="text-zinc-600">
            {eventos.length} eventos · solo visibles para socios autenticados
          </p>
        </div>
        <Link href="/admin/eventos/nuevo">
          <Button className="bg-primary hover:bg-primary/90 gap-2">
            <Plus className="w-4 h-4" />
            Nuevo Evento
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
          placeholder="Buscar eventos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-white"
        />
      </motion.div>

      {/* Grid */}
      {eventosFiltrados.length === 0 ? (
        <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center text-zinc-500">
          No hay eventos. Crea el primero haciendo clic en "Nuevo Evento".
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 gap-6"
        >
          {eventosFiltrados.map((evento, index) => (
            <motion.div
              key={evento.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white rounded-xl border border-zinc-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative h-48 bg-zinc-100">
                {evento.imagen_url ? (
                  <Image src={evento.imagen_url} alt={evento.titulo} fill className="object-cover" />
                ) : (
                  <ImagePlaceholder />
                )}
                <div className="absolute top-3 left-3 flex gap-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      evento.publicado ? "bg-green-100 text-green-700" : "bg-zinc-100 text-zinc-700"
                    }`}
                  >
                    {evento.publicado ? "publicado" : "borrador"}
                  </span>
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    Solo socios
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-heading font-bold text-lg line-clamp-2">{evento.titulo}</h3>
                {evento.descripcion && (
                  <p className="text-sm text-zinc-600 mt-2 line-clamp-2">{evento.descripcion}</p>
                )}

                <div className="flex flex-col gap-1 mt-3 text-sm text-zinc-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(evento.fecha_inicio).toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {evento.lugar && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {evento.lugar}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-end mt-4 pt-4 border-t border-zinc-100">
                  <div className="flex items-center gap-1">
                    <Link href={`/admin/eventos/${evento.id}/editar`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setMenuOpen(menuOpen === evento.id ? null : evento.id)}
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                      {menuOpen === evento.id && (
                        <div className="absolute right-0 bottom-full mb-1 w-40 bg-white rounded-lg shadow-lg border border-zinc-200 py-1 z-10">
                          <button
                            className="w-full px-4 py-2 text-left text-sm hover:bg-zinc-50 text-red-600 flex items-center gap-2"
                            onClick={() => deleteEvento(evento.id)}
                            disabled={deleting === evento.id}
                          >
                            {deleting === evento.id ? (
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
