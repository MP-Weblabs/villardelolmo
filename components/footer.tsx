"use client"

import Link from "next/link"
import { ClubLogo } from "./club-logo"
import { ArrowUpRight, Facebook, Instagram, Twitter, Youtube } from "lucide-react"
import { useSiteInfo } from "@/lib/hooks/use-site-info"
import type { SiteInfo } from "@/lib/site-content"

const navigation = {
  principal: [
    { name: "Inicio", href: "/" },
    { name: "Noticias", href: "/noticias" },
    { name: "Historia", href: "/historia" },
    { name: "Contacto", href: "/contacto" },
  ],
  socios: [
    { name: "Hazte Socio", href: "/socios" },
    { name: "Acceso Socios", href: "/socios/login" },
  ],
  legal: [
    { name: "Aviso Legal", href: "/aviso-legal" },
    { name: "Privacidad", href: "/privacidad" },
    { name: "Cookies", href: "/cookies" },
  ],
}

const socialLinks: { key: keyof SiteInfo; label: string; Icon: typeof Facebook }[] = [
  { key: "facebook", label: "Facebook", Icon: Facebook },
  { key: "instagram", label: "Instagram", Icon: Instagram },
  { key: "twitter", label: "Twitter / X", Icon: Twitter },
  { key: "youtube", label: "YouTube", Icon: Youtube },
]

export function Footer() {
  const siteInfo = useSiteInfo()
  const activeSocialLinks = socialLinks.filter((s) => siteInfo[s.key])

  return (
    <footer className="bg-foreground text-background">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 xl:px-20">
        <div className="py-20 md:py-28">
          <div className="grid md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
            {/* Brand */}
            <div className="lg:col-span-5">
              <Link href="/" className="flex items-center gap-4 mb-8 group">
                <ClubLogo className="h-14 w-14" variant="white" />
                <div>
                  <span className="text-xs font-semibold tracking-[0.2em] block text-background/60">
                    C.D. UNIÓN DEPORTIVA
                  </span>
                  <span className="text-xl font-bold tracking-tight text-background">
                    VILLAR DEL OLMO
                  </span>
                </div>
              </Link>
              <p className="text-background/60 leading-relaxed max-w-sm mb-8">
                Formando futbolistas y personas en el corazón de Madrid desde 1987.
                Décadas de historia y pasión por el fútbol base.
              </p>
              {activeSocialLinks.length > 0 && (
                <div className="flex gap-3">
                  {activeSocialLinks.map(({ key, label, Icon }) => (
                    <a
                      key={key}
                      href={siteInfo[key]}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="w-10 h-10 flex items-center justify-center bg-background/10 hover:bg-background/20 transition-colors rounded-full"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="lg:col-span-2">
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-background/40 mb-6">
                Navegación
              </h3>
              <ul className="space-y-4">
                {navigation.principal.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-background/70 hover:text-background transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Socios */}
            <div className="lg:col-span-2">
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-background/40 mb-6">
                Socios
              </h3>
              <ul className="space-y-4">
                {navigation.socios.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-background/70 hover:text-background transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="lg:col-span-3">
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-background/40 mb-6">
                Contacto
              </h3>
              <address className="not-italic space-y-4 text-sm text-background/70">
                <p className="whitespace-pre-line">{siteInfo.direccion}</p>
                <p className="pt-2">
                  <a
                    href={`mailto:${siteInfo.email}`}
                    className="hover:text-background transition-colors inline-flex items-center gap-2 group"
                  >
                    {siteInfo.email}
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </p>
                <p>
                  <a
                    href={`tel:${siteInfo.telefono.replace(/[^0-9+]/g, "")}`}
                    className="hover:text-background transition-colors inline-flex items-center gap-2 group"
                  >
                    {siteInfo.telefono}
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </p>
              </address>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="py-8 border-t border-background/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-background/40 tracking-wide">
            © {new Date().getFullYear()} UD VILLAR DEL OLMO. TODOS LOS DERECHOS RESERVADOS.
          </p>
          <div className="flex gap-8">
            {navigation.legal.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-xs text-background/40 hover:text-background transition-colors tracking-wide uppercase"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
