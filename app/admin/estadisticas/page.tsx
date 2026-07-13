"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  Users,
  TrendingUp,
  Newspaper,
  Mail,
  Loader2,
  Info
} from "lucide-react"
import { createBrowserClient } from "@/lib/supabase/client"

const tipoLabel: Record<string, string> = {
  Adulto: "Adulto", Juvenil: "Juvenil", Infantil: "Infantil", Veterano: "Veterano", Honorario: "Honorario",
}

export default function AdminEstadisticasPage() {
  const [loading, setLoading] = useState(true)
  const [sociosActivos, setSociosActivos] = useState(0)
  const [noticiasPublicadas, setNoticiasPublicadas] = useState(0)
  const [nuevosSociosMes, setNuevosSociosMes] = useState(0)
  const [mensajesPendientes, setMensajesPendientes] = useState(0)
  const [sociosPorTipo, setSociosPorTipo] = useState<{ tipo: string; cantidad: number; porcentaje: number }[]>([])
  const [altasPorMes, setAltasPorMes] = useState<{ mes: string; cantidad: number }[]>([])
  const [ultimasNoticias, setUltimasNoticias] = useState<{ titulo: string; fecha: string }[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createBrowserClient()

        const inicioMes = new Date()
        inicioMes.setDate(1)
        inicioMes.setHours(0, 0, 0, 0)

        const [
          { count: activosCount },
          { count: noticiasCount },
          { count: nuevosCount },
          { count: mensajesCount },
          { data: todosSocios },
          { data: noticias },
        ] = await Promise.all([
          supabase.from("socios").select("*", { count: "exact", head: true }).eq("estado", "activo"),
          supabase.from("noticias").select("*", { count: "exact", head: true }).eq("publicada", true),
          supabase.from("socios").select("*", { count: "exact", head: true }).gte("created_at", inicioMes.toISOString()),
          supabase.from("contacto_mensajes").select("*", { count: "exact", head: true }).eq("leido", false),
          supabase.from("socios").select("tipo, created_at").eq("estado", "activo"),
          supabase.from("noticias").select("titulo, created_at").eq("publicada", true).order("created_at", { ascending: false }).limit(5),
        ])

        setSociosActivos(activosCount || 0)
        setNoticiasPublicadas(noticiasCount || 0)
        setNuevosSociosMes(nuevosCount || 0)
        setMensajesPendientes(mensajesCount || 0)

        const total = todosSocios?.length || 0
        const conteoTipos: Record<string, number> = {}
        todosSocios?.forEach((s) => {
          conteoTipos[s.tipo] = (conteoTipos[s.tipo] || 0) + 1
        })
        setSociosPorTipo(
          Object.entries(conteoTipos).map(([tipo, cantidad]) => ({
            tipo: tipoLabel[tipo] || tipo,
            cantidad,
            porcentaje: total > 0 ? Math.round((cantidad / total) * 100) : 0,
          }))
        )

        const mesesNombres = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
        const hoy = new Date()
        const ultimosMeses: { key: string; mes: string; cantidad: number }[] = []
        for (let i = 4; i >= 0; i--) {
          const d = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1)
          ultimosMeses.push({ key: `${d.getFullYear()}-${d.getMonth()}`, mes: mesesNombres[d.getMonth()], cantidad: 0 })
        }
        todosSocios?.forEach((s) => {
          const d = new Date(s.created_at)
          const key = `${d.getFullYear()}-${d.getMonth()}`
          const mes = ultimosMeses.find((m) => m.key === key)
          if (mes) mes.cantidad++
        })
        setAltasPorMes(ultimosMeses)

        setUltimasNoticias(
          (noticias || []).map((n) => ({
            titulo: n.titulo,
            fecha: new Date(n.created_at).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" }),
          }))
        )
      } catch (err) {
        console.error("Error al cargar estadísticas:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  const stats = [
    { label: "Socios activos", value: sociosActivos.toString(), icon: Users },
    { label: "Noticias publicadas", value: noticiasPublicadas.toString(), icon: Newspaper },
    { label: "Nuevos socios (mes)", value: nuevosSociosMes.toString(), icon: TrendingUp },
    { label: "Mensajes sin leer", value: mensajesPendientes.toString(), icon: Mail },
  ]

  const maxAltas = Math.max(1, ...altasPorMes.map((v) => v.cantidad))

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-heading font-bold text-zinc-900">Estadísticas</h1>
        <p className="text-zinc-600">Resumen de actividad y métricas del club</p>
      </motion.div>

      <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl text-blue-800 text-sm">
        <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <span>
          Las visitas a la web y el número de vistas por noticia no se muestran porque aún no hay
          ninguna herramienta de analítica conectada (por ejemplo Vercel Analytics o Google Analytics).
          El resto de datos de esta página son reales, extraídos de la base de datos.
        </span>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * index }}
            className="bg-white rounded-xl border border-zinc-200 p-5"
          >
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <stat.icon className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-heading font-bold mt-3">{stat.value}</p>
            <p className="text-sm text-zinc-500 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl border border-zinc-200 p-6">
          <h2 className="font-heading font-bold text-lg mb-6">Altas de Socios (últimos 5 meses)</h2>
          <div className="flex items-end justify-between h-48 gap-4">
            {altasPorMes.map((item, index) => (
              <div key={item.mes + index} className="flex-1 flex flex-col items-center gap-2">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max((item.cantidad / maxAltas) * 100, item.cantidad > 0 ? 8 : 2)}%` }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                  className="w-full bg-primary/80 rounded-t-lg min-h-[4px]"
                />
                <span className="text-xs text-zinc-500">{item.mes}</span>
                <span className="text-xs font-medium text-zinc-700">{item.cantidad}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-xl border border-zinc-200 p-6">
          <h2 className="font-heading font-bold text-lg mb-6">Socios por Categoría</h2>
          {sociosPorTipo.length === 0 ? (
            <p className="text-sm text-zinc-500">No hay socios activos todavía.</p>
          ) : (
            <div className="space-y-4">
              {sociosPorTipo.map((item, index) => (
                <div key={item.tipo}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{item.tipo}</span>
                    <span className="text-sm text-zinc-500">{item.cantidad} ({item.porcentaje}%)</span>
                  </div>
                  <div className="h-3 bg-zinc-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.porcentaje}%` }}
                      transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                      className="h-full bg-primary rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-xl border border-zinc-200 p-6">
        <h2 className="font-heading font-bold text-lg mb-6">Últimas Noticias Publicadas</h2>
        {ultimasNoticias.length === 0 ? (
          <p className="text-sm text-zinc-500">Aún no hay noticias publicadas.</p>
        ) : (
          <div className="space-y-4">
            {ultimasNoticias.map((noticia, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-zinc-50 rounded-xl">
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-heading font-bold text-zinc-300">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="font-medium">{noticia.titulo}</span>
                </div>
                <span className="text-sm text-zinc-500">{noticia.fecha}</span>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
