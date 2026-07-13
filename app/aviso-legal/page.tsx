import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FadeIn } from "@/components/motion"
import { LegalSection } from "@/components/legal-section"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function AvisoLegalPage() {
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
              Aviso Legal
            </h1>
            <p className="text-sm text-muted-foreground mb-12">
              Última actualización: pendiente de publicación definitiva.
            </p>
          </FadeIn>

          <FadeIn>
            <LegalSection number="1" title="Datos del titular">
              <p>
                El titular de este sitio web es <strong>CDE Unión Deportiva Villar del Olmo</strong>,
                con CIF <strong>G84394519</strong>, inscrito con el número <strong>3931</strong> en
                la Sección de Clubes Deportivos Elementales del Registro de Entidades Deportivas de
                la Comunidad de Madrid.
              </p>
              <p>
                Domicilio social: Campo Municipal de Fútbol, 28511 Villar del Olmo, Madrid.
              </p>
              <p>
                Representante legal: Félix Horcajo Magano.
              </p>
              <p>
                Datos de contacto:{" "}
                <a href="mailto:villardelolmo.ud@gmail.com" className="text-primary hover:underline">
                  villardelolmo.ud@gmail.com
                </a>.
              </p>
            </LegalSection>

            <LegalSection number="2" title="Objeto">
              <p>
                Este sitio web tiene como finalidad informar sobre la actividad del club, sus
                equipos, noticias y eventos, así como ofrecer un canal de contacto y un área
                privada para sus socios.
              </p>
            </LegalSection>

            <LegalSection number="3" title="Condiciones de uso">
              <p>
                El acceso y uso de este sitio web implica la aceptación de las condiciones aquí
                establecidas. El usuario se compromete a hacer un uso adecuado de los contenidos y
                servicios que el club ofrece a través de su sitio web.
              </p>
            </LegalSection>

            <LegalSection number="4" title="Propiedad intelectual">
              <p>
                Los contenidos de este sitio web (textos, imágenes, escudo y diseño) son
                propiedad del club o se utilizan con la correspondiente autorización. Queda
                prohibida su reproducción sin permiso expreso.
              </p>
            </LegalSection>

            <LegalSection number="5" title="Responsabilidad">
              <p>
                El club no se hace responsable de los daños que pudieran derivarse de
                interferencias, interrupciones o errores en el funcionamiento del sitio web por
                causas ajenas a su control.
              </p>
            </LegalSection>

            <LegalSection number="6" title="Legislación aplicable">
              <p>
                Las presentes condiciones se rigen por la legislación española. Para cualquier
                cuestión relacionada con este sitio web puedes escribirnos a{" "}
                <a href="mailto:villardelolmo.ud@gmail.com" className="text-primary hover:underline">
                  villardelolmo.ud@gmail.com
                </a>.
              </p>
            </LegalSection>
          </FadeIn>
        </div>
      </main>
      <Footer />
    </div>
  )
}
