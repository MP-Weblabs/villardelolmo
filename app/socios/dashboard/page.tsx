"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useSocio } from "@/lib/hooks/use-socio"
import { createBrowserClient } from "@/lib/supabase/client"
import type { Database } from "@/lib/database.types"
import {
  CreditCard,
  Calendar,
  TrendingUp,
  ArrowRight,
  Clock,
  CheckCircle2,
  Loader2,
  AlertCircle
} from "lucide-react"

type Evento = Database["public"]["Tables"]["eventos"]["Row"]

const tipoSocioLabel: Record<string, string> = {
  Adulto: "Adulto",
  Juvenil: "Juvenil",
  Infantil: "Infantil",
  Veterano: "Veterano",
  Honorario: "Honorario",
}

const estadoLabel: Record<string, string> = {
  activo: "Activo",
  inactivo: "Inactivo",
  pendiente: "Pendiente",
  baja: "Baja",
}

export default function SociosDashboardPage() {
  const { socio, loading, error } = useSocio()
  const [eventos, setEventos] = useState<Evento[]>([])
  const [eventosLoading, setEventosLoading] = useState(true)

  useEffect(() => {
    const fetchEventos = async () => {
      const supabase = createBrowserClient()
      const { data } = await supabase
        .from("eventos")
        .select("*")
        .eq("publicado", true)
        .gte("fecha_inicio", new Date().toISOString())
        .order("fecha_inicio", { ascending: true })
        .limit(3)
      setEventos(data || [])
      setEventosLoading(false)
    }
    fetchEventos()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !socio) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
        <p className="text-red-700 font-medium">{error || "No se ha encontrado tu ficha de socio."}</p>
        <p className="text-sm text-muted-foreground mt-2">
          Si crees que es un error, contacta con la secretaría del club.
        </p>
      </div>
    )
  }

  const añosComoSocio = new Date().getFullYear() - new Date(socio.fecha_alta).getFullYear()

  const stats = [
    { label: "Socio desde", value: new Date(socio.fecha_alta).getFullYear().toString(), icon: Calendar, color: "bg-blue-500" },
    { label: "Años como socio", value: añosComoSocio.toString(), icon: TrendingUp, color: "bg-primary" },
    { label: "Estado", value: estadoLabel[socio.estado] || socio.estado, icon: CheckCircle2, color: "bg-emerald-500" },
  ]

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
              Bienvenido, {socio.nombre}
            </h1>
            <p className="text-muted-foreground mt-1">
              Socio #{socio.numero_socio || "----"} | Categoría {tipoSocioLabel[socio.tipo] || socio.tipo}
            </p>
          </div>
          <Link href="/socios/dashboard/carnet">
            <Button className="bg-primary hover:bg-primary/90 gap-2">
              <CreditCard className="h-4 w-4" />
              Ver mi carnet
            </Button>
          </Link>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {stats.map((stat) => (
          <Card key={stat.label} className="border-none shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl lg:text-3xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-2.5 rounded-lg`}>
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2 space-y-4"
        >
          <h2 className="text-lg font-semibold">Acciones rápidas</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Link href="/socios/dashboard/carnet">
              <Card className="border-none shadow-sm hover:shadow-md transition-all group cursor-pointer h-full">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                    <CreditCard className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold group-hover:text-primary transition-colors">Ver carnet</h3>
                    <p className="text-sm text-muted-foreground">Accede a tu carnet digital</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                </CardContent>
              </Card>
            </Link>
          </div>

          <Card className="border-none shadow-sm overflow-hidden mt-6">
            <div className="bg-gradient-to-br from-primary via-primary to-accent p-6 text-white">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-white/70 text-sm">Carnet de Socio</p>
                  <h3 className="text-xl font-bold mt-1">{socio.nombre} {socio.apellidos}</h3>
                  <p className="text-white/70 text-sm mt-4">N° Socio</p>
                  <p className="text-2xl font-bold tracking-wider">{socio.numero_socio || "----"}</p>
                </div>
                <div className="text-right">
                  <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
                    {socio.nombre[0]}{socio.apellidos[0]}
                  </div>
                </div>
              </div>
            </div>
            <CardContent className="p-4 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {socio.estado === "activo" ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      Cuota al día
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                      {estadoLabel[socio.estado] || socio.estado}
                    </>
                  )}
                </div>
                <Link href="/socios/dashboard/carnet">
                  <Button variant="ghost" size="sm" className="gap-1 text-primary">
                    Ver carnet completo
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Próximos eventos</h2>
            <Link href="/socios/dashboard/eventos" className="text-sm text-primary hover:underline">
              Ver todos
            </Link>
          </div>
          <Card className="border-none shadow-sm">
            <CardContent className="p-0 divide-y">
              {eventosLoading ? (
                <div className="p-6 flex justify-center">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : eventos.length === 0 ? (
                <div className="p-6 text-sm text-muted-foreground text-center">
                  No hay eventos próximos por ahora.
                </div>
              ) : (
                eventos.map((evento) => (
                  <div key={evento.id} className="p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex gap-3">
                      <div className="h-2 w-2 rounded-full mt-2 flex-shrink-0 bg-primary" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm">{evento.titulo}</h4>
                        {evento.descripcion && (
                          <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                            {evento.descripcion}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(evento.fecha_inicio).toLocaleDateString("es-ES", {
                            day: "numeric",
                            month: "long",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
