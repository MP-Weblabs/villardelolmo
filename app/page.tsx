import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { NewsSection } from "@/components/news-section"
import { AboutSection } from "@/components/about-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"
import { getHomeContent } from "@/lib/supabase/site-content"

export default async function HomePage() {
  const { hero, about, cta, siteInfo } = await getHomeContent()

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <Hero content={hero} />
        <NewsSection />
        <AboutSection content={about} />
        <CTASection content={cta} siteInfo={siteInfo} />
      </main>
      <Footer />
    </div>
  )
}
