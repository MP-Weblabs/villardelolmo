"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ClubLogo } from "@/components/club-logo"
import { Button } from "@/components/ui/button"
import { useSocio } from "@/lib/hooks/use-socio"
import { signOut } from "@/lib/supabase/auth-client"
import {
  Home,
  User,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Calendar
} from "lucide-react"

const navigation = [
  { name: "Inicio", href: "/socios/dashboard", icon: Home },
  { name: "Mi Perfil", href: "/socios/dashboard/perfil", icon: User },
  { name: "Eventos", href: "/socios/dashboard/eventos", icon: Calendar },
  { name: "Carnet Digital", href: "/socios/dashboard/carnet", icon: CreditCard },
  { name: "Ajustes", href: "/socios/dashboard/ajustes", icon: Settings },
]

export default function SociosDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { socio } = useSocio()

  const iniciales = socio
    ? `${socio.nombre?.[0] || ""}${socio.apellidos?.[0] || ""}`.toUpperCase()
    : "--"
  const nombreCompleto = socio ? `${socio.nombre} ${socio.apellidos}` : "Cargando..."

  const handleLogout = async () => {
    await signOut()
    router.push("/socios/login")
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-primary transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <Link href="/" className="flex items-center gap-3">
              <ClubLogo className="h-10 w-10" variant="white" />
              <div className="text-white">
                <div className="font-bold text-sm leading-tight">UD VILLAR</div>
                <div className="text-[10px] opacity-70">DEL OLMO</div>
              </div>
            </Link>
            <button
              className="lg:hidden text-white/70 hover:text-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? "bg-white text-primary font-medium"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5">
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">
                {iniciales}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white font-medium text-sm truncate">{nombreCompleto}</div>
                <div className="text-white/50 text-xs">Socio #{socio?.numero_socio || "----"}</div>
              </div>
            </div>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full mt-3 text-white/70 hover:text-white hover:bg-white/10 justify-start gap-3"
            >
              <LogOut className="h-5 w-5" />
              Cerrar sesión
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b">
          <div className="flex items-center justify-between h-16 px-4 lg:px-8">
            <button
              className="lg:hidden p-2 -ml-2 text-foreground/70 hover:text-foreground"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="hidden lg:block">
              <h1 className="text-lg font-semibold text-foreground">
                {navigation.find((item) => item.href === pathname)?.name || "Dashboard"}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              {/* User menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold">
                    {iniciales}
                  </div>
                  <ChevronDown className="h-4 w-4 text-foreground/50" />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 bg-card border rounded-lg shadow-xl py-1 z-50"
                    >
                      <div className="px-4 py-3 border-b">
                        <div className="font-medium">{nombreCompleto}</div>
                        <div className="text-sm text-muted-foreground">{socio?.email || ""}</div>
                      </div>
                      <Link
                        href="/socios/dashboard/perfil"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <User className="h-4 w-4" />
                        Mi perfil
                      </Link>
                      <Link
                        href="/socios/dashboard/ajustes"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Settings className="h-4 w-4" />
                        Ajustes
                      </Link>
                      <div className="border-t my-1" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Cerrar sesión
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
