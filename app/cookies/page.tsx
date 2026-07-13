"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FadeIn } from "@/components/motion"
import { LegalSection } from "@/components/legal-section"
import { Button } from "@/components/ui/button"
import { useCookieConsent } from "@/lib/cookie-consent"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

const cookiesTecnicas = [
  {
    nombre: "sb-*-auth-token",
    proveedor: "Supabase (propia)",
    finalidad: "Mantener tu sesión iniciada en el área de socios o en el panel de administración.",
    duracion: "Mientras dura la sesión / hasta cerrar sesión",
  },
]

const cookiesTerceros = [
  {
    nombre: "Cookies de Google Maps",
    proveedor: "Google",
    finalidad: "Mostrar el mapa interactivo de la ubicación del club en la página de Contacto.",
    duracion: "Variable, gestionada por Google",
  },
]

export default function CookiesPage() {
  const { reset } = useCookieConsent()

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header lightHero />
      <main className="flex-1 pt-32 pb-24 md:pt-40">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <FadeIn>
            <Link
              href="/"
              className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 text-sm font-medium transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Volver
            </Link>
          </FadeIn>
          <FadeIn>
            <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight mb-4">
              Política de Cookies
            </h1>
            <p className="text-sm text-muted-foreground mb-12">
              Última actualización: pendiente de publicación definitiva.
            </p>
          </FadeIn>

          <FadeIn>
            <LegalSection number="1" title="¿Qué son las cookies?">
              <p>
                Las cookies son pequeños archivos que se almacenan en tu dispositivo al visitar
                una web. Pueden ser necesarias para que la web funcione correctamente, o
                utilizarse para otros fines, como mostrar contenido de terceros.
              </p>
            </LegalSection>

            <LegalSection number="2" title="Cookies técnicas necesarias">
              <p>
                Estas cookies son imprescindibles para el funcionamiento de la web y no requieren
                tu consentimiento. Se usan, por ejemplo, para mantener tu sesión iniciada si
                accedes como socio o administrador.
              </p>
              <div className="overflow-x-auto mt-4 rounded-lg border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-3 font-semibold">Cookie</th>
                      <th className="text-left p-3 font-semibold">Proveedor</th>
                      <th className="text-left p-3 font-semibold">Finalidad</th>
                      <th className="text-left p-3 font-semibold">Duración</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cookiesTecnicas.map((c) => (
                      <tr key={c.nombre} className="border-t border-border">
                        <td className="p-3 font-mono text-xs">{c.nombre}</td>
                        <td className="p-3">{c.proveedor}</td>
                        <td className="p-3">{c.finalidad}</td>
                        <td className="p-3">{c.duracion}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </LegalSection>

            <LegalSection number="3" title="Cookies de terceros (requieren tu consentimiento)">
              <p>
                Estas cookies solo se activan si las aceptas en el aviso de cookies de la web.
              </p>
              <div className="overflow-x-auto mt-4 rounded-lg border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-3 font-semibold">Cookie</th>
                      <th className="text-left p-3 font-semibold">Proveedor</th>
                      <th className="text-left p-3 font-semibold">Finalidad</th>
                      <th className="text-left p-3 font-semibold">Duración</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cookiesTerceros.map((c) => (
                      <tr key={c.nombre} className="border-t border-border">
                        <td className="p-3 font-mono text-xs">{c.nombre}</td>
                        <td className="p-3">{c.proveedor}</td>
                        <td className="p-3">{c.finalidad}</td>
                        <td className="p-3">{c.duracion}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </LegalSection>

            <LegalSection number="4" title="Analítica sin cookies">
              <p>
                Utilizamos Vercel Analytics para conocer el número de visitas de forma agregada.
                No utiliza cookies ni identifica a usuarios individuales.
              </p>
            </LegalSection>

            <LegalSection number="5" title="Cómo gestionar tus preferencias">
              <p>
                Puedes cambiar tu decisión sobre las cookies no esenciales en cualquier momento
                desde aquí:
              </p>
              <Button onClick={reset} variant="outline" className="mt-2">
                Cambiar mis preferencias de cookies
              </Button>
            </LegalSection>
          </FadeIn>
        </div>
      </main>
      <Footer />
    </div>
  )
}
