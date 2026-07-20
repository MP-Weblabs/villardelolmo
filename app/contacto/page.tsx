"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FadeIn } from "@/components/motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, ArrowRight, ArrowUpRight, Mail, MapPin, Phone, Send, CheckCircle, AlertCircle } from "lucide-react"
import { useCookieConsent } from "@/lib/cookie-consent"
import { useSiteInfo } from "@/lib/hooks/use-site-info"
import { createBrowserClient } from "@/lib/supabase/client"
import { DEFAULT_CONTACTO, DIRECCION_CLUB, parseContacto, parseJsonSafe, type ContactoContent } from "@/lib/site-content"

// Coordenadas del municipio de Villar del Olmo, Madrid.
const CLUB_LAT = 40.3363814
const CLUB_LON = -3.2355624

// Mapa embebido con OpenStreetMap: no requiere API key ni cuenta de Google,
// así que no se puede bloquear como el embed gratuito de Google Maps.
const MAP_BBOX = [CLUB_LON - 0.006, CLUB_LAT - 0.006, CLUB_LON + 0.006, CLUB_LAT + 0.006].join(",")
const MAPS_EMBED_SRC = `https://www.openstreetmap.org/export/embed.html?bbox=${MAP_BBOX}&layer=mapnik&marker=${CLUB_LAT},${CLUB_LON}`

