import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { FadeIn, StaggerContainer } from "@/components/motion"
import { getSociosPageContent } from "@/lib/supabase/site-content"

export default async function SociosPage() {
  const content = await getSociosPageContent()

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header lightHero />
      <main className="flex-1 pt-20">
        {/* Hero */}
        <section className="relative py-24 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />

          <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
            <StaggerContainer className="text-center max-w-3xl mx-auto">
              <FadeIn>
                <span className="inline-block px-4 py-2 bg-primary/10 text-primary text-sm font-semibold tracking-wider uppercase rounded-full mb-6">
                  {content.heroBadge}
                </span>
              </FadeIn>
              <FadeIn>
                <h1 className="text-5xl md:text-7xl font-black text-foreground tracking-tight leading-none mb-6">
                  {content.heroTituloLinea1}
                  <span className="block text-primary">{content.heroTituloLinea2}</span>
                </h1>
              </FadeIn>
              <FadeIn>
                <p className="text-xl text-muted-foreground max-w-xl mx-auto mb-10">
                  {content.heroDescripcion}
                </p>
              </FadeIn>
              <FadeIn>
                <Link href={content.heroBotonUrl}>
                  <Button size="lg" className="h-14 px-8 rounded-xl font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 group">
                    {content.heroBotonTexto}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </FadeIn>
            </StaggerContainer>
          </div>
        </section>

        {/* Already member CTA */}
        <section className="py-24 bg-foreground text-background">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <FadeIn>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {content.miembroTitulo}
              </h2>
              <p className="text-background/70 mb-8 text-lg">
                {content.miembroDescripcion}
              </p>
              <Link href={content.miembroBotonUrl}>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 px-8 rounded-xl border-2 border-background/20 bg-transparent text-background hover:bg-background hover:text-foreground transition-all font-semibold"
                >
                  {content.miembroBotonTexto}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </FadeIn>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
