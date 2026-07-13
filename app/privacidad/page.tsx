import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FadeIn } from "@/components/motion"
import { LegalSection, Pendiente } from "@/components/legal-section"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function PrivacidadPage() {
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
              Política de Privacidad
            </h1>
            <p className="text-sm text-muted-foreground mb-12">
              Última actualización: pendiente de publicación definitiva.
            </p>
          </FadeIn>

          <FadeIn>
            <LegalSection number="1" title="Responsable del tratamiento">
              <p>
                Responsable: <strong>CDE Unión Deportiva Villar del Olmo</strong>, con CIF{" "}
                <strong>G84394519</strong>, inscrito con el número <strong>3931</strong> en la
                Sección de Clubes Deportivos Elementales del Registro de Entidades Deportivas de
                la Comunidad de Madrid.
              </p>
              <p>
                Domicilio social: Campo Municipal de Fútbol, 28511 Villar del Olmo, Madrid.
              </p>
              <p>
                Representante legal: Félix Horcajo Magano.
              </p>
              <p>
                Contacto:{" "}
                <a href="mailto:villardelolmo.ud@gmail.com" className="text-primary hover:underline">
                  villardelolmo.ud@gmail.com
                </a>.
              </p>
            </LegalSection>

            <LegalSection number="2" title="Qué datos recogemos y para qué">
              <p>A través de esta web se recogen los siguientes datos personales:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Formulario de contacto:</strong> nombre, email, teléfono y el mensaje
                  que escribas, para poder responder a tu consulta.
                </li>
                <li>
                  <strong>Área de socios:</strong> nombre, DNI, dirección, fecha de nacimiento y
                  forma de pago de la cuota. Estos datos los introduce el personal del club tras
                  el alta presencial en sus oficinas, no se recogen directamente a través de un
                  formulario público.
                </li>
              </ul>
            </LegalSection>

            <LegalSection number="3" title="Base legal del tratamiento">
              <p>
                El tratamiento de los datos del formulario de contacto se basa en tu
                consentimiento al enviarlo. El tratamiento de los datos de los socios se basa en
                la relación asociativa/contractual entre el club y sus socios.
              </p>
            </LegalSection>

            <LegalSection number="4" title="Plazo de conservación">
              <Pendiente>
                Cuánto tiempo se conservan los mensajes de contacto, y cuánto tiempo se conservan
                los datos de un socio tras darse de baja.
              </Pendiente>
            </LegalSection>

            <LegalSection number="5" title="Destinatarios de los datos">
              <p>
                Los datos se almacenan en servidores de nuestros proveedores tecnológicos
                (Vercel para el alojamiento de la web y Supabase para la base de datos), que
                actúan como encargados del tratamiento.
              </p>
              <Pendiente>
                Si los datos de los socios se comparten con alguien más (federación de fútbol,
                gestoría, seguro deportivo), debe indicarse aquí.
              </Pendiente>
            </LegalSection>

            <LegalSection number="6" title="Menores de edad">
              <Pendiente>
                Cómo se obtiene y documenta el consentimiento del padre/madre/tutor legal para el
                tratamiento de los datos de un socio menor de edad (por ejemplo, si se firma algún
                documento en el momento del alta presencial).
              </Pendiente>
            </LegalSection>

            <LegalSection number="7" title="Tus derechos">
              <p>
                Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición,
                limitación y portabilidad de tus datos escribiendo a{" "}
                <a href="mailto:villardelolmo.ud@gmail.com" className="text-primary hover:underline">
                  villardelolmo.ud@gmail.com
                </a>.
              </p>
            </LegalSection>

            <LegalSection number="8" title="Cookies">
              <p>
                Esta web utiliza cookies propias y, si lo aceptas, de terceros. Puedes consultar
                el detalle completo en nuestra{" "}
                <Link href="/cookies" className="text-primary hover:underline">
                  Política de Cookies
                </Link>.
              </p>
            </LegalSection>
          </FadeIn>
        </div>
      </main>
      <Footer />
    </div>
  )
}
