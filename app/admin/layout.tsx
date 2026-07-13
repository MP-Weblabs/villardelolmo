"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ClubLogo } from "@/components/club-logo"
import { Button } from "@/components/ui/button"
import { createBrowserClient } from "@/lib/supabase/client"
import { signOut } from "@/lib/supabase/auth-client"
import {
  LayoutDashboard,
  Users,
  Newspaper,
  Shield,
  Settings,
  BarChart3,
  Menu,
  X,
  LogOut,
  ChevronDown,
  User,
  Image as ImageIcon,
  Calendar,
  LayoutTemplate
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Contenido del Sitio", href: "/admin/contenido", icon: LayoutTemplate },
  { name: "Socios", href: "/admin/socios", icon: Users },
  { name: "Noticias", href: "/admin/noticias", icon: Newspaper },
  { name: "Eventos", href: "/admin/eventos", icon: Calendar },
  { name: "Galería", href: "/admin/galeria", icon: ImageIcon },
  { name: "Equipos", href: "/admin/equipos", icon: Shield },
  { name: "Estadísticas", href: "/admin/estadisticas", icon: BarChart3 },
  { name: "Configuración", href: "/admin/configuracion", icon: Settings },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [userInfo, setUserInfo] = useState<{ nombre: string; email: string } | null>(null)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (pathname === "/admin/login") return
    const supabase = createBrowserClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      setUserInfo({
        nombre: user.email?.split("@")[0] || "Admin",
        email: user.email || "",
      })
    })
  }, [pathname])

  const handleLogout = async () => {
    await signOut()
    router.push("/admin/login")
    router.refresh()
  }

  // El login de admin tiene su propio layout sin sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Mobile sidebar backdrop */}
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
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-zinc-900 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-zinc-800">
            <Link href="/admin" className="flex items-center gap-3">
              <ClubLogo className="w-8 h-8 text-white" variant="white" />
              <div>
                <span className="text-white font-heading font-bold text-sm">UD Villar del Olmo</span>
                <span className="block text-zinc-500 text-xs">Panel de Admin</span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== "/admin" && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-primary text-white"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-zinc-800">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-zinc-800">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{userInfo?.nombre || "Admin"}</p>
                <p className="text-xs text-zinc-500 truncate">{userInfo?.email || ""}</p>
              </div>
            </div>
            <Link href="/">
              <Button 
                variant="ghost" 
                className="w-full mt-3 text-zinc-400 hover:text-white hover:bg-zinc-800 justify-start gap-3"
              >
                <LogOut className="w-4 h-4" />
                Volver al sitio
              </Button>
            </Link>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full mt-1 text-red-400 hover:text-red-300 hover:bg-zinc-800 justify-start gap-3"
            >
              <LogOut className="w-4 h-4" />
              Cerrar sesión
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-zinc-200">
          <div className="flex items-center justify-between h-16 px-4 md:px-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-zinc-600 hover:text-zinc-900"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-lg font-heading font-bold text-zinc-900">
                {navigation.find(n => n.href === pathname || (n.href !== "/admin" && pathname.startsWith(n.href)))?.name || "Dashboard"}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              {/* User menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-2 hover:bg-zinc-100 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <ChevronDown className="w-4 h-4 text-zinc-600" />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-zinc-200 py-2"
                    >
                      <Link
                        href="/admin/configuracion"
                        className="block px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Configuración
                      </Link>
                      <Link
                        href="/"
                        className="block px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Volver al sitio
                      </Link>
                      <hr className="my-2 border-zinc-200" />
                      <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
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
        <main className="p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
