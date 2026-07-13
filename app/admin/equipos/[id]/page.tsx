"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  ArrowLeft,
  Edit,
  Plus,
  Trash2,
  Loader2,
  AlertCircle,
  Users,
  X,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { Database } from "@/lib/database.types"

type Equipo = Database["public"]["Tables"]["equipos"]["Row"] & {
  categoria: { nombre: string } | null
}
type Jugador = Database["public"]["Tables"]["jugadores"]["Row"]

const posiciones = ["Portero", "Defensa", "Centrocampista", "Delantero"] as const

export default function EquipoDetallePage() {
  const params = useParams()
  const id = params.id as string

  const [equipo, setEquipo] = useState<Equipo | null>(null)
  const [jugadores, setJugadores] = useState<Jugador[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    dorsal: "",
    posicion: "" as "" | (typeof posiciones)[number],
  })

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const supabase = createClient()
      const { data: equipoData, error: equipoError } = await supabase
        .from("equipos")
        .select("*, categoria:categorias_equipo(nombre)")
        .eq("id", id)
        .single()

      if (equipoError) throw equipoError
      setEquipo(equipoData as Equipo)

      const { data: jugadoresData, error: jugadoresError } = await supabase
        .from("jugadores")
        .select("*")
        .eq("equipo_id", id)
        .order("dorsal", { ascending: true, nullsFirst: false })

      if (jugadoresError) throw jugadoresError
      setJugadores(jugadoresData || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se ha podido cargar el equipo")
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleAddJugador = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const supabase = createClient()
      const { error: insertError } = await supabase.from("jugadores").insert({
        equipo_id: id,
        nombre: formData.nombre,
        apellidos: formData.apellidos,
        dorsal: formData.dorsal ? Number(formData.dorsal) : null,
        posicion: formData.posicion || null,
        activo: true,
      })
      if (insertError) throw insertError
      setShowModal(false)
      setFormData({ nombre: "", apellidos: "", dorsal: "", posicion: "" })
      fetchData()
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al añadir jugador")
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteJugador = async (jugadorId: string) => {
    if (!confirm("¿Quitar a este jugador de la plantilla?")) return
    const supabase = createClient()
    const { error: deleteError } = await supabase.from("jugadores").delete().eq("id", jugadorId)
    if (deleteError) {
      alert("No se ha podido eliminar el jugador")
      return
    }
    setJugadores(jugadores.filter((j) => j.id !== jugadorId))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !equipo) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
        <p className="text-red-700 font-medium">{error || "Equipo no encontrado"}</p>
        <Link href="/admin/equipos" className="inline-block mt-4">
          <Button variant="outline">Volver a equipos</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/equipos">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-heading font-bold text-zinc-900">{equipo.nombre}</h1>
            <p className="text-zinc-600">{equipo.categoria?.nombre || "Sin categoría"} · {equipo.temporada}</p>
          </div>
        </div>
        <Link href={`/admin/equipos/${id}/editar`}>
          <Button variant="outline" className="gap-2">
            <Edit className="w-4 h-4" /> Editar equipo
          </Button>
        </Link>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-zinc-200 p-4">
          <p className="text-sm text-zinc-500">Entrenador</p>
          <p className="font-medium">{equipo.entrenador || "Sin asignar"}</p>
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 p-4">
          <p className="text-sm text-zinc-500">Delegado</p>
          <p className="font-medium">{equipo.delegado || "Sin asignar"}</p>
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 p-4">
          <p className="text-sm text-zinc-500">Grupo / Liga</p>
          <p className="font-medium">{equipo.grupo_liga || "Sin asignar"}</p>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl border border-zinc-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="font-heading font-bold text-lg">Plantilla ({jugadores.length})</h2>
          </div>
          <Button onClick={() => setShowModal(true)} className="gap-2 bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4" /> Añadir jugador
          </Button>
        </div>

        {jugadores.length === 0 ? (
          <p className="text-center text-zinc-500 py-8">Todavía no hay jugadores en este equipo.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-50 border-b border-zinc-200">
                <tr>
                  <th className="p-3 text-left text-sm font-semibold text-zinc-600">Dorsal</th>
                  <th className="p-3 text-left text-sm font-semibold text-zinc-600">Nombre</th>
                  <th className="p-3 text-left text-sm font-semibold text-zinc-600">Posición</th>
                  <th className="p-3 text-right text-sm font-semibold text-zinc-600">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {jugadores.map((jugador) => (
                  <tr key={jugador.id} className="hover:bg-zinc-50">
                    <td className="p-3 font-mono text-sm">{jugador.dorsal ?? "-"}</td>
                    <td className="p-3 font-medium">{jugador.nombre} {jugador.apellidos}</td>
                    <td className="p-3 text-sm text-zinc-600">{jugador.posicion || "-"}</td>
                    <td className="p-3 text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600" onClick={() => handleDeleteJugador(jugador.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-zinc-200">
              <h2 className="text-xl font-heading font-bold">Añadir Jugador</h2>
              <button onClick={() => setShowModal(false)} className="p-2 text-zinc-400 hover:text-zinc-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddJugador} className="p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="j_nombre">Nombre *</Label>
                  <Input id="j_nombre" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="j_apellidos">Apellidos *</Label>
                  <Input id="j_apellidos" value={formData.apellidos} onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="j_dorsal">Dorsal</Label>
                  <Input id="j_dorsal" type="number" min="1" max="99" value={formData.dorsal} onChange={(e) => setFormData({ ...formData, dorsal: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="j_posicion">Posición</Label>
                  <select
                    id="j_posicion"
                    value={formData.posicion}
                    onChange={(e) => setFormData({ ...formData, posicion: e.target.value as typeof formData.posicion })}
                    className="w-full h-10 px-3 rounded-lg border border-zinc-200 text-sm bg-white"
                  >
                    <option value="">Sin especificar</option>
                    {posiciones.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="flex-1">Cancelar</Button>
                <Button type="submit" disabled={saving} className="flex-1 bg-primary hover:bg-primary/90">
                  {saving ? "Guardando..." : "Añadir"}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