// Enlace de salida a Google Maps para pedir indicaciones reales.
const GOOGLE_MAPS_DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  DIRECCION_CLUB.replace("\n", ", ")
)}`

export default function ContactoPage() {
  const { consent, accept } = useCookieConsent()
  const siteInfo = useSiteInfo()
  const [content, setContent] = useState<ContactoContent>(DEFAULT_CONTACTO)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    asunto: "",
    mensaje: ""
  })

  useEffect(() => {
    let cancelled = false
    const supabase = createBrowserClient()
    supabase
      .from("configuracion_web")
      .select("valor")
      .eq("clave", "pagina_contacto")
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled || !data?.valor) return
        setContent(parseContacto(parseJsonSafe(data.valor)))
      })
    return () => {
      cancelled = true
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Error al enviar el mensaje")
      }

      setSubmitted(true)
      setFormData({ nombre: "", email: "", asunto: "", mensaje: "" })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al enviar el mensaje")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero Header */}
        <section className="pt-32 pb-20 md:pt-40 md:pb-28 bg-primary relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <motion.div
              animate={{ x: [0, -500] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="whitespace-nowrap absolute bottom-0"
            >
              <span className="text-[20rem] font-bold text-white tracking-tighter">
                CONTACTO &nbsp; CONTACTO &nbsp; CONTACTO
              </span>
            </motion.div>
          </div>
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
                {content.tituloLinea1}<br />
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

        {/* Content */}
        <section className="py-24 md:py-40">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 xl:px-20">
            <div className="grid lg:grid-cols-12 gap-16 lg:gap-20">
              {/* Contact info */}
              <FadeIn direction="right" className="lg:col-span-5">
                <div>
                  <span className="text-xs font-semibold text-primary uppercase tracking-[0.25em] mb-6 block">
                    Información
                  </span>
                  <h2 className="text-headline text-3xl md:text-4xl text-foreground mb-10">
                    ENCUENTRA<br />
                    <span className="text-muted-foreground">NUESTRO CLUB</span>
                  </h2>
                  
                  <div className="space-y-6 mb-12">
                    {[
                      { icon: MapPin, label: "Dirección", value: DIRECCION_CLUB },
                      { icon: Mail, label: "Email", value: siteInfo.email, href: `mailto:${siteInfo.email}` },
                      { icon: Phone, label: "Teléfono", value: siteInfo.telefono, href: `tel:${siteInfo.telefono.replace(/[^0-9+]/g, "")}` },
                    ].map((item, index) => (
                      <motion.div 
                        key={index}
                        className="flex gap-5 p-5 bg-secondary/50 group hover:bg-primary transition-colors"
                        whileHover={{ x: 5 }}
                      >
                        <div className="w-12 h-12 bg-primary/10 group-hover:bg-white/10 flex items-center justify-center shrink-0 transition-colors">
                          <item.icon className="h-5 w-5 text-primary group-hover:text-white transition-colors" />
                        </div>
                        <div>
                          <span className="text-xs text-muted-foreground group-hover:text-white/60 uppercase tracking-[0.15em] mb-1 block transition-colors">
                            {item.label}
                          </span>
                          {item.href ? (
                            <a 
                              href={item.href}
                              className="text-foreground group-hover:text-white font-medium transition-colors whitespace-pre-line"
                            >
                              {item.value}
                            </a>
                          ) : (
                            <p className="text-foreground group-hover:text-white font-medium transition-colors whitespace-pre-line">
                              {item.value}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Map */}
                  <div className="aspect-[4/3] bg-muted overflow-hidden relative">
                    {consent === "accepted" ? (
                      <>
                        <iframe
                          src={MAPS_EMBED_SRC}
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          title="Ubicación del club"
                          className="grayscale hover:grayscale-0 transition-all duration-500"
                        />
                        <a
                          href={GOOGLE_MAPS_DIRECTIONS_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-background text-foreground text-xs font-semibold uppercase tracking-[0.1em] px-4 py-2.5 shadow-lg hover:bg-primary hover:text-white transition-colors"
                        >
                          Cómo llegar
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </a>
                      </>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-8 text-center">
                        <MapPin className="h-8 w-8 text-muted-foreground/50" />
                        <p className="text-sm text-muted-foreground max-w-xs">
                          El mapa lo proporciona OpenStreetMap y solo se carga si aceptas las cookies
                          de terceros.
                        </p>
                        <Button type="button" variant="outline" size="sm" onClick={accept}>
                          Aceptar y ver el mapa
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </FadeIn>

              {/* Contact form */}
              <FadeIn direction="left" delay={0.2} className="lg:col-span-7">
                <div className="bg-foreground p-10 md:p-14">
                  <span className="text-xs font-semibold text-primary uppercase tracking-[0.25em] mb-6 block">
                    Formulario
                  </span>
                  <h2 className="text-headline text-3xl md:text-4xl text-background mb-10">
                    ENVÍANOS UN<br />
                    <span className="text-background/40">MENSAJE</span>
                  </h2>
                  
                  {submitted ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="py-16 text-center"
                    >
                      <div className="w-20 h-20 bg-primary flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="h-10 w-10 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-background mb-3">
                        MENSAJE ENVIADO
                      </h3>
                      <p className="text-background/60 max-w-sm mx-auto">
                        Gracias por contactar con nosotros. Te responderemos lo antes posible.
                      </p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="nombre" className="text-background/60 text-xs uppercase tracking-[0.15em]">
                            Nombre
                          </Label>
                          <Input 
                            id="nombre" 
                            placeholder="Tu nombre"
                            required
                            value={formData.nombre}
                            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                            className="h-14 bg-background/5 border-background/10 text-background placeholder:text-background/30 focus:border-primary"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-background/60 text-xs uppercase tracking-[0.15em]">
                            Email
                          </Label>
                          <Input 
                            id="email" 
                            type="email"
                            placeholder="tu@email.com"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="h-14 bg-background/5 border-background/10 text-background placeholder:text-background/30 focus:border-primary"
                          />
                        </div>
                      </div>
                      {error && (
                        <div className="flex items-center gap-2 p-4 bg-red-500/20 text-red-200 text-sm">
                          <AlertCircle className="h-4 w-4 shrink-0" />
                          {error}
                        </div>
                      )}
                      <div className="space-y-2">
                        <Label htmlFor="asunto" className="text-background/60 text-xs uppercase tracking-[0.15em]">
                          Asunto
                        </Label>
                        <Input 
                          id="asunto" 
                          placeholder="Motivo de tu consulta"
                          required
                          value={formData.asunto}
                          onChange={(e) => setFormData({ ...formData, asunto: e.target.value })}
                          className="h-14 bg-background/5 border-background/10 text-background placeholder:text-background/30 focus:border-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="mensaje" className="text-background/60 text-xs uppercase tracking-[0.15em]">
                          Mensaje
                        </Label>
                        <Textarea 
                          id="mensaje" 
                          placeholder="Escribe tu mensaje aquí..."
                          rows={6}
                          required
                          value={formData.mensaje}
                          onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                          className="bg-background/5 border-background/10 text-background placeholder:text-background/30 focus:border-primary resize-none"
                        />
                      </div>
                      <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                        <Button 
                          type="submit" 
                          size="lg"
                          className="w-full h-14 bg-primary hover:bg-primary/90 text-sm font-semibold tracking-[0.1em] group"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "ENVIANDO..." : "ENVIAR MENSAJE"}
                          <ArrowRight className="ml-3 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </motion.div>
                    </form>
                  )}
                </div>
              </FadeIn>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
