import { createClient } from "./server"
import {
  parseHero,
  parseAbout,
  parseCta,
  parseSiteInfo,
  parseHistoria,
  parseSocios,
  parseTimeline,
  parseValores,
  parseJsonSafe,
  type HeroContent,
  type AboutContent,
  type CtaContent,
  type SiteInfo,
  type HistoriaContent,
  type SociosContent,
  type TimelineItem,
  type ValueItem,
} from "@/lib/site-content"

export type HomeContent = {
  hero: HeroContent
  about: AboutContent
  cta: CtaContent
  siteInfo: SiteInfo
}

async function fetchConfigRows(keys: string[]): Promise<Map<string, string | null>> {
  const supabase = await createClient()
  const { data } = await supabase.from("configuracion_web").select("clave, valor").in("clave", keys)
  return new Map((data ?? []).map((row) => [row.clave, row.valor]))
}

// Lee el contenido editable de la home directamente en el servidor (RLS
// permite lectura pública de configuracion_web, así que no hace falta sesión
// ni service role). Si falta alguna clave o la fila está vacía/corrupta, cada
// parse* aplica el valor por defecto correspondiente.
export async function getHomeContent(): Promise<HomeContent> {
  const rows = await fetchConfigRows(["home_hero", "home_about", "home_cta", "sitio"])
  return {
    hero: parseHero(parseJsonSafe(rows.get("home_hero"))),
    about: parseAbout(parseJsonSafe(rows.get("home_about"))),
    cta: parseCta(parseJsonSafe(rows.get("home_cta"))),
    siteInfo: parseSiteInfo(parseJsonSafe(rows.get("sitio"))),
  }
}

export type HistoriaPageData = {
  content: HistoriaContent
  timeline: TimelineItem[]
  valores: ValueItem[]
}

export async function getHistoriaContent(): Promise<HistoriaPageData> {
  const rows = await fetchConfigRows(["pagina_historia", "pagina_historia_timeline", "pagina_historia_valores"])
  return {
    content: parseHistoria(parseJsonSafe(rows.get("pagina_historia"))),
    timeline: parseTimeline(parseJsonSafe(rows.get("pagina_historia_timeline"))),
    valores: parseValores(parseJsonSafe(rows.get("pagina_historia_valores"))),
  }
}

export async function getSociosPageContent(): Promise<SociosContent> {
  const rows = await fetchConfigRows(["pagina_socios"])
  return parseSocios(parseJsonSafe(rows.get("pagina_socios")))
}
