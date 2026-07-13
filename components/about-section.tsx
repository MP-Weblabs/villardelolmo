"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { FadeIn } from "@/components/motion"
import { DEFAULT_ABOUT, type AboutContent } from "@/lib/site-content"

export function AboutSection({ content = DEFAULT_ABOUT }: { content?: AboutContent }) {
  return (
    <section className="py-24 md:py-40 bg-secondary/30 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 xl:px-20">
        <div className="max-w-3xl mx-auto text-center">
          {/* Content */}
          <FadeIn>
            <div>
              <span className="text-xs font-semibold text-primary uppercase tracking-[0.25em] mb-6 block">
                {content.badge}
              </span>
              <h2 className="text-headline text-4xl md:text-5xl lg:text-6xl text-foreground mb-8">
                {content.titulo}
              </h2>
              <div className="space-y-6 text-muted-foreground leading-relaxed text-lg">
                <p>{content.parrafo1}</p>
                <p>{content.parrafo2}</p>
                <p>{content.parrafo3}</p>
              </div>
              <Link
                href={content.enlaceUrl}
                className="group inline-flex items-center gap-4 mt-10"
              >
                <span className="text-sm font-semibold text-foreground tracking-[0.1em] uppercase group-hover:text-primary transition-colors">
                  {content.enlaceTexto}
                </span>
                <span className="w-12 h-12 flex items-center justify-center border border-foreground group-hover:border-primary group-hover:bg-primary group-hover:text-white transition-all">
                  <ArrowRight className="h-5 w-5" />
                </span>
              </Link>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
