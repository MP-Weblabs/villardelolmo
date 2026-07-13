"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FadeIn } from "@/components/motion"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ImageOff, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import { DEFAULT_EQUIPOS, parsePageHeader, parseJsonSafe, type PageHeaderContent } from "@/lib/site-content"

type EquipoCard = {
  id: string
  nombre: string
  temporada: string
  descripcion: string
  imagen: string | null
}

export default function EquiposPage() {
  const [equipos, setEquipos] = useState<EquipoCard[]>([])
  const [loading, setLoading] = useState(true)
  const [content, setContent] = useState<PageHeaderContent>(DEFAULT_EQUIPOS)

  useEffect(() => {
    let cancelled = false
    const supabase = createClient()
    supabase
      .from("configuracion_web")
      .select("valor")
      .eq("clave", "pagina_equipos")
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled || !data?.valor) return
        setContent(parsePageHeader(parseJsonSafe(data.valor), DEFAULT_EQUIPOS))
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    async function fetchEquipos() {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("equipos")
          .select("*")
          .eq("activo", true)
          .order("nombre", { ascending: true })

        if (error) throw error
        setEquipos(
          (data || []).map((e) => ({
            id: e.id,
            nombre: e.nombre,
            temporada: e.temporada,
            descripcion: e.descripcion || "",
            imagen: e.imagen_url,
          }))
        )
      } catch (error) {
        console.error("Error al cargar equipos:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEquipos()
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Page Header */}
        <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-primary relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <motion.div
              animate={{ x: [0, -500] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="whitespace-nowrap absolute bottom-0"
            >
              <span className="text-[20rem] font-bold text-white tracking-tighter">
                EQUIPOS &nbsp; EQUIPOS &nbsp; EQUIPOS
              </span>
            </motion.div>
          </div>
          <div className="max-w-7xl mx-auto px-6 lg:px-12 xl:px-20 relative">
            <FadeIn>
              <Link
                href="/historia"
                className="inline-flex items-center text-white/60 hover:text-white mb-8 text-sm transition-colors group"
              >
                <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
                <span className="tracking-[0.1em] uppercase">Historia</span>
              </Link>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h1 className="text-display text-5xl md:text-7xl lg:text-8xl text-white mb-6">
                {content.tituloLinea1}
                <br />
                <span className="text-white/40">{content.tituloLinea2}</span>
              </h1>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="text-white/70 text-lg md:text-xl max-w-xl">
                {content.subtitulo}
              </p>
            </FadeIn>
          </div>
        </section>

        {/* Equipos Grid */}
        <section className="py-24 md:py-32 bg-background">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 xl:px-20">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : equipos.length === 0 ? (
              <div className="py-20 text-center text-muted-foreground">
                Todavía no hay equipos publicados.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {equipos.map((equipo, i) => (
                  <FadeIn key={equipo.id} delay={i * 0.1}>
                    <Link
                      href={`/club/equipos/${equipo.id}`}
                      className="group flex flex-col bg-background border border-border overflow-hidden hover:border-primary transition-colors duration-300"
                    >
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                        {equipo.imagen ? (
                          <Image
                            src={equipo.imagen}
                            alt={`Equipo ${equipo.nombre} ${equipo.temporada}`}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <ImageOff className="h-8 w-8 text-muted-foreground/40" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-5">
                          <span className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
                            {equipo.temporada}
                          </span>
                        </div>
                      </div>
                      <div className="p-6 flex flex-col gap-3">
                        <h2 className="text-2xl font-bold tracking-tight text-foreground uppercase">
                          {equipo.nombre}
                        </h2>
                        <p className="text-foreground/60 text-sm leading-relaxed">
                          {equipo.descripcion}
                        </p>
                      </div>
                    </Link>
                  </FadeIn>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
