"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FadeIn } from "@/components/motion"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Loader2 } from "lucide-react"
import { getGaleriaPublicada } from "@/lib/supabase/galeria"
import type { Database } from "@/lib/database.types"

type GaleriaItem = Database["public"]["Tables"]["galeria"]["Row"]

export default function GaleriaPage() {
  const [photos, setPhotos] = useState<GaleriaItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchGaleria() {
      try {
        const data = await getGaleriaPublicada()
        setPhotos(data)
      } catch (error) {
        console.error("Error al cargar la galería:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchGaleria()
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Page Header */}
        <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-primary relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 xl:px-20 relative">
            <FadeIn>
              <Link
                href="/"
                className="inline-flex items-center text-white/60 hover:text-white mb-8 text-sm transition-colors group"
              >
                <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
                <span className="tracking-[0.1em] uppercase">Volver</span>
              </Link>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h1 className="text-display text-5xl md:text-7xl lg:text-8xl text-white mb-6">
                NUESTRA
                <br />
                <span className="text-white/40">GALERÍA</span>
              </h1>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="text-white/70 text-lg md:text-xl max-w-xl">
                Momentos, equipos e instalaciones del C.D. Unión Deportiva Villar del Olmo.
              </p>
            </FadeIn>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="py-20 md:py-32 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 xl:px-20">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : photos.length === 0 ? (
              <div className="py-20 text-center text-muted-foreground">
                Todavía no hay fotos en la galería.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {photos.map((photo, index) => (
                  <FadeIn key={photo.id} delay={index * 0.03}>
                    <div className="group relative overflow-hidden bg-muted aspect-[4/3]">
                      <Image
                        src={photo.imagen_url}
                        alt={photo.titulo}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        loading={index < 6 ? "eager" : "lazy"}
                        className="object-contain transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-200" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
                        <span className="text-white text-sm font-semibold tracking-wide">
                          {photo.titulo}
                        </span>
                      </div>
                    </div>
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
