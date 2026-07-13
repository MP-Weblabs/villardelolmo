"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ArrowUpRight, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion"
import { createClient } from "@/lib/supabase/client"
import { ImagePlaceholder } from "@/components/image-placeholder"
import type { Database } from "@/lib/database.types"

type Noticia = Database["public"]["Tables"]["noticias"]["Row"]

export function NewsSection() {
  const [news, setNews] = useState<Noticia[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchNews() {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("noticias")
          .select("*")
          .eq("publicada", true)
          .order("fecha_publicacion", { ascending: false })
          .limit(4)

        if (error) throw error
        setNews(data || [])
      } catch (error) {
        console.error("Error al cargar noticias:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [])

  const featured = news[0]
  const rest = news.slice(1, 4)

  if (!loading && news.length === 0) {
    return null
  }

  if (loading || !featured) {
    return (
      <section className="py-24 md:py-32 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 xl:px-20 flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </section>
    )
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return ""
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric"
    })
  }

  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 xl:px-20">
        {/* Header */}
        <FadeIn className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <span className="text-xs font-semibold text-primary uppercase tracking-[0.25em] mb-4 block">
              Actualidad
            </span>
            <h2 className="text-headline text-4xl md:text-5xl lg:text-6xl text-foreground">
              ÚLTIMAS<br />
              <span className="text-muted-foreground">NOTICIAS</span>
            </h2>
          </div>
          <Link 
            href="/noticias"
            className="group inline-flex items-center gap-3 text-sm font-semibold text-foreground hover:text-primary transition-colors"
          >
            <span className="tracking-[0.1em] uppercase">Ver todas</span>
            <span className="w-10 h-10 flex items-center justify-center border border-current group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all">
              <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        </FadeIn>

        {/* Grid */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-6">
          {/* Featured */}
          <FadeIn delay={0.1} className="lg:col-span-7">
            <Link href={`/noticias/${featured.slug}`} className="group block">
              <article>
                <div className="aspect-[16/10] bg-muted mb-6 overflow-hidden relative">
                  {featured.imagen_principal ? (
                    <Image
                      src={featured.imagen_principal}
                      alt={featured.titulo}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <ImagePlaceholder />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <motion.div 
                    className="absolute bottom-6 right-6 w-12 h-12 bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                    whileHover={{ scale: 1.1 }}
                  >
                    <ArrowUpRight className="h-5 w-5 text-primary" />
                  </motion.div>
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-xs font-semibold text-primary uppercase tracking-[0.15em]">
                    Noticia
                  </span>
                  <span className="w-1 h-1 bg-muted-foreground rounded-full" />
                  <span className="text-xs text-muted-foreground tracking-wide">
                    {formatDate(featured.fecha_publicacion)}
                  </span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-foreground group-hover:text-primary transition-colors mb-4 tracking-tight">
                  {featured.titulo}
                </h3>
                <p className="text-muted-foreground leading-relaxed max-w-xl">
                  {featured.extracto}
                </p>
              </article>
            </Link>
          </FadeIn>

          {/* Rest */}
          <div className="lg:col-span-5 flex flex-col">
            <StaggerContainer className="flex flex-col h-full" staggerDelay={0.1}>
              {rest.map((item, index) => (
                <StaggerItem key={item.id}>
                  <Link href={`/noticias/${item.slug}`} className="group block py-6 first:pt-0">
                    <article className="flex gap-5">
                      <div className="w-24 h-24 md:w-28 md:h-28 bg-muted shrink-0 overflow-hidden relative">
                        {item.imagen_principal ? (
                          <Image
                            src={item.imagen_principal}
                            alt={item.titulo}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <ImagePlaceholder />
                        )}
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-[10px] font-semibold text-primary uppercase tracking-[0.15em]">
                            Noticia
                          </span>
                          <span className="text-[10px] text-muted-foreground tracking-wide">
                            {formatDate(item.fecha_publicacion)}
                          </span>
                        </div>
                        <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 tracking-tight">
                          {item.titulo}
                        </h3>
                      </div>
                    </article>
                  </Link>
                  {index < rest.length - 1 && (
                    <div className="h-px bg-border" />
                  )}
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </div>
    </section>
  )
}
