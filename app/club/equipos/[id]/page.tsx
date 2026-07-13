import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FadeIn } from "@/components/motion"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { ArrowLeft, ImageOff, Shield, User } from "lucide-react"
import { getEquipoByIdActivo } from "@/lib/supabase/equipos"

const posicionLabel: Record<string, string> = {
  Portero: "Portero",
  Defensa: "Defensa",
  Centrocampista: "Centrocampista",
  Delantero: "Delantero",
}

export default async function EquipoDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  let equipo: Awaited<ReturnType<typeof getEquipoByIdActivo>> | null = null
  try {
    equipo = await getEquipoByIdActivo(id)
  } catch {
    equipo = null
  }

  if (!equipo) notFound()

  const jugadores = [...(equipo.jugadores || [])].sort((a, b) => {
    if (a.dorsal == null) return 1
    if (b.dorsal == null) return -1
    return a.dorsal - b.dorsal
  })

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-primary relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 xl:px-20 relative">
            <FadeIn>
              <Link
                href="/club/equipos"
                className="inline-flex items-center text-white/60 hover:text-white mb-8 text-sm transition-colors group"
              >
                <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
                <span className="tracking-[0.1em] uppercase">Equipos</span>
              </Link>
            </FadeIn>
            <FadeIn delay={0.1}>
              <span className="inline-block px-3 py-1 bg-white/10 text-primary-foreground text-xs font-semibold tracking-[0.2em] uppercase rounded-full mb-4">
                {equipo.categoria?.nombre || "Sin categoría"} · {equipo.temporada}
              </span>
              <h1 className="text-display text-4xl md:text-6xl lg:text-7xl text-white mb-4 uppercase">
                {equipo.nombre}
              </h1>
            </FadeIn>
            {equipo.descripcion && (
              <FadeIn delay={0.2}>
                <p className="text-white/70 text-lg max-w-xl">{equipo.descripcion}</p>
              </FadeIn>
            )}
          </div>
        </section>

        <section className="py-16 md:py-24 bg-background">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 xl:px-20 grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1 space-y-6">
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted rounded-lg">
                {equipo.imagen_url ? (
                  <Image src={equipo.imagen_url} alt={equipo.nombre} fill className="object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ImageOff className="h-10 w-10 text-muted-foreground/40" />
                  </div>
                )}
              </div>

              <div className="space-y-4 border border-border rounded-lg p-6">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-primary shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Entrenador</p>
                    <p className="font-medium">{equipo.entrenador || "Sin asignar"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-primary shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Delegado</p>
                    <p className="font-medium">{equipo.delegado || "Sin asignar"}</p>
                  </div>
                </div>
                {equipo.grupo_liga && (
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-primary shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Grupo / Liga</p>
                      <p className="font-medium">{equipo.grupo_liga}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold tracking-tight mb-6 uppercase">
                Plantilla ({jugadores.length})
              </h2>

              {jugadores.length === 0 ? (
                <p className="text-muted-foreground py-12 text-center border border-dashed border-border rounded-lg">
                  Todavía no hay jugadores publicados en este equipo.
                </p>
              ) : (
                <div className="grid sm:grid-cols-2 gap-3">
                  {jugadores.map((jugador) => (
                    <div
                      key={jugador.id}
                      className="flex items-center gap-4 border border-border rounded-lg p-4"
                    >
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        {jugador.dorsal != null ? (
                          <span className="text-sm font-bold text-primary">{jugador.dorsal}</span>
                        ) : (
                          <User className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {jugador.nombre} {jugador.apellidos}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {jugador.posicion ? posicionLabel[jugador.posicion] : "Posición sin especificar"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
