"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Search,
  Plus,
  Download,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Mail,
  ChevronLeft,
  ChevronRight,
  Loader2
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { Database } from "@/lib/database.types"

type Socio = Database["public"]["Tables"]["socios"]["Row"]

const tiposFiltro = ["Todos", "Adulto", "Juvenil", "Infantil", "Veterano", "Honorario"]
const estadosFiltro = ["Todos", "activo", "pendiente", "inactivo", "baja"]

export default function AdminSociosPage() {
  const [socios, setSocios] = useState<Socio[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [tipoFiltro, setTipoFiltro] = useState("Todos")
  const [estadoFiltro, setEstadoFiltro] = useState("Todos")
  const [selectedSocios, setSelectedSocios] = useState<string[]>([])
  const [menuOpen, setMenuOpen] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    fetchSocios()
  }, [])

  async function fetchSocios() {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("socios")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setSocios(data || [])
    } catch (error) {
      console.log("[v0] Error fetching socios:", error)
    } finally {
      setLoading(false)
    }
  }

  async function deleteSocio(id: string) {
    if (!confirm("¿Estás seguro de eliminar este socio?")) return
    
    setDeleting(id)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("socios")
        .delete()
        .eq("id", id)

      if (error) throw error
      setSocios(socios.filter(s => s.id !== id))
    } catch (error) {
      console.log("[v0] Error deleting socio:", error)
      alert("Error al eliminar el socio")
    } finally {
      setDeleting(null)
      setMenuOpen(null)
    }
  }

  const sociosFiltrados = socios.filter(socio => {
    const nombreCompleto = `${socio.nombre} ${socio.apellidos}`.toLowerCase()
    const matchSearch = nombreCompleto.includes(searchTerm.toLowerCase()) ||
                       (socio.email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                       (socio.numero_socio?.includes(searchTerm))
    const matchTipo = tipoFiltro === "Todos" || socio.tipo === tipoFiltro
    const matchEstado = estadoFiltro === "Todos" || socio.estado === estadoFiltro
    return matchSearch && matchTipo && matchEstado
  })

  const toggleSelectAll = () => {
    if (selectedSocios.length === sociosFiltrados.length) {
      setSelectedSocios([])
    } else {
      setSelectedSocios(sociosFiltrados.map(s => s.id))
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedSocios(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

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
          <h1 className="text-2xl font-heading font-bold text-zinc-900">Gestión de Socios</h1>
          <p className="text-zinc-600">{socios.length} socios registrados</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Exportar
          </Button>
          <Link href="/admin/socios/nuevo">
            <Button className="bg-primary hover:bg-primary/90 gap-2">
              <Plus className="w-4 h-4" />
              Nuevo Socio
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl border border-zinc-200 p-4"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <Input
              placeholder="Buscar por nombre, email o N de socio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={tipoFiltro}
              onChange={(e) => setTipoFiltro(e.target.value)}
              className="px-3 py-2 rounded-lg border border-zinc-200 text-sm bg-white"
            >
              {tiposFiltro.map(tipo => (
                <option key={tipo} value={tipo}>{tipo === "Todos" ? "Todos los tipos" : tipo}</option>
              ))}
            </select>
            <select
              value={estadoFiltro}
              onChange={(e) => setEstadoFiltro(e.target.value)}
              className="px-3 py-2 rounded-lg border border-zinc-200 text-sm bg-white"
            >
              {estadosFiltro.map(estado => (
                <option key={estado} value={estado}>{estado === "Todos" ? "Todos los estados" : estado}</option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl border border-zinc-200 overflow-hidden"
      >
        {sociosFiltrados.length === 0 ? (
          <div className="p-12 text-center text-zinc-500">
            No hay socios registrados. Añade el primero haciendo clic en "Nuevo Socio".
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-50 border-b border-zinc-200">
                <tr>
                  <th className="p-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedSocios.length === sociosFiltrados.length && sociosFiltrados.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded border-zinc-300"
                    />
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-zinc-600">Socio</th>
                  <th className="p-4 text-left text-sm font-semibold text-zinc-600">Contacto</th>
                  <th className="p-4 text-left text-sm font-semibold text-zinc-600">Tipo</th>
                  <th className="p-4 text-left text-sm font-semibold text-zinc-600">Estado</th>
                  <th className="p-4 text-left text-sm font-semibold text-zinc-600">Fecha Alta</th>
                  <th className="p-4 text-right text-sm font-semibold text-zinc-600">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {sociosFiltrados.map((socio) => (
                  <tr key={socio.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedSocios.includes(socio.id)}
                        onChange={() => toggleSelect(socio.id)}
                        className="rounded border-zinc-300"
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">
                            {socio.nombre?.[0]}{socio.apellidos?.[0]}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-zinc-900">{socio.nombre} {socio.apellidos}</p>
                          <p className="text-sm text-zinc-500">#{socio.numero_socio || "---"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-zinc-900">{socio.email || "---"}</p>
                      <p className="text-sm text-zinc-500">{socio.telefono || "---"}</p>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-zinc-900">{socio.tipo}</span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        socio.estado === "activo" ? "bg-green-100 text-green-700" :
                        socio.estado === "pendiente" ? "bg-amber-100 text-amber-700" :
                        "bg-zinc-100 text-zinc-700"
                      }`}>
                        {socio.estado}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-zinc-500">
                        {socio.fecha_alta ? new Date(socio.fecha_alta).toLocaleDateString("es-ES") : "---"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/admin/socios/${socio.id}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/socios/${socio.id}/editar`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <div className="relative">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => setMenuOpen(menuOpen === socio.id ? null : socio.id)}
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                          {menuOpen === socio.id && (
                            <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-zinc-200 py-1 z-10">
                              <button 
                                className="w-full px-4 py-2 text-left text-sm hover:bg-zinc-50 flex items-center gap-2"
                                onClick={() => {
                                  if (socio.email) {
                                    window.location.href = `mailto:${socio.email}`
                                  }
                                  setMenuOpen(null)
                                }}
                              >
                                <Mail className="w-4 h-4" /> Enviar email
                              </button>
                              <button 
                                className="w-full px-4 py-2 text-left text-sm hover:bg-zinc-50 flex items-center gap-2 text-red-600"
                                onClick={() => deleteSocio(socio.id)}
                                disabled={deleting === socio.id}
                              >
                                {deleting === socio.id ? (
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t border-zinc-200">
          <p className="text-sm text-zinc-600">
            Mostrando {sociosFiltrados.length} de {socios.length} socios
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" className="bg-primary text-white hover:bg-primary/90">
              1
            </Button>
            <Button variant="outline" size="sm">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
