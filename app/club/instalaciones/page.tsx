"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FadeIn } from "@/components/motion"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import { createBrowserClient } from "@/lib/supabase/client"
import {
  DEFAULT_INSTALACIONES,
  DEFAULT_INSTALACIONES_LISTA,
  parsePageHeader,
  parseInstalacionesLista,
  parseJsonSafe,
  type PageHeaderContent,
  type InstalacionItem,
} from "@/lib/site-content"

export default function InstalacionesPage() {
  const [content, setContent] = useState<PageHeaderContent>(DEFAULT_INSTALACIONES)
  const [instalaciones, setInstalaciones] = useState<InstalacionItem[]>(DEFAULT_INSTALACIONES_LISTA)

  useEffect(() => {
    let cancelled = false
    const supabase = createBrowserClient()
    supabase
      .from("configuracion_web")
      .select("clave, valor")
      .in("clave", ["pagina_instalaciones", "pagina_instalaciones_lista"])
      .then(({ data }) => {
        if (cancelled) return
        const byKey = new Map((data ?? []).map((row) => [row.clave, row.valor]))
        setContent(parsePageHeader(parseJsonSafe(byKey.get("pagina_instalaciones")), DEFAULT_INSTALACIONES))
        setInstalaciones(parseInstalacionesLista(parseJsonSafe(byKey.get("pagina_instalaciones_lista"))))
      })
    return () => {
      cancelled = true
    }
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
                INSTALACIONES &nbsp; INSTALACIONES
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

        {/* Instalaciones */}
        <section className="py-24 md:py-32 bg-background">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 xl:px-20">
            <div className="flex flex-col gap-24">
              {instalaciones.map((inst, i) => (
                <FadeIn key={inst.nombre} delay={0.1}>
                  <div className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 items-center`}>
                    <div className="w-full md:w-1/2">
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <Image
                          src={inst.imagen}
                          alt={inst.nombre}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <div className="w-full md:w-1/2 flex flex-col justify-center gap-4">
                      <span className="text-xs font-semibold tracking-[0.25em] text-primary uppercase">
                        Instalaciones
                      </span>
                      <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground uppercase">
                        {inst.nombre}
                      </h2>
                      <p className="text-foreground/60 text-lg leading-relaxed max-w-md">
                        {inst.descripcion}
                      </p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
