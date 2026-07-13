import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FadeIn, StaggerContainer, StaggerItem, ScaleOnHover } from "@/components/motion"
import { ValueCard, TimelineRow } from "./hover-items"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getHistoriaContent } from "@/lib/supabase/site-content"

export default async function HistoriaPage() {
  const { content, timeline, valores } = await getHistoriaContent()

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

        {/* Section 1 — Historia del Club: Imagen izquierda + Texto derecha */}
        <section className="py-20 md:py-32 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 xl:px-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Imagen del equipo */}
              <FadeIn>
                <div className="relative aspect-[4/3] w-full overflow-hidden shadow-lg">
                  <Image
                    src="/images/historia-equipo-real.jpg"
                    alt="Equipo C.D. Unión Deportiva Villar del Olmo"
                    fill
                    className="object-cover"
                  />
                </div>
              </FadeIn>
              
              {/* Texto historia del club */}
              <FadeIn delay={0.2}>
                <div className="space-y-6">
                  <span className="text-xs font-semibold text-primary uppercase tracking-[0.25em]">
                    {content.clubBadge}
                  </span>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                    {content.clubTitulo}
                  </h2>
                  <div className="space-y-4 text-foreground/70 leading-relaxed">
                    <p>{content.clubParrafo1}</p>
                    <p>{content.clubParrafo2}</p>
                    <p>{content.clubParrafo3}</p>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Section 2 — Historia del Pueblo: Texto izquierda + Imagen derecha */}
        <section className="py-20 md:py-32 bg-foreground">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 xl:px-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Texto historia del pueblo */}
              <FadeIn>
                <div className="space-y-6">
                  <span className="text-xs font-semibold text-primary uppercase tracking-[0.25em]">
                    {content.puebloBadge}
                  </span>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                    {content.puebloTitulo}
                  </h2>
                  <div className="space-y-4 text-white/70 leading-relaxed">
                    <p>{content.puebloParrafo1}</p>
                    <p>{content.puebloParrafo2}</p>
                    <p>{content.puebloParrafo3}</p>
                  </div>
                </div>
              </FadeIn>
              
              {/* Imagen del ayuntamiento */}
              <FadeIn delay={0.2}>
                <div className="relative aspect-[4/3] w-full overflow-hidden shadow-lg">
                  <Image
                    src="/images/historia-ayuntamiento-real.jpg"
                    alt="Ayuntamiento de Villar del Olmo"
                    fill
                    className="object-cover"
                  />
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-24 md:py-40">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 xl:px-20">
            <FadeIn className="mb-20">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                  <span className="text-xs font-semibold text-primary uppercase tracking-[0.25em] mb-6 block">
                    Lo que nos define
                  </span>
                  <h2 className="text-headline text-4xl md:text-5xl text-foreground">
                    NUESTROS<br />
                    <span className="text-muted-foreground">VALORES</span>
                  </h2>
                </div>
              </div>
            </FadeIn>
            <StaggerContainer className="grid md:grid-cols-2 gap-1" staggerDelay={0.1}>
              {valores.map((value, index) => (
                <StaggerItem key={index}>
                  <ValueCard className="p-10 md:p-12 bg-secondary/50 group hover:bg-primary transition-colors duration-500">
                    <span className="text-xs font-semibold text-primary group-hover:text-white/60 tracking-[0.2em] mb-6 block transition-colors">
                      {value.numero}
                    </span>
                    <h3 className="text-2xl font-bold text-foreground group-hover:text-white mb-4 tracking-tight transition-colors">
                      {value.titulo}
                    </h3>
                    <p className="text-muted-foreground group-hover:text-white/70 leading-relaxed transition-colors">
                      {value.descripcion}
                    </p>
                  </ValueCard>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-24 md:py-40 bg-foreground">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 xl:px-20">
            <FadeIn>
              <div className="text-center mb-20">
                <span className="text-xs font-semibold text-primary uppercase tracking-[0.25em] mb-6 block">
                  Nuestra trayectoria
                </span>
                <h2 className="text-headline text-4xl md:text-5xl text-background">
                  HITOS DEL CLUB
                </h2>
              </div>
            </FadeIn>
            <StaggerContainer className="max-w-4xl mx-auto">
              {timeline.map((item, index) => (
                <StaggerItem key={index}>
                  <TimelineRow className="flex gap-8 md:gap-16 items-start py-8 border-b border-background/10 group">
                    <div className="text-5xl md:text-7xl font-bold text-primary w-32 md:w-40 shrink-0 tracking-tighter">
                      {item.anio}
                    </div>
                    <div className="pt-3 md:pt-5">
                      <p className="text-background text-lg md:text-xl font-medium group-hover:text-primary transition-colors">
                        {item.evento}
                      </p>
                    </div>
                  </TimelineRow>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 md:py-32 bg-secondary/30">
          <div className="max-w-4xl mx-auto px-6 lg:px-12 xl:px-20 text-center">
            <FadeIn>
              <h2 className="text-headline text-3xl md:text-4xl text-foreground mb-6">
                FORMA PARTE DE NUESTRA HISTORIA
              </h2>
              <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
                Inscripciones abiertas para todas las categorías.
              </p>
              <Link href="/contacto">
                <ScaleOnHover className="inline-block">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-foreground text-foreground hover:bg-foreground hover:text-background text-sm font-semibold tracking-[0.15em] px-12 py-6 h-auto"
                  >
                    CONTACTAR
                  </Button>
                </ScaleOnHover>
              </Link>
            </FadeIn>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
