"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ArrowRight, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ClubLogo } from "@/components/club-logo"
import { cn } from "@/lib/utils"

const clubSubmenu = [
  { name: "EQUIPOS", href: "/club/equipos" },
  { name: "INSTALACIONES", href: "/club/instalaciones" },
]

const navigation = [
  { name: "INICIO", href: "/" },
  { name: "EL CLUB", href: "/historia", submenu: clubSubmenu },
  { name: "HISTORIA", href: "/historia" },
  { name: "GALERÍA", href: "/galeria" },
  { name: "NOTICIAS", href: "/noticias" },
  { name: "CONTACTO", href: "/contacto" },
]

export function Header({ lightHero = false }: { lightHero?: boolean }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolledRaw, setScrolled] = useState(false)
  const scrolled = scrolledRaw || lightHero
  const [clubDropdownOpen, setClubDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Prefetch all routes on mount for instant navigation
  useEffect(() => {
    const routes = ["/", "/club/equipos", "/club/instalaciones", "/historia", "/galeria", "/noticias", "/contacto", "/socios", "/socios/login"]
    routes.forEach(route => {
      router.prefetch(route)
    })
  }, [router])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setClubDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-200",
          scrolled 
            ? "bg-background/98 backdrop-blur-xl shadow-sm" 
            : "bg-transparent"
        )}
      >
        <nav className="mx-auto flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 lg:px-12 xl:px-20">
          <Link href="/" className="flex items-center gap-2 sm:gap-4 group shrink-0">
            <motion.div
              whileHover={{ rotate: 5 }}
              transition={{ duration: 0.3 }}
            >
              <ClubLogo className="h-14 w-14 sm:h-16 sm:w-16 transition-transform" />
            </motion.div>
            <div className="hidden sm:block">
              <span className={cn(
                "text-xs font-semibold tracking-[0.2em] transition-colors block",
                scrolled ? "text-primary" : "text-white"
              )}>
                C.D. UNIÓN DEPORTIVA
              </span>
              <span className={cn(
                "text-lg font-bold tracking-tight transition-colors",
                scrolled ? "text-foreground" : "text-white"
              )}>
                VILLAR DEL OLMO
              </span>
            </div>
          </Link>

          <div className="hidden lg:flex lg:items-center lg:gap-1">
            {navigation.map((item) =>
              item.submenu ? (
                <div key={item.name} className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setClubDropdownOpen(!clubDropdownOpen)}
                    className="group relative px-5 py-2 flex items-center gap-1"
                  >
                    <span className={cn(
                      "text-xs font-semibold tracking-[0.15em] transition-colors",
                      scrolled ? "text-foreground group-hover:text-primary" : "text-white/90 group-hover:text-white"
                    )}>
                      {item.name}
                    </span>
                    <ChevronDown className={cn(
                      "h-3 w-3 transition-all duration-200",
                      scrolled ? "text-foreground group-hover:text-primary" : "text-white/90 group-hover:text-white",
                      clubDropdownOpen ? "rotate-180" : ""
                    )} />
                    <span className="absolute bottom-0 left-5 right-5 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                  </button>
                  <AnimatePresence>
                    {clubDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.12 }}
                        className="absolute left-0 top-full mt-1 w-44 bg-background border border-border shadow-lg"
                      >
                        {item.submenu.map((sub) => (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            className="block px-5 py-3 text-xs font-semibold tracking-[0.12em] text-foreground hover:text-primary hover:bg-secondary/50 transition-colors"
                            onClick={() => setClubDropdownOpen(false)}
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className="group relative px-5 py-2"
                >
                  <span className={cn(
                    "text-xs font-semibold tracking-[0.15em] transition-colors",
                    scrolled ? "text-foreground group-hover:text-primary" : "text-white/90 group-hover:text-white"
                  )}>
                    {item.name}
                  </span>
                  <span className="absolute bottom-0 left-5 right-5 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                </Link>
              )
            )}
          </div>

          <div className="hidden lg:flex lg:items-center lg:gap-4">
            <Link href="/socios/login">
              <motion.span 
                className={cn(
                  "text-xs font-semibold tracking-[0.1em] transition-colors cursor-pointer whitespace-nowrap",
                  scrolled ? "text-muted-foreground hover:text-foreground" : "text-white/70 hover:text-white"
                )}
                whileHover={{ x: 3 }}
              >
                ACCESO SOCIOS
              </motion.span>
            </Link>
            <Link href="/socios">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold tracking-[0.1em] px-4 py-5 group whitespace-nowrap"
                >
                  HAZTE SOCIO
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </motion.div>
            </Link>
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            type="button"
            className={cn(
              "lg:hidden p-2 transition-colors",
              scrolled ? "text-foreground" : "text-white"
            )}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Abrir menú</span>
            <AnimatePresence mode="wait">
              {mobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <X className="h-6 w-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Menu className="h-6 w-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </nav>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-primary lg:hidden"
          >
            <motion.nav 
              className="flex flex-col justify-center items-center h-full gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.05 }}
            >
              {navigation.map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.03 }}
                  className="flex flex-col items-center"
                >
                  <Link
                    href={item.href}
                    className="text-4xl font-bold text-white tracking-tight hover:opacity-70 transition-opacity"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                  {item.submenu && (
                    <div className="flex gap-6 mt-2">
                      {item.submenu.map((sub) => (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          className="text-sm font-semibold text-white/60 tracking-[0.15em] hover:text-white transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="flex flex-col gap-4 mt-8"
              >
                <Link href="/socios/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" size="lg" className="w-full bg-transparent border-white text-white hover:bg-white hover:text-primary">
                    ACCESO SOCIOS
                  </Button>
                </Link>
                <Link href="/socios" onClick={() => setMobileMenuOpen(false)}>
                  <Button size="lg" className="w-full bg-white text-primary hover:bg-white/90">
                    HAZTE SOCIO
                  </Button>
                </Link>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
