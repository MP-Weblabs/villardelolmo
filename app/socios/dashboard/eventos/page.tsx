"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createBrowserClient } from "@/lib/supabase/client"
import { ImagePlaceholder } from "@/components/image-placeholder"
import type { Database } from "@/lib/database.types"
import { Calendar, MapPin, Users, Loader2, AlertCircle, ExternalLink } from "lucide-react"

type Evento = Database["public"]["Tables"]["eventos"]["Row"]

export default function SociosEventosPage() {
  const [eventos, setEventos] = useState<Evento[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const supabase = createBrowserClient()
        const { data, error: fetchError } = await supabase
          .from("eventos")
          .select("*")
          .eq("publicado", true)
          .order("fecha_inicio", { ascending: true })

        if (fetchError) throw fetchError
        setEventos(data || [])
      } catch (err) {
        console.log("[v0] Error fetching eventos:", err)
        setError("No se han podido cargar los eventos")
      } finally {
        setLoading(false)
      }
    }

    fetchEventos()
  }, [])

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    })

  const ahora = new Date()
  const proximosEventos = eventos.filter((e) => new Date(e.fecha_inicio) >= ahora)
  const eventosPasados = eventos.filter((e) => new Date(e.fecha_inicio) < ahora)

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

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Eventos del Club</h1>
        <p className="text-muted-foreground mt-1">Actividades exclusivas para socios</p>
      </motion.div>

      {proximosEventos.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          <h2 className="text-lg font-semibold mb-4">Próximos eventos</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {proximosEventos.map((evento, index) => (
              <motion.div
                key={evento.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="border-none shadow-sm overflow-hidden hover:shadow-md transition-all h-full">
                  <div className="relative h-48 bg-zinc-100">
                    {evento.imagen_url ? (
                      <Image src={evento.imagen_url} alt={evento.titulo} fill className="object-cover" />
                    ) : (
                      <ImagePlaceholder />
                    )}
                  </div>
                  <CardContent className="p-5">
                    <h3 className="font-semibold text-lg mb-2">{evento.titulo}</h3>
                    {evento.descripcion && (
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{evento.descripcion}</p>
                    )}

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4 flex-shrink-0" />
                        {formatDate(evento.fecha_inicio)}
                      </div>
                      {evento.lugar && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          {evento.lugar}
                        </div>
                      )}
                      {evento.capacidad && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="w-4 h-4 flex-shrink-0" />
                          {evento.capacidad} plazas
                        </div>
                      )}
                      {evento.precio !== null && (
                        <div className="text-sm text-muted-foreground">
                          {evento.precio > 0 ? `${evento.precio} €` : "Gratuito"}
                        </div>
                      )}
                    </div>

                    {evento.inscripcion_requerida && evento.url_inscripcion && (
                      <Link href={evento.url_inscripcion} target="_blank">
                        <Button className="w-full bg-primary hover:bg-primary/90 gap-2">
                          Inscribirse
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </Link>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {eventosPasados.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <h2 className="text-lg font-semibold mb-4">Eventos pasados</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {eventosPasados.map((evento, index) => (
              <motion.div
                key={evento.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="border-none shadow-sm overflow-hidden opacity-75">
                  <div className="relative h-28 bg-zinc-100">
                    {evento.imagen_url ? (
                      <Image src={evento.imagen_url} alt={evento.titulo} fill className="object-cover" />
                    ) : (
                      <ImagePlaceholder />
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-1">{evento.titulo}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 flex-shrink-0" />
                      {formatDate(evento.fecha_inicio)}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {eventos.length === 0 && (
        <Card className="border-none shadow-sm">
          <CardContent className="p-12 text-center">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">Aún no hay eventos programados.</p>
            <p className="text-sm text-muted-foreground mt-1">
              Los eventos exclusivos para socios aparecerán aquí cuando el club los publique.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
