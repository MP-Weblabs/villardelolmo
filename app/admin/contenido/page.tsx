"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImageUploadField } from "@/components/admin/image-upload-field"
import { createBrowserClient } from "@/lib/supabase/client"
import { sanitizeUrl } from "@/lib/sanitize"
import {
  DEFAULT_HERO,
  DEFAULT_ABOUT,
  DEFAULT_CTA,
  DEFAULT_HISTORIA,
  DEFAULT_CONTACTO,
  DEFAULT_SOCIOS,
  DEFAULT_INSTALACIONES,
  DEFAULT_EQUIPOS,
  DEFAULT_TIMELINE,
  DEFAULT_INSTALACIONES_LISTA,
  DEFAULT_VALORES,
  MAX_LIST_ITEMS,
  parseHero,
  parseAbout,
  parseCta,
  parseHistoria,
  parseContacto,
  parseSocios,
  parsePageHeader,
  parseTimeline,
  parseInstalacionesLista,
  parseValores,
  parseJsonSafe,
  type HeroContent,
  type AboutContent,
  type CtaContent,
  type HistoriaContent,
  type ContactoContent,
  type SociosContent,
  type PageHeaderContent,
  type TimelineItem,
  type InstalacionItem,
  type ValueItem,
} from "@/lib/site-content"
import {
  Image as ImageIcon,
  Info,
  Megaphone,
  Save,
  CheckCircle,
  AlertCircle,
  Loader2,
  ExternalLink,
  BookOpen,
  Mail,
  Users,
  Building2,
  Shield,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Clock,
  Images,
  Star,
} from "lucide-react"

type Tab = "hero" | "about" | "cta" | "historia" | "timeline" | "valores" | "contacto" | "socios" | "instalaciones" | "instalaciones_lista" | "equipos"

