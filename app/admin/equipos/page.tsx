"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { createBrowserClient } from "@/lib/supabase/client"
import {
  Plus,
  Users,
  Edit,
  Trash2,
  MoreHorizontal,
  ChevronRight,
  Shield,
  Loader2,
  AlertCircle
} from "lucide-react"

type EquipoConDatos = {
  id: string
  nombre: string
  entrenador: string | null
  categoria: { nombre: string } | null
  numJugadores: number
}

const colores = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-orange-500", "bg-pink-500", "bg-cyan-500"]

export default function AdminEquiposPage() {
  const [equipos, setEquipos] = useState<EquipoConDatos[]>([])
  const [categorias, setCategorias] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState<string | null>(null)

  const fetchEquipos = async () => {
    setLoading(true)
    const supabase = createBrowserClient()

    const { data, error: fetchError } = await supabase
      .from("equipos")
      .select("id, nombre, entrenador, categoria:categorias_equipo(nombre), jugadores(count)")
      .eq("activo", true)

    if (fetchError) {
      setError("No se han podido cargar los equipos.")
      setLoading(false)
      return
    }

    const { count: categoriasCount } = await supabase
      .from("categorias_equipo")
      .select("*", { count: "exact", head: true })

    setCategorias(categoriasCount || 0)
    setEquipos(
      (data || []).map((e: any) => ({
        id: e.id,
        nombre: e.nombre,
        entrenador: e.entrenador,
        categoria: e.categoria,
        numJugadores: e.jugadores?.[0]?.count || 0,
      }))
    )
    setError(null)
    setLoading(false)
  }

  useEffect(() => {
    fetchEquipos()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("¿Seguro que quieres eliminar este equipo? Esta acción no se puede deshacer.")) return
    const supabase = createBrowserClient()
    const { error: deleteError } = await supabase.from("equipos").delete().eq("id", id)
    if (deleteError) {
      alert("No se ha podido eliminar el equipo.")
    } else {
      fetchEquipos()
    }
    setMenuOpen(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
        <p className="text-red-700 font-medium">{error}</p>
      </div>
    )
  }

  const totalJugadores = equipos.reduce((acc, e) => acc + e.numJugadores, 0)
  const entrenadores = new Set(equipos.map((e) => e.entrenador).filter(Boolean)).size

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-heading font-bold text-zinc-900">Gestión de Equipos</h1>
          <p className="text-zinc-600">{equipos.length} equipos en el club</p>
        </div>
        <Link href="/admin/equipos/nuevo">
          <Button className="bg-primary hover:bg-primary/90 gap-2">
            <Plus className="w-4 h-4" />
            Nuevo Equipo
          </Button>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <div className="bg-white rounded-xl border border-zinc-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-heading font-bold">{equipos.length}</p>
              <p className="text-sm text-zinc-500">Equipos</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-heading font-bold">{totalJugadores}</p>
              <p className="text-sm text-zinc-500">Jugadores</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-heading font-bold">{entrenadores}</p>
              <p className="text-sm text-zinc-500">Entrenadores</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-heading font-bold">{categorias}</p>
              <p className="text-sm text-zinc-500">Categorías</p>
            </div>
          </div>
        </div>
      </motion.div>

      {equipos.length === 0 ? (
        <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center text-zinc-500">
          Aún no hay equipos creados. Crea el primero con el botón "Nuevo Equipo".
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {equipos.map((equipo, index) => (
            <motion.div
              key={equipo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
              className="bg-white rounded-xl border border-zinc-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className={`h-2 ${colores[index % colores.length]}`} />
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-heading font-bold text-lg">{equipo.nombre}</h3>
                    <p className="text-sm text-zinc-500">{equipo.categoria?.nombre || "Sin categoría"}</p>
                  </div>
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setMenuOpen(menuOpen === equipo.id ? null : equipo.id)}
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                    {menuOpen === equipo.id && (
                      <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-zinc-200 py-1 z-10">
                        <Link href={`/admin/equipos/${equipo.id}/editar`}>
                          <button className="w-full px-4 py-2 text-left text-sm hover:bg-zinc-50 flex items-center gap-2">
                            <Edit className="w-4 h-4" /> Editar
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDelete(equipo.id)}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-zinc-50 text-red-600 flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" /> Eliminar
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-500">Jugadores</span>
                    <span className="font-medium">{equipo.numJugadores}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-500">Entrenador</span>
                    <span className="font-medium">{equipo.entrenador || "Sin asignar"}</span>
                  </div>
                </div>

                <Link href={`/admin/equipos/${equipo.id}`}>
                  <Button variant="outline" className="w-full mt-4 gap-2">
                    Ver plantilla <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
