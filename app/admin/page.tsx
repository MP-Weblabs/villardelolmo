"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  Users,
  Newspaper,
  Eye,
  Calendar,
  ArrowRight,
  UserPlus,
  FileText,
  AlertCircle,
  Mail,
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { createBrowserClient } from "@/lib/supabase/client"

type RecentSocio = { id: string; nombre: string; apellidos: string; created_at: string; tipo: string; estado: string }
type RecentNoticia = { id: string; titulo: string; created_at: string; publicada: boolean }

const tipoLabel: Record<string, string> = {
  Adulto: "Adulto", Juvenil: "Juvenil", Infantil: "Infantil", Veterano: "Veterano", Honorario: "Honorario",
}

function hace(fecha: string) {
  const dias = Math.floor((Date.now() - new Date(fecha).getTime()) / 86400000)
  if (dias <= 0) return "Hoy"
  if (dias === 1) return "Hace 1 día"
  if (dias < 7) return `Hace ${dias} días`
  const semanas = Math.floor(dias / 7)
  if (semanas === 1) return "Hace 1 semana"
  return `Hace ${semanas} semanas`
}

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true)
  const [totalSocios, setTotalSocios] = useState(0)
  const [sociosActivos, setSociosActivos] = useState(0)
  const [noticiasPublicadas, setNoticiasPublicadas] = useState(0)
  const [recentSocios, setRecentSocios] = useState<RecentSocio[]>([])
  const [recentNoticias, setRecentNoticias] = useState<RecentNoticia[]>([])
  const [mensajesPendientes, setMensajesPendientes] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createBrowserClient()

        const [
          { count: totalSociosCount },
          { count: activosCount },
          { count: noticiasCount },
          { data: ultimosSocios },
          { data: ultimasNoticias },
          { count: mensajesCount },
        ] = await Promise.all([
          supabase.from("socios").select("*", { count: "exact", head: true }),
          supabase.from("socios").select("*", { count: "exact", head: true }).eq("estado", "activo"),
          supabase.from("noticias").select("*", { count: "exact", head: true }).eq("publicada", true),
          supabase.from("socios").select("id, nombre, apellidos, created_at, tipo, estado").order("created_at", { ascending: false }).limit(4),
          supabase.from("noticias").select("id, titulo, created_at, publicada").order("created_at", { ascending: false }).limit(3),
          supabase.from("contacto_mensajes").select("*", { count: "exact", head: true }).eq("leido", false),
        ])

        setTotalSocios(totalSociosCount || 0)
        setSociosActivos(activosCount || 0)
        setNoticiasPublicadas(noticiasCount || 0)
        setRecentSocios(ultimosSocios || [])
        setRecentNoticias(ultimasNoticias || [])
        setMensajesPendientes(mensajesCount || 0)
      } catch (err) {
        console.error("Error al cargar el dashboard:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const stats = [
    { name: "Total Socios", value: totalSocios.toString(), icon: Users, color: "bg-blue-500" },
    { name: "Socios Activos", value: sociosActivos.toString(), icon: Users, color: "bg-green-500" },
    { name: "Noticias Publicadas", value: noticiasPublicadas.toString(), icon: Newspaper, color: "bg-purple-500" },
    { name: "Mensajes sin leer", value: mensajesPendientes.toString(), icon: Mail, color: "bg-orange-500" },
  ]

  const alertas: { id: string; mensaje: string; tipo: "info" | "warning"; href: string }[] = [
    ...(mensajesPendientes > 0 ? [{ id: "msj", mensaje: `${mensajesPendientes} mensaje${mensajesPendientes > 1 ? "s" : ""} de contacto sin leer`, tipo: "info" as const, href: "/admin/configuracion" }] : []),
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-zinc-900">
          Bienvenido al Panel de Administración
        </h1>
        <p className="text-zinc-600 mt-1">
          Gestiona el club desde aquí. Hoy es {new Date().toLocaleDateString("es-ES", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
          })}.
        </p>
      </motion.div>

      {alertas.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-3">
          {alertas.map((alerta) => (
            <Link key={alerta.id} href={alerta.href}>
              <div
                className={`flex items-center gap-3 p-4 rounded-xl ${
                  alerta.tipo === "warning"
                    ? "bg-amber-50 border border-amber-200 text-amber-800"
                    : "bg-blue-50 border border-blue-200 text-blue-800"
                } hover:opacity-80 transition-opacity`}
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">{alerta.mensaje}</span>
              </div>
            </Link>
          ))}
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className="bg-white rounded-2xl border border-zinc-200 p-6 hover:shadow-lg transition-shadow"
          >
            <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <div className="mt-4">
              <p className="text-3xl font-heading font-bold text-zinc-900">{stat.value}</p>
              <p className="text-sm text-zinc-600 mt-1">{stat.name}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-zinc-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <UserPlus className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="font-heading font-bold text-lg">Últimos Socios</h2>
            </div>
            <Link href="/admin/socios">
              <Button variant="ghost" size="sm" className="gap-1">
                Ver todos <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          <div className="divide-y divide-zinc-100">
            {recentSocios.length === 0 ? (
              <div className="p-6 text-sm text-zinc-500 text-center">Aún no hay socios registrados.</div>
            ) : (
              recentSocios.map((socio) => (
                <div key={socio.id} className="flex items-center justify-between p-4 hover:bg-zinc-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-zinc-600">
                        {socio.nombre[0]}{socio.apellidos[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-zinc-900">{socio.nombre} {socio.apellidos}</p>
                      <p className="text-sm text-zinc-500">{tipoLabel[socio.tipo] || socio.tipo} · {hace(socio.created_at)}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    socio.estado === "activo" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                  }`}>
                    {socio.estado}
                  </span>
                </div>
              ))
            )}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-zinc-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="font-heading font-bold text-lg">Últimas Noticias</h2>
            </div>
            <Link href="/admin/noticias">
              <Button variant="ghost" size="sm" className="gap-1">
                Ver todas <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          <div className="divide-y divide-zinc-100">
            {recentNoticias.length === 0 ? (
              <div className="p-6 text-sm text-zinc-500 text-center">Aún no hay noticias creadas.</div>
            ) : (
              recentNoticias.map((noticia) => (
                <div key={noticia.id} className="flex items-center justify-between p-4 hover:bg-zinc-50 transition-colors">
                  <div className="flex-1 min-w-0 pr-4">
                    <p className="font-medium text-zinc-900 truncate">{noticia.titulo}</p>
                    <p className="text-sm text-zinc-500">{hace(noticia.created_at)}</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full flex-shrink-0 ${
                    noticia.publicada ? "bg-green-100 text-green-700" : "bg-zinc-100 text-zinc-700"
                  }`}>
                    {noticia.publicada ? "publicada" : "borrador"}
                  </span>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white rounded-2xl border border-zinc-200 p-6">
        <h2 className="font-heading font-bold text-lg mb-4">Acciones Rápidas</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/socios/nuevo">
            <Button className="bg-primary hover:bg-primary/90 gap-2">
              <UserPlus className="w-4 h-4" />
              Nuevo Socio
            </Button>
          </Link>
          <Link href="/admin/noticias/nueva">
            <Button variant="outline" className="gap-2">
              <FileText className="w-4 h-4" />
              Nueva Noticia
            </Button>
          </Link>
          <Link href="/admin/estadisticas">
            <Button variant="outline" className="gap-2">
              <Eye className="w-4 h-4" />
              Ver Estadísticas
            </Button>
          </Link>
          <Link href="/admin/configuracion">
            <Button variant="outline" className="gap-2">
              <Calendar className="w-4 h-4" />
              Configuración
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