function UrlHint() {
  return (
    <p className="text-xs text-zinc-400">
      Ruta interna (empieza por "/", p. ej. /socios) o URL completa (https://...).
    </p>
  )
}

// Valida un campo de URL antes de guardar. Devuelve un mensaje de error si el
// valor no es una ruta interna ni una URL http(s) válida (bloquea, por
// ejemplo, "javascript:alert(1)"); null si está bien o vacío.
function validateUrl(label: string, value: string): string | null {
  if (!value.trim()) return null
  return sanitizeUrl(value) === null
    ? `"${label}" no es una URL válida. Usa una ruta interna (/socios) o una URL completa (https://...).`
    : null
}

export default function AdminContenidoPage() {
  const [activeTab, setActiveTab] = useState<Tab>("hero")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  const [hero, setHero] = useState<HeroContent>(DEFAULT_HERO)
  const [about, setAbout] = useState<AboutContent>(DEFAULT_ABOUT)
  const [cta, setCta] = useState<CtaContent>(DEFAULT_CTA)
  const [historia, setHistoria] = useState<HistoriaContent>(DEFAULT_HISTORIA)
  const [contacto, setContacto] = useState<ContactoContent>(DEFAULT_CONTACTO)
  const [socios, setSocios] = useState<SociosContent>(DEFAULT_SOCIOS)
  const [instalaciones, setInstalaciones] = useState<PageHeaderContent>(DEFAULT_INSTALACIONES)
  const [equipos, setEquipos] = useState<PageHeaderContent>(DEFAULT_EQUIPOS)
  const [timeline, setTimeline] = useState<TimelineItem[]>(DEFAULT_TIMELINE)
  const [valores, setValores] = useState<ValueItem[]>(DEFAULT_VALORES)
  const [instalacionesLista, setInstalacionesLista] = useState<InstalacionItem[]>(DEFAULT_INSTALACIONES_LISTA)

  useEffect(() => {
    const fetchContent = async () => {
      const supabase = createBrowserClient()
      const { data } = await supabase
        .from("configuracion_web")
        .select("clave, valor")
        .in("clave", [
          "home_hero",
          "home_about",
          "home_cta",
          "pagina_historia",
          "pagina_historia_timeline",
          "pagina_historia_valores",
          "pagina_contacto",
          "pagina_socios",
          "pagina_instalaciones",
          "pagina_instalaciones_lista",
          "pagina_equipos",
        ])

      const byKey = new Map((data ?? []).map((row) => [row.clave, row.valor]))
      setHero(parseHero(parseJsonSafe(byKey.get("home_hero"))))
      setAbout(parseAbout(parseJsonSafe(byKey.get("home_about"))))
      setCta(parseCta(parseJsonSafe(byKey.get("home_cta"))))
      setHistoria(parseHistoria(parseJsonSafe(byKey.get("pagina_historia"))))
      setTimeline(parseTimeline(parseJsonSafe(byKey.get("pagina_historia_timeline"))))
      setValores(parseValores(parseJsonSafe(byKey.get("pagina_historia_valores"))))
      setContacto(parseContacto(parseJsonSafe(byKey.get("pagina_contacto"))))
      setSocios(parseSocios(parseJsonSafe(byKey.get("pagina_socios"))))
      setInstalaciones(parsePageHeader(parseJsonSafe(byKey.get("pagina_instalaciones")), DEFAULT_INSTALACIONES))
      setInstalacionesLista(parseInstalacionesLista(parseJsonSafe(byKey.get("pagina_instalaciones_lista"))))
      setEquipos(parsePageHeader(parseJsonSafe(byKey.get("pagina_equipos")), DEFAULT_EQUIPOS))
      setLoading(false)
    }
    fetchContent()
  }, [])

  const addValueItem = () =>
    setValores((v) => (v.length >= MAX_LIST_ITEMS ? v : [...v, { numero: String(v.length + 1).padStart(2, "0"), titulo: "", descripcion: "" }]))
  const updateValueItem = (i: number, patch: Partial<ValueItem>) =>
    setValores((v) => v.map((item, idx) => (idx === i ? { ...item, ...patch } : item)))
  const removeValueItem = (i: number) => setValores((v) => v.filter((_, idx) => idx !== i))
  const moveValueItem = (i: number, dir: -1 | 1) =>
    setValores((v) => {
      const j = i + dir
      if (j < 0 || j >= v.length) return v
      const copy = [...v]
      ;[copy[i], copy[j]] = [copy[j], copy[i]]
      return copy
    })

  const addTimelineItem = () =>
    setTimeline((t) => (t.length >= MAX_LIST_ITEMS ? t : [...t, { anio: "", evento: "" }]))
  const updateTimelineItem = (i: number, patch: Partial<TimelineItem>) =>
    setTimeline((t) => t.map((item, idx) => (idx === i ? { ...item, ...patch } : item)))
  const removeTimelineItem = (i: number) => setTimeline((t) => t.filter((_, idx) => idx !== i))
  const moveTimelineItem = (i: number, dir: -1 | 1) =>
    setTimeline((t) => {
      const j = i + dir
      if (j < 0 || j >= t.length) return t
      const copy = [...t]
      ;[copy[i], copy[j]] = [copy[j], copy[i]]
      return copy
    })

  const addInstalacion = () =>
    setInstalacionesLista((l) => (l.length >= MAX_LIST_ITEMS ? l : [...l, { nombre: "", descripcion: "", imagen: "" }]))
  const updateInstalacion = (i: number, patch: Partial<InstalacionItem>) =>
    setInstalacionesLista((l) => l.map((item, idx) => (idx === i ? { ...item, ...patch } : item)))
  const removeInstalacion = (i: number) => setInstalacionesLista((l) => l.filter((_, idx) => idx !== i))
  const moveInstalacion = (i: number, dir: -1 | 1) =>
    setInstalacionesLista((l) => {
      const j = i + dir
      if (j < 0 || j >= l.length) return l
      const copy = [...l]
      ;[copy[i], copy[j]] = [copy[j], copy[i]]
      return copy
    })

  const handleSave = async () => {
    setSaved(false)

    const validationErrors = [
      validateUrl("URL del botón principal (Hero)", hero.ctaPrimarioUrl),
      validateUrl("URL del botón secundario (Hero)", hero.ctaSecundarioUrl),
      validateUrl("URL del enlace (Sobre nosotros)", about.enlaceUrl),
      validateUrl("URL del botón principal (Únete)", cta.botonPrimarioUrl),
      validateUrl("URL del botón secundario (Únete)", cta.botonSecundarioUrl),
      validateUrl("URL del botón (Socios - hero)", socios.heroBotonUrl),
      validateUrl("URL del botón (Socios - ya soy socio)", socios.miembroBotonUrl),
      ...timeline.map((item, i) => (!item.evento.trim() ? `Hito #${i + 1} de la línea de tiempo: falta el evento.` : null)),
      ...valores.map((item, i) => (!item.titulo.trim() ? `Valor #${i + 1}: falta el título.` : null)),
      ...instalacionesLista.map((item, i) => {
        if (!item.nombre.trim()) return `Instalación #${i + 1}: falta el nombre.`
        if (!item.imagen.trim()) return `Instalación #${i + 1}: falta la imagen.`
        return null
      }),
    ].filter((e): e is string => e !== null)

    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      return
    }
    setErrors([])
    setSaving(true)

    try {
      // Se vuelve a sanear justo antes de guardar (además de validar arriba):
      // así lo que queda en la base de datos siempre respeta los límites de
      // longitud y esquemas de URL permitidos, pase lo que pase por el
      // formulario.
      const heroSaneado = parseHero(hero)
      const aboutSaneado = parseAbout(about)
      const ctaSaneado = parseCta(cta)
      const historiaSaneada = parseHistoria(historia)
      const contactoSaneado = parseContacto(contacto)
      const sociosSaneado = parseSocios(socios)
      const instalacionesSaneado = parsePageHeader(instalaciones, DEFAULT_INSTALACIONES)
      const equiposSaneado = parsePageHeader(equipos, DEFAULT_EQUIPOS)
      const timelineSaneada = parseTimeline(timeline)
      const valoresSaneados = parseValores(valores)
      const instalacionesListaSaneada = parseInstalacionesLista(instalacionesLista)

      const supabase = createBrowserClient()
      const { error } = await supabase.from("configuracion_web").upsert(
        [
          { clave: "home_hero", valor: JSON.stringify(heroSaneado), tipo: "json", descripcion: "Contenido de la sección Hero de la home" },
          { clave: "home_about", valor: JSON.stringify(aboutSaneado), tipo: "json", descripcion: "Contenido de la sección Sobre nosotros de la home" },
          { clave: "home_cta", valor: JSON.stringify(ctaSaneado), tipo: "json", descripcion: "Contenido de la sección Únete (CTA) de la home" },
          { clave: "pagina_historia", valor: JSON.stringify(historiaSaneada), tipo: "json", descripcion: "Contenido de la página Historia" },
          { clave: "pagina_historia_timeline", valor: JSON.stringify(timelineSaneada), tipo: "json", descripcion: "Línea de tiempo de la página Historia" },
          { clave: "pagina_historia_valores", valor: JSON.stringify(valoresSaneados), tipo: "json", descripcion: "Valores del club (página Historia)" },
          { clave: "pagina_contacto", valor: JSON.stringify(contactoSaneado), tipo: "json", descripcion: "Contenido de la página Contacto" },
          { clave: "pagina_socios", valor: JSON.stringify(sociosSaneado), tipo: "json", descripcion: "Contenido de la página Hazte Socio" },
          { clave: "pagina_instalaciones", valor: JSON.stringify(instalacionesSaneado), tipo: "json", descripcion: "Cabecera de la página Instalaciones" },
          { clave: "pagina_instalaciones_lista", valor: JSON.stringify(instalacionesListaSaneada), tipo: "json", descripcion: "Lista de instalaciones" },
          { clave: "pagina_equipos", valor: JSON.stringify(equiposSaneado), tipo: "json", descripcion: "Cabecera de la página Equipos" },
        ],
        { onConflict: "clave" }
      )

      if (error) throw error

      setHero(heroSaneado)
      setAbout(aboutSaneado)
      setCta(ctaSaneado)
      setHistoria(historiaSaneada)
      setTimeline(timelineSaneada)
      setValores(valoresSaneados)
      setContacto(contactoSaneado)
      setSocios(sociosSaneado)
      setInstalaciones(instalacionesSaneado)
      setInstalacionesLista(instalacionesListaSaneada)
      setEquipos(equiposSaneado)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      setErrors(["No se ha podido guardar el contenido. Inténtalo de nuevo."])
    } finally {
      setSaving(false)
    }
  }

  const tabs: { id: Tab; label: string; icon: typeof ImageIcon }[] = [
    { id: "hero", label: "Hero (portada)", icon: ImageIcon },
    { id: "about", label: "Sobre nosotros", icon: Info },
    { id: "cta", label: "Únete (CTA)", icon: Megaphone },
    { id: "historia", label: "Página Historia", icon: BookOpen },
    { id: "timeline", label: "Línea de tiempo", icon: Clock },
    { id: "valores", label: "Valores del club", icon: Star },
    { id: "contacto", label: "Página Contacto", icon: Mail },
    { id: "socios", label: "Página Socios", icon: Users },
    { id: "instalaciones", label: "Página Instalaciones", icon: Building2 },
    { id: "instalaciones_lista", label: "Lista de instalaciones", icon: Images },
    { id: "equipos", label: "Página Equipos", icon: Shield },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-heading font-bold text-zinc-900">Contenido del Sitio</h1>
          <p className="text-zinc-600">Edita los textos, imágenes y enlaces de la home, Historia, Contacto y Socios</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/" target="_blank">
            <Button variant="outline" className="gap-2">
              <ExternalLink className="w-4 h-4" />
              Ver la home
            </Button>
          </Link>
          <Button onClick={handleSave} disabled={saving} className="bg-primary hover:bg-primary/90 gap-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Guardar cambios
          </Button>
        </div>
      </motion.div>

      {saved && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-green-800 font-medium">Contenido guardado correctamente</span>
        </motion.div>
      )}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-1">
          {errors.map((err) => (
            <div key={err} className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <span className="text-red-800 text-sm font-medium">{err}</span>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-xl border border-zinc-200 p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id ? "bg-primary text-white" : "text-zinc-600 hover:bg-zinc-50"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex-1 space-y-6">
          {activeTab === "hero" && (
            <div className="bg-white rounded-xl border border-zinc-200 p-6 space-y-6">
              <div>
                <h2 className="font-heading font-bold text-lg mb-1">Título (3 líneas)</h2>
                <p className="text-sm text-zinc-500 mb-4">Se muestra en grande sobre la imagen de fondo.</p>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Línea 1</Label>
                    <Input maxLength={60} value={hero.tituloLinea1} onChange={(e) => setHero((h) => ({ ...h, tituloLinea1: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Línea 2 (color destacado)</Label>
                    <Input maxLength={60} value={hero.tituloLinea2} onChange={(e) => setHero((h) => ({ ...h, tituloLinea2: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Línea 3</Label>
                    <Input maxLength={60} value={hero.tituloLinea3} onChange={(e) => setHero((h) => ({ ...h, tituloLinea3: e.target.value }))} />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Descripción</Label>
                <Textarea maxLength={300} rows={3} value={hero.descripcion} onChange={(e) => setHero((h) => ({ ...h, descripcion: e.target.value }))} />
              </div>

              <ImageUploadField
                label="Imagen de fondo"
                value={hero.imagenFondo}
                onChange={(url) => setHero((h) => ({ ...h, imagenFondo: url }))}
                carpeta="hero"
              />

              <div className="grid sm:grid-cols-2 gap-6 pt-2 border-t border-zinc-100">
                <div className="space-y-3 pt-4">
                  <h3 className="text-sm font-semibold text-zinc-700">Botón principal</h3>
                  <div className="space-y-2">
                    <Label>Texto</Label>
                    <Input maxLength={40} value={hero.ctaPrimarioTexto} onChange={(e) => setHero((h) => ({ ...h, ctaPrimarioTexto: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Enlace</Label>
                    <Input value={hero.ctaPrimarioUrl} onChange={(e) => setHero((h) => ({ ...h, ctaPrimarioUrl: e.target.value }))} />
                    <UrlHint />
                  </div>
                </div>
                <div className="space-y-3 pt-4">
                  <h3 className="text-sm font-semibold text-zinc-700">Botón secundario</h3>
                  <div className="space-y-2">
                    <Label>Texto</Label>
                    <Input maxLength={40} value={hero.ctaSecundarioTexto} onChange={(e) => setHero((h) => ({ ...h, ctaSecundarioTexto: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Enlace</Label>
                    <Input value={hero.ctaSecundarioUrl} onChange={(e) => setHero((h) => ({ ...h, ctaSecundarioUrl: e.target.value }))} />
                    <UrlHint />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "about" && (
            <div className="bg-white rounded-xl border border-zinc-200 p-6 space-y-4">
              <h2 className="font-heading font-bold text-lg mb-2">Sección "Sobre nosotros"</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Etiqueta</Label>
                  <Input maxLength={60} value={about.badge} onChange={(e) => setAbout((a) => ({ ...a, badge: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Título</Label>
                  <Input maxLength={100} value={about.titulo} onChange={(e) => setAbout((a) => ({ ...a, titulo: e.target.value }))} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Párrafo 1</Label>
                <Textarea maxLength={600} rows={3} value={about.parrafo1} onChange={(e) => setAbout((a) => ({ ...a, parrafo1: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Párrafo 2</Label>
                <Textarea maxLength={600} rows={3} value={about.parrafo2} onChange={(e) => setAbout((a) => ({ ...a, parrafo2: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Párrafo 3</Label>
                <Textarea maxLength={600} rows={3} value={about.parrafo3} onChange={(e) => setAbout((a) => ({ ...a, parrafo3: e.target.value }))} />
              </div>
              <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-zinc-100">
                <div className="space-y-2 pt-4">
                  <Label>Texto del enlace</Label>
                  <Input maxLength={60} value={about.enlaceTexto} onChange={(e) => setAbout((a) => ({ ...a, enlaceTexto: e.target.value }))} />
                </div>
                <div className="space-y-2 pt-4">
                  <Label>URL del enlace</Label>
                  <Input value={about.enlaceUrl} onChange={(e) => setAbout((a) => ({ ...a, enlaceUrl: e.target.value }))} />
                  <UrlHint />
                </div>
              </div>
            </div>
          )}

          {activeTab === "cta" && (
            <div className="bg-white rounded-xl border border-zinc-200 p-6 space-y-4">
              <div>
                <h2 className="font-heading font-bold text-lg mb-1">Sección "Únete" (llamada a la acción)</h2>
                <p className="text-sm text-zinc-500">
                  El email y teléfono que se muestran aquí se gestionan en{" "}
                  <Link href="/admin/configuracion" className="text-primary underline">Configuración → Contacto</Link>.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Etiqueta</Label>
                  <Input maxLength={60} value={cta.badge} onChange={(e) => setCta((c) => ({ ...c, badge: e.target.value }))} />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Título línea 1</Label>
                  <Input maxLength={60} value={cta.tituloLinea1} onChange={(e) => setCta((c) => ({ ...c, tituloLinea1: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Título línea 2 (atenuada)</Label>
                  <Input maxLength={60} value={cta.tituloLinea2} onChange={(e) => setCta((c) => ({ ...c, tituloLinea2: e.target.value }))} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Descripción</Label>
                <Textarea maxLength={300} rows={3} value={cta.descripcion} onChange={(e) => setCta((c) => ({ ...c, descripcion: e.target.value }))} />
              </div>
              <div className="grid sm:grid-cols-2 gap-6 pt-2 border-t border-zinc-100">
                <div className="space-y-3 pt-4">
                  <h3 className="text-sm font-semibold text-zinc-700">Botón principal</h3>
                  <div className="space-y-2">
                    <Label>Texto</Label>
                    <Input maxLength={40} value={cta.botonPrimarioTexto} onChange={(e) => setCta((c) => ({ ...c, botonPrimarioTexto: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Enlace</Label>
                    <Input value={cta.botonPrimarioUrl} onChange={(e) => setCta((c) => ({ ...c, botonPrimarioUrl: e.target.value }))} />
                    <UrlHint />
                  </div>
                </div>
                <div className="space-y-3 pt-4">
                  <h3 className="text-sm font-semibold text-zinc-700">Botón secundario</h3>
                  <div className="space-y-2">
                    <Label>Texto</Label>
                    <Input maxLength={40} value={cta.botonSecundarioTexto} onChange={(e) => setCta((c) => ({ ...c, botonSecundarioTexto: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Enlace</Label>
                    <Input value={cta.botonSecundarioUrl} onChange={(e) => setCta((c) => ({ ...c, botonSecundarioUrl: e.target.value }))} />
                    <UrlHint />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "historia" && (
            <div className="bg-white rounded-xl border border-zinc-200 p-6 space-y-6">
              <div>
                <h2 className="font-heading font-bold text-lg mb-1">Página Historia — Cabecera</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Título línea 1</Label>
                  <Input maxLength={60} value={historia.tituloLinea1} onChange={(e) => setHistoria((h) => ({ ...h, tituloLinea1: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Título línea 2 (atenuada)</Label>
                  <Input maxLength={60} value={historia.tituloLinea2} onChange={(e) => setHistoria((h) => ({ ...h, tituloLinea2: e.target.value }))} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Subtítulo</Label>
                <Textarea maxLength={300} rows={2} value={historia.subtitulo} onChange={(e) => setHistoria((h) => ({ ...h, subtitulo: e.target.value }))} />
              </div>

              <div className="pt-4 border-t border-zinc-100 space-y-4">
                <h3 className="text-sm font-semibold text-zinc-700">Bloque "Historia del Club"</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Etiqueta</Label>
                    <Input maxLength={60} value={historia.clubBadge} onChange={(e) => setHistoria((h) => ({ ...h, clubBadge: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Título</Label>
                    <Input maxLength={100} value={historia.clubTitulo} onChange={(e) => setHistoria((h) => ({ ...h, clubTitulo: e.target.value }))} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Párrafo 1</Label>
                  <Textarea maxLength={600} rows={3} value={historia.clubParrafo1} onChange={(e) => setHistoria((h) => ({ ...h, clubParrafo1: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Párrafo 2</Label>
                  <Textarea maxLength={600} rows={3} value={historia.clubParrafo2} onChange={(e) => setHistoria((h) => ({ ...h, clubParrafo2: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Párrafo 3</Label>
                  <Textarea maxLength={600} rows={3} value={historia.clubParrafo3} onChange={(e) => setHistoria((h) => ({ ...h, clubParrafo3: e.target.value }))} />
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-100 space-y-4">
                <h3 className="text-sm font-semibold text-zinc-700">Bloque "Historia del Pueblo"</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Etiqueta</Label>
                    <Input maxLength={60} value={historia.puebloBadge} onChange={(e) => setHistoria((h) => ({ ...h, puebloBadge: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Título</Label>
                    <Input maxLength={100} value={historia.puebloTitulo} onChange={(e) => setHistoria((h) => ({ ...h, puebloTitulo: e.target.value }))} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Párrafo 1</Label>
                  <Textarea maxLength={600} rows={3} value={historia.puebloParrafo1} onChange={(e) => setHistoria((h) => ({ ...h, puebloParrafo1: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Párrafo 2</Label>
                  <Textarea maxLength={600} rows={3} value={historia.puebloParrafo2} onChange={(e) => setHistoria((h) => ({ ...h, puebloParrafo2: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Párrafo 3</Label>
                  <Textarea maxLength={600} rows={3} value={historia.puebloParrafo3} onChange={(e) => setHistoria((h) => ({ ...h, puebloParrafo3: e.target.value }))} />
                </div>
              </div>

            </div>
          )}

          {activeTab === "valores" && (
            <div className="bg-white rounded-xl border border-zinc-200 p-6 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h2 className="font-heading font-bold text-lg mb-1">Valores del club (Historia)</h2>
                  <p className="text-sm text-zinc-500">Las 4 tarjetas de "Nuestros valores", en el orden en que aparecen aquí.</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={addValueItem}
                  disabled={valores.length >= MAX_LIST_ITEMS}
                >
                  <Plus className="w-4 h-4" />
                  Añadir valor
                </Button>
              </div>

              <div className="space-y-3">
                {valores.map((item, i) => (
                  <div key={i} className="flex gap-3 items-start bg-zinc-50 rounded-lg p-3">
                    <div className="w-16 shrink-0 space-y-1">
                      <Label className="text-xs">Número</Label>
                      <Input maxLength={10} value={item.numero} onChange={(e) => updateValueItem(i, { numero: e.target.value })} />
                    </div>
                    <div className="w-40 shrink-0 space-y-1">
                      <Label className="text-xs">Título</Label>
                      <Input maxLength={60} value={item.titulo} onChange={(e) => updateValueItem(i, { titulo: e.target.value })} />
                    </div>
                    <div className="flex-1 space-y-1">
                      <Label className="text-xs">Descripción</Label>
                      <Input maxLength={300} value={item.descripcion} onChange={(e) => updateValueItem(i, { descripcion: e.target.value })} />
                    </div>
                    <div className="flex flex-col gap-1 pt-5">
                      <button
                        type="button"
                        onClick={() => moveValueItem(i, -1)}
                        disabled={i === 0}
                        className="p-1 text-zinc-400 hover:text-zinc-700 disabled:opacity-30 disabled:hover:text-zinc-400"
                        aria-label="Mover arriba"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveValueItem(i, 1)}
                        disabled={i === valores.length - 1}
                        className="p-1 text-zinc-400 hover:text-zinc-700 disabled:opacity-30 disabled:hover:text-zinc-400"
                        aria-label="Mover abajo"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeValueItem(i)}
                      className="p-1 mt-5 text-red-400 hover:text-red-600"
                      aria-label="Eliminar valor"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {valores.length === 0 && (
                  <p className="text-sm text-zinc-400 text-center py-6">No hay valores. Añade el primero.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === "timeline" && (
            <div className="bg-white rounded-xl border border-zinc-200 p-6 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h2 className="font-heading font-bold text-lg mb-1">Línea de tiempo (Historia)</h2>
                  <p className="text-sm text-zinc-500">Los hitos se muestran en el orden en que aparecen aquí.</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={addTimelineItem}
                  disabled={timeline.length >= MAX_LIST_ITEMS}
                >
                  <Plus className="w-4 h-4" />
                  Añadir hito
                </Button>
              </div>

              <div className="space-y-3">
                {timeline.map((item, i) => (
                  <div key={i} className="flex gap-3 items-start bg-zinc-50 rounded-lg p-3">
                    <div className="w-24 shrink-0 space-y-1">
                      <Label className="text-xs">Año</Label>
                      <Input maxLength={20} value={item.anio} onChange={(e) => updateTimelineItem(i, { anio: e.target.value })} />
                    </div>
                    <div className="flex-1 space-y-1">
                      <Label className="text-xs">Evento</Label>
                      <Input maxLength={200} value={item.evento} onChange={(e) => updateTimelineItem(i, { evento: e.target.value })} />
                    </div>
                    <div className="flex flex-col gap-1 pt-5">
                      <button
                        type="button"
                        onClick={() => moveTimelineItem(i, -1)}
                        disabled={i === 0}
                        className="p-1 text-zinc-400 hover:text-zinc-700 disabled:opacity-30 disabled:hover:text-zinc-400"
                        aria-label="Mover arriba"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveTimelineItem(i, 1)}
                        disabled={i === timeline.length - 1}
                        className="p-1 text-zinc-400 hover:text-zinc-700 disabled:opacity-30 disabled:hover:text-zinc-400"
                        aria-label="Mover abajo"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeTimelineItem(i)}
                      className="p-1 mt-5 text-red-400 hover:text-red-600"
                      aria-label="Eliminar hito"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {timeline.length === 0 && (
                  <p className="text-sm text-zinc-400 text-center py-6">No hay hitos. Añade el primero.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === "contacto" && (
            <div className="bg-white rounded-xl border border-zinc-200 p-6 space-y-4">
              <div>
                <h2 className="font-heading font-bold text-lg mb-1">Página Contacto — Cabecera</h2>
                <p className="text-sm text-zinc-500">
                  La dirección, email y teléfono que se muestran en esta página se gestionan en{" "}
                  <Link href="/admin/configuracion" className="text-primary underline">Configuración → Contacto</Link>.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Título línea 1</Label>
                  <Input maxLength={60} value={contacto.tituloLinea1} onChange={(e) => setContacto((c) => ({ ...c, tituloLinea1: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Título línea 2 (atenuada)</Label>
                  <Input maxLength={60} value={contacto.tituloLinea2} onChange={(e) => setContacto((c) => ({ ...c, tituloLinea2: e.target.value }))} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Subtítulo</Label>
                <Textarea maxLength={300} rows={2} value={contacto.subtitulo} onChange={(e) => setContacto((c) => ({ ...c, subtitulo: e.target.value }))} />
              </div>
            </div>
          )}

          {activeTab === "socios" && (
            <div className="bg-white rounded-xl border border-zinc-200 p-6 space-y-4">
              <h2 className="font-heading font-bold text-lg mb-1">Página "Hazte Socio"</h2>

              <div className="pt-2 space-y-4">
                <h3 className="text-sm font-semibold text-zinc-700">Cabecera</h3>
                <div className="space-y-2">
                  <Label>Etiqueta</Label>
                  <Input maxLength={60} value={socios.heroBadge} onChange={(e) => setSocios((s) => ({ ...s, heroBadge: e.target.value }))} />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Título línea 1</Label>
                    <Input maxLength={60} value={socios.heroTituloLinea1} onChange={(e) => setSocios((s) => ({ ...s, heroTituloLinea1: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Título línea 2 (destacada)</Label>
                    <Input maxLength={60} value={socios.heroTituloLinea2} onChange={(e) => setSocios((s) => ({ ...s, heroTituloLinea2: e.target.value }))} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Descripción</Label>
                  <Textarea maxLength={300} rows={3} value={socios.heroDescripcion} onChange={(e) => setSocios((s) => ({ ...s, heroDescripcion: e.target.value }))} />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Texto del botón</Label>
                    <Input maxLength={40} value={socios.heroBotonTexto} onChange={(e) => setSocios((s) => ({ ...s, heroBotonTexto: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Enlace del botón</Label>
                    <Input value={socios.heroBotonUrl} onChange={(e) => setSocios((s) => ({ ...s, heroBotonUrl: e.target.value }))} />
                    <UrlHint />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-100 space-y-4">
                <h3 className="text-sm font-semibold text-zinc-700">Bloque "¿Ya eres socio?"</h3>
                <div className="space-y-2">
                  <Label>Título</Label>
                  <Input maxLength={100} value={socios.miembroTitulo} onChange={(e) => setSocios((s) => ({ ...s, miembroTitulo: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Descripción</Label>
                  <Textarea maxLength={300} rows={2} value={socios.miembroDescripcion} onChange={(e) => setSocios((s) => ({ ...s, miembroDescripcion: e.target.value }))} />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Texto del botón</Label>
                    <Input maxLength={40} value={socios.miembroBotonTexto} onChange={(e) => setSocios((s) => ({ ...s, miembroBotonTexto: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Enlace del botón</Label>
                    <Input value={socios.miembroBotonUrl} onChange={(e) => setSocios((s) => ({ ...s, miembroBotonUrl: e.target.value }))} />
                    <UrlHint />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "instalaciones" && (
            <div className="bg-white rounded-xl border border-zinc-200 p-6 space-y-4">
              <div>
                <h2 className="font-heading font-bold text-lg mb-1">Página Instalaciones — Cabecera</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Título línea 1</Label>
                  <Input maxLength={60} value={instalaciones.tituloLinea1} onChange={(e) => setInstalaciones((c) => ({ ...c, tituloLinea1: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Título línea 2 (atenuada)</Label>
                  <Input maxLength={60} value={instalaciones.tituloLinea2} onChange={(e) => setInstalaciones((c) => ({ ...c, tituloLinea2: e.target.value }))} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Subtítulo</Label>
                <Textarea maxLength={300} rows={2} value={instalaciones.subtitulo} onChange={(e) => setInstalaciones((c) => ({ ...c, subtitulo: e.target.value }))} />
              </div>
            </div>
          )}

          {activeTab === "instalaciones_lista" && (
            <div className="bg-white rounded-xl border border-zinc-200 p-6 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h2 className="font-heading font-bold text-lg mb-1">Lista de instalaciones</h2>
                  <p className="text-sm text-zinc-500">Se muestran en el orden en que aparecen aquí, alternando imagen a un lado y otro.</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={addInstalacion}
                  disabled={instalacionesLista.length >= MAX_LIST_ITEMS}
                >
                  <Plus className="w-4 h-4" />
                  Añadir instalación
                </Button>
              </div>

              <div className="space-y-4">
                {instalacionesLista.map((item, i) => (
                  <div key={i} className="bg-zinc-50 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Instalación #{i + 1}</span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => moveInstalacion(i, -1)}
                          disabled={i === 0}
                          className="p-1 text-zinc-400 hover:text-zinc-700 disabled:opacity-30 disabled:hover:text-zinc-400"
                          aria-label="Mover arriba"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveInstalacion(i, 1)}
                          disabled={i === instalacionesLista.length - 1}
                          className="p-1 text-zinc-400 hover:text-zinc-700 disabled:opacity-30 disabled:hover:text-zinc-400"
                          aria-label="Mover abajo"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeInstalacion(i)}
                          className="p-1 text-red-400 hover:text-red-600"
                          aria-label="Eliminar instalación"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Nombre</Label>
                      <Input maxLength={100} value={item.nombre} onChange={(e) => updateInstalacion(i, { nombre: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Descripción</Label>
                      <Textarea maxLength={400} rows={2} value={item.descripcion} onChange={(e) => updateInstalacion(i, { descripcion: e.target.value })} />
                    </div>
                    <ImageUploadField
                      label="Imagen"
                      value={item.imagen}
                      onChange={(url) => updateInstalacion(i, { imagen: url })}
                      carpeta="instalaciones"
                      required
                    />
                  </div>
                ))}
                {instalacionesLista.length === 0 && (
                  <p className="text-sm text-zinc-400 text-center py-6">No hay instalaciones. Añade la primera.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === "equipos" && (
            <div className="bg-white rounded-xl border border-zinc-200 p-6 space-y-4">
              <div>
                <h2 className="font-heading font-bold text-lg mb-1">Página Equipos — Cabecera</h2>
                <p className="text-sm text-zinc-500">
                  Los equipos en sí (nombre, categoría, foto...) se gestionan en{" "}
                  <Link href="/admin/equipos" className="text-primary underline">Equipos</Link>.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Título línea 1</Label>
                  <Input maxLength={60} value={equipos.tituloLinea1} onChange={(e) => setEquipos((c) => ({ ...c, tituloLinea1: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Título línea 2 (atenuada)</Label>
                  <Input maxLength={60} value={equipos.tituloLinea2} onChange={(e) => setEquipos((c) => ({ ...c, tituloLinea2: e.target.value }))} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Subtítulo</Label>
                <Textarea maxLength={300} rows={2} value={equipos.subtitulo} onChange={(e) => setEquipos((c) => ({ ...c, subtitulo: e.target.value }))} />
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
