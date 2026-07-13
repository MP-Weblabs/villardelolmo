"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Mail, Phone } from "lucide-react"
import { FadeIn } from "@/components/motion"
import { DEFAULT_CTA, DEFAULT_SITE_INFO, type CtaContent, type SiteInfo } from "@/lib/site-content"

export function CTASection({
  content = DEFAULT_CTA,
  siteInfo = DEFAULT_SITE_INFO,
}: {
  content?: CtaContent
  siteInfo?: SiteInfo
}) {
  return (
    <section className="relative py-32 md:py-48 bg-primary overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i}
              className="absolute border border-white/20 rounded-full"
              style={{
                width: `${(i + 1) * 300}px`,
                height: `${(i + 1) * 300}px`,
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 xl:px-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <FadeIn direction="right">
            <div>
              <span className="text-xs font-semibold text-white/60 uppercase tracking-[0.25em] mb-6 block">
                {content.badge}
              </span>
              <h2 className="text-headline text-4xl md:text-5xl lg:text-6xl text-white mb-8">
                {content.tituloLinea1}
                <br />
                <span className="text-white/50">{content.tituloLinea2}</span>
              </h2>
              <p className="text-white/70 text-lg md:text-xl max-w-md leading-relaxed mb-10">
                {content.descripcion}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href={content.botonPrimarioUrl}>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      size="lg"
                      className="bg-white text-primary hover:bg-white/95 text-sm font-semibold tracking-[0.1em] px-8 py-6 h-auto w-full sm:w-auto group"
                    >
                      {content.botonPrimarioTexto}
                      <ArrowRight className="ml-3 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </motion.div>
                </Link>
                <Link href={content.botonSecundarioUrl}>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-white/30 bg-transparent text-white hover:bg-white/10 text-sm font-semibold tracking-[0.1em] px-8 py-6 h-auto w-full sm:w-auto"
                    >
                      {content.botonSecundarioTexto}
                    </Button>
                  </motion.div>
                </Link>
              </div>
            </div>
          </FadeIn>

          {/* Contact Cards */}
          <FadeIn direction="left" delay={0.2}>
            <div className="space-y-4">
              <motion.a
                href={`mailto:${siteInfo.email}`}
                className="flex items-center gap-6 p-6 bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors group"
                whileHover={{ x: 10 }}
              >
                <div className="w-14 h-14 flex items-center justify-center bg-white/10">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-xs text-white/50 uppercase tracking-[0.15em] mb-1">Email</div>
                  <div className="text-white font-medium group-hover:text-white/80 transition-colors">
                    {siteInfo.email}
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-white/50 ml-auto group-hover:text-white transition-colors" />
              </motion.a>
              <motion.a
                href={`tel:${siteInfo.telefono.replace(/[^0-9+]/g, "")}`}
                className="flex items-center gap-6 p-6 bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors group"
                whileHover={{ x: 10 }}
              >
                <div className="w-14 h-14 flex items-center justify-center bg-white/10">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-xs text-white/50 uppercase tracking-[0.15em] mb-1">Teléfono</div>
                  <div className="text-white font-medium group-hover:text-white/80 transition-colors">
                    {siteInfo.telefono}
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-white/50 ml-auto group-hover:text-white transition-colors" />
              </motion.a>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
