"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowDown } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { DEFAULT_HERO, type HeroContent } from "@/lib/site-content"

export function Hero({ content = DEFAULT_HERO }: { content?: HeroContent }) {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const scrollToContent = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
  }

  return (
    <section className="relative h-screen min-h-[700px] overflow-hidden bg-primary">
      {/* Image Background */}
      <div className="absolute inset-0">
        <Image
          src={content.imagenFondo}
          alt="Campo de fútbol Villar del Olmo"
          fill
          sizes="100vw"
          className="object-cover scale-105"
          priority
          quality={85}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/80" />
        <div className="absolute inset-0 bg-primary/20 mix-blend-multiply" />
      </div>

      {/* Main Content */}
      <div className="relative h-full flex flex-col justify-center">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 xl:px-20 w-full">
          <div className="max-w-4xl">
            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="mb-8"
            >
              <span className="block font-serif italic text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl text-white leading-none">
                {content.tituloLinea1}
              </span>
              <span className="block font-serif italic text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl leading-none" style={{ color: '#F5C518' }}>
                {content.tituloLinea2}
              </span>
              <span className="block font-serif italic text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl text-white leading-none">
                {content.tituloLinea3}
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.3, delay: 0.25 }}
              className="text-white/70 text-lg md:text-xl max-w-xl mb-12 leading-relaxed font-light"
            >
              {content.descripcion}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.3, delay: 0.35 }}
              className="flex flex-wrap gap-4"
            >
              <Link href={content.ctaPrimarioUrl}>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    size="lg"
                    className="bg-white text-primary hover:bg-white/95 text-sm font-semibold tracking-[0.1em] px-8 py-6 h-auto group"
                  >
                    {content.ctaPrimarioTexto}
                    <ArrowDown className="ml-3 h-4 w-4 rotate-[-90deg] transition-transform group-hover:translate-x-1" />
                  </Button>
                </motion.div>
              </Link>
              <Link href={content.ctaSecundarioUrl}>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/30 bg-transparent text-white hover:bg-white/10 text-sm font-semibold tracking-[0.1em] px-8 py-6 h-auto"
                  >
                    {content.ctaSecundarioTexto}
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        initial={{ opacity: 0, y: -10 }}
        animate={isLoaded ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.6 }}
        onClick={scrollToContent}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-3 text-white/50 hover:text-white transition-colors cursor-pointer group"
      >
        <span className="text-xs tracking-[0.2em] uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ArrowDown className="h-5 w-5" />
        </motion.div>
      </motion.button>
    </section>
  )
}
