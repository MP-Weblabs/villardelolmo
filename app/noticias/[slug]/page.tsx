import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Calendar, Share2, Facebook, Twitter, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FadeIn, StaggerContainer, ScaleIn } from "@/components/motion"
import { ImagePlaceholder } from "@/components/image-placeholder"
import { getNoticiaBySlug, getNoticias } from "@/lib/supabase/noticias"

interface PageProps {
  params: Promise<{ slug: string }>
}

function formatDate(dateString: string | null) {
  if (!dateString) return ""
  return new Date(dateString).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export default async function NoticiaPage({ params }: PageProps) {
  const { slug } = await params

  let news: Awaited<ReturnType<typeof getNoticiaBySlug>> | null = null
  try {
    news = await getNoticiaBySlug(slug)
  } catch {
    news = null
  }

  if (!news) {
    notFound()
  }

  let relatedNews: Awaited<ReturnType<typeof getNoticias>> = []
  try {
    relatedNews = ((await getNoticias()) || []).filter((n) => n.id !== news.id).slice(0, 3)
  } catch {
    relatedNews = []
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header lightHero />
      <main className="flex-1 pt-20">
        {/* Hero Header */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />

          <div className="relative max-w-4xl mx-auto px-6 lg:px-8">
            <StaggerContainer>
              <FadeIn>
                <Link
                  href="/noticias"
                  className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 text-sm font-medium transition-colors group"
                >
                  <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                  Todas las noticias
                </Link>
              </FadeIn>

              <FadeIn>
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  {news.categoria && (
                    <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold tracking-wider uppercase rounded-full">
                      {news.categoria.nombre}
                    </span>
                  )}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      {formatDate(news.fecha_publicacion)}
                    </span>
                  </div>
                </div>
              </FadeIn>

              <FadeIn>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground tracking-tight leading-tight text-balance mb-8">
                  {news.titulo}
                </h1>
              </FadeIn>

              {news.extracto && (
                <FadeIn>
                  <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl">
                    {news.extracto}
                  </p>
                </FadeIn>
              )}
            </StaggerContainer>
          </div>
        </section>

        {/* Featured Image */}
        <section className="relative">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <ScaleIn>
              <div className="aspect-[21/9] rounded-3xl overflow-hidden bg-muted shadow-2xl relative">
                {news.imagen_principal ? (
                  <Image
                    src={news.imagen_principal}
                    alt={news.titulo}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <ImagePlaceholder />
                )}
              </div>
            </ScaleIn>
          </div>
        </section>

        {/* Article Content */}
        <article className="py-16 md:py-24">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <FadeIn>
              <div className="prose prose-lg max-w-none">
                <div className="space-y-6 text-foreground/90 leading-relaxed text-lg whitespace-pre-line">
                  {news.contenido}
                </div>
              </div>
            </FadeIn>

            {/* Share */}
            <FadeIn>
              <div className="mt-12 pt-8 border-t border-border">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Share2 className="h-4 w-4" />
                    Compartir noticia
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full h-10 w-10 p-0 hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition-colors"
                      asChild
                    >
                      <a
                        href={`https://facebook.com/sharer/sharer.php?u=https://udvillardelolmo.es/noticias/${news.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Facebook className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full h-10 w-10 p-0 hover:bg-black hover:text-white hover:border-black transition-colors"
                      asChild
                    >
                      <a
                        href={`https://twitter.com/intent/tweet?url=https://udvillardelolmo.es/noticias/${news.slug}&text=${encodeURIComponent(news.titulo)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Twitter className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </article>

        {/* Related News */}
        {relatedNews.length > 0 && (
          <section className="py-20 md:py-28 bg-muted/30 border-t border-border">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <FadeIn>
                <div className="flex items-center justify-between mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                    Más noticias
                  </h2>
                  <Link href="/noticias">
                    <Button variant="ghost" className="group">
                      Ver todas
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </FadeIn>

              <div className="grid md:grid-cols-3 gap-8">
                {relatedNews.map((item, index) => (
                  <ScaleIn key={item.id} delay={index * 0.1}>
                    <Link href={`/noticias/${item.slug}`} className="group block">
                      <article className="h-full">
                        <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-muted mb-5 relative">
                          {item.imagen_principal ? (
                            <Image
                              src={item.imagen_principal}
                              alt={item.titulo}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <ImagePlaceholder />
                          )}
                        </div>
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-xs text-muted-foreground">
                            {formatDate(item.fecha_publicacion)}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                          {item.titulo}
                        </h3>
                      </article>
                    </Link>
                  </ScaleIn>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  )
}
