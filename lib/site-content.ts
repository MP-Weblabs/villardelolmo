// Tipos, valores por defecto y parseo/saneado del contenido editable de la
// home (hero, sección "sobre nosotros", CTA) y de los datos generales del
// sitio (contacto, redes sociales). Módulo isomórfico (sin imports de
// servidor) para poder usarse tanto en Server Components como en el admin
// (cliente).
//
// Los valores por defecto son exactamente el copy que había hardcodeado en
// los componentes antes de hacerlos editables: si no hay nada guardado en
// configuracion_web, la web se ve igual que siempre.

import { sanitizeText, sanitizeUrl, sanitizeEmail, sanitizePhone } from "@/lib/sanitize"

export type HeroContent = {
  tituloLinea1: string
  tituloLinea2: string
  tituloLinea3: string
  descripcion: string
  imagenFondo: string
  ctaPrimarioTexto: string
  ctaPrimarioUrl: string
  ctaSecundarioTexto: string
  ctaSecundarioUrl: string
}

export const DEFAULT_HERO: HeroContent = {
  tituloLinea1: "Pasión",
  tituloLinea2: "por el",
  tituloLinea3: "Fútbol",
  descripcion:
    "Décadas formando futbolistas y personas. El club de referencia del fútbol base en la comarca.",
  imagenFondo: "/images/noticias-bg.jpg",
  ctaPrimarioTexto: "CONOCE EL CLUB",
  ctaPrimarioUrl: "/historia",
  ctaSecundarioTexto: "ÚNETE AL CLUB",
  ctaSecundarioUrl: "/socios",
}

export type AboutContent = {
  badge: string
  titulo: string
  parrafo1: string
  parrafo2: string
  parrafo3: string
  enlaceTexto: string
  enlaceUrl: string
}

export const DEFAULT_ABOUT: AboutContent = {
  badge: "Sobre nosotros",
  titulo: "Pasión por el Fútbol",
  parrafo1:
    "Un club de pueblo, una cantera con valores y una forma de entender el fútbol desde el compromiso, el esfuerzo y el sentimiento de equipo.",
  parrafo2:
    "El C.D. Unión Deportiva Villar del Olmo forma parte de la vida deportiva del municipio desde hace décadas. Un club cercano, construido alrededor del fútbol base, el esfuerzo diario y el compromiso de familias, jugadores y entrenadores.",
  parrafo3:
    "Más que competir, el objetivo siempre ha sido formar. Formar futbolistas, pero sobre todo personas que entiendan el valor del compañerismo, el respeto y la pertenencia a un equipo.",
  enlaceTexto: "Conoce nuestra historia",
  enlaceUrl: "/historia",
}

export type CtaContent = {
  badge: string
  tituloLinea1: string
  tituloLinea2: string
  descripcion: string
  botonPrimarioTexto: string
  botonPrimarioUrl: string
  botonSecundarioTexto: string
  botonSecundarioUrl: string
}

export const DEFAULT_CTA: CtaContent = {
  badge: "Inscripciones abiertas",
  tituloLinea1: "ÚNETE A LA",
  tituloLinea2: "FAMILIA",
  descripcion:
    "Inscripciones abiertas para todas las categorías. Ven a conocernos y forma parte de nuestro proyecto deportivo.",
  botonPrimarioTexto: "HAZTE SOCIO",
  botonPrimarioUrl: "/socios",
  botonSecundarioTexto: "CONTACTAR",
  botonSecundarioUrl: "/contacto",
}

export type SiteInfo = {
  email: string
  telefono: string
  facebook: string
  instagram: string
  twitter: string
  youtube: string
}

export const DEFAULT_SITE_INFO: SiteInfo = {
  email: "villardelolmo.ud@gmail.com",
  telefono: "+34677549050",
  facebook: "",
  instagram: "",
  twitter: "",
  youtube: "",
}

// Dirección del campo. Fija en el código a propósito: no es editable desde
// el panel de admin ni se lee de Supabase, para que siempre se muestre en
// formato de dirección postal y el mapa de contacto apunte al sitio correcto.
export const DIRECCION_CLUB = "Campo Municipal de Fútbol\n28511 Villar del Olmo, Madrid"

export type HistoriaContent = {
  tituloLinea1: string
  tituloLinea2: string
  subtitulo: string
  clubBadge: string
  clubTitulo: string
  clubParrafo1: string
  clubParrafo2: string
  clubParrafo3: string
  puebloBadge: string
  puebloTitulo: string
  puebloParrafo1: string
  puebloParrafo2: string
  puebloParrafo3: string
}

export const DEFAULT_HISTORIA: HistoriaContent = {
  tituloLinea1: "NUESTRA",
  tituloLinea2: "HISTORIA",
  subtitulo: "Décadas de pasión, esfuerzo y fútbol en el corazón de Madrid.",
  clubBadge: "Historia del Club",
  clubTitulo: "Décadas formando futbolistas",
  clubParrafo1:
    "El C.D. Unión Deportiva Villar del Olmo nació con la idea de acercar el fútbol a los jóvenes del municipio y crear un espacio donde competir, aprender y crecer dentro de un ambiente de equipo.",
  clubParrafo2:
    "Con el paso de los años, el club se ha convertido en un punto de encuentro para muchas familias de Villar del Olmo y alrededores. Por sus equipos han pasado generaciones de jugadores que han defendido sus colores con ilusión, esfuerzo y respeto por este deporte.",
  clubParrafo3:
    "Hoy, el club mantiene esa misma esencia: seguir impulsando el fútbol base, cuidar la cantera y representar al pueblo dentro y fuera del campo.",
  puebloBadge: "Historia del Pueblo",
  puebloTitulo: "Villar del Olmo",
  puebloParrafo1:
    "Villar del Olmo es un municipio del este de la Comunidad de Madrid, situado en un entorno natural que conserva el carácter tranquilo y cercano de los pueblos de la comarca. Su historia está ligada a la repoblación medieval y al desarrollo de pequeñas comunidades rurales que fueron dando forma a la identidad del municipio.",
  puebloParrafo2:
    "Esa identidad sigue muy presente hoy: un pueblo donde la vida social, las familias y las actividades deportivas tienen un papel importante. En ese contexto, el fútbol se ha convertido en una forma de unión entre generaciones, vecinos y jugadores que comparten algo más que un escudo.",
  puebloParrafo3:
    "El C.D. Unión Deportiva Villar del Olmo representa esa conexión entre pueblo y deporte: competir con orgullo, formar desde la base y mantener vivo el sentimiento de pertenencia.",
}

export type ContactoContent = {
  tituloLinea1: string
  tituloLinea2: string
  subtitulo: string
}

export const DEFAULT_CONTACTO: ContactoContent = {
  tituloLinea1: "PONTE EN",
  tituloLinea2: "CONTACTO",
  subtitulo: "Estamos aquí para resolver cualquier duda sobre inscripciones, equipos o actividades del club.",
}

export type SociosContent = {
  heroBadge: string
  heroTituloLinea1: string
  heroTituloLinea2: string
  heroDescripcion: string
  heroBotonTexto: string
  heroBotonUrl: string
  miembroTitulo: string
  miembroDescripcion: string
  miembroBotonTexto: string
  miembroBotonUrl: string
}

export const DEFAULT_SOCIOS: SociosContent = {
  heroBadge: "Hazte Socio",
  heroTituloLinea1: "Únete a la",
  heroTituloLinea2: "Familia Verde",
  heroDescripcion:
    "Más que un club, una comunidad. Tu apoyo hace posible que sigamos formando deportistas y creando recuerdos.",
  heroBotonTexto: "Quiero ser socio",
  heroBotonUrl: "/contacto",
  miembroTitulo: "¿Ya eres socio?",
  miembroDescripcion: "Accede a tu área personal para gestionar tu membresía, ver tu historial y mucho más.",
  miembroBotonTexto: "Acceder a mi cuenta",
  miembroBotonUrl: "/socios/login",
}

export type PageHeaderContent = {
  tituloLinea1: string
  tituloLinea2: string
  subtitulo: string
}

export const DEFAULT_INSTALACIONES: PageHeaderContent = {
  tituloLinea1: "NUESTRAS",
  tituloLinea2: "INSTALACIONES",
  subtitulo: "Instalaciones modernas al servicio del fútbol base y de toda la comunidad de Villar del Olmo.",
}

export const DEFAULT_EQUIPOS: PageHeaderContent = {
  tituloLinea1: "NUESTROS",
  tituloLinea2: "EQUIPOS",
  subtitulo: "Equipos federados que representan los colores del club cada fin de semana.",
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : []
}

// Límite de elementos en las listas editables (línea de tiempo,
// instalaciones...). Evita que una fila crezca sin control y protege contra
// un guardado accidental o malicioso con miles de entradas.
export const MAX_LIST_ITEMS = 30

export type TimelineItem = {
  anio: string
  evento: string
}

export const DEFAULT_TIMELINE: TimelineItem[] = [
  { anio: "1970", evento: "Fundación del club por un grupo de vecinos apasionados" },
  { anio: "1985", evento: "Inauguración del campo municipal" },
  { anio: "2000", evento: "Creación de la escuela de fútbol base" },
  { anio: "2015", evento: "Renovación completa de instalaciones" },
  { anio: "2020", evento: "Celebración del 50 aniversario" },
]

export type ValueItem = {
  numero: string
  titulo: string
  descripcion: string
}

export const DEFAULT_VALORES: ValueItem[] = [
  { numero: "01", titulo: "FORMACIÓN", descripcion: "Nuestro principal objetivo es formar futbolistas y personas con valores." },
  { numero: "02", titulo: "RESPETO", descripcion: "El respeto a compañeros, rivales y árbitros es fundamental en nuestro club." },
  { numero: "03", titulo: "COMUNIDAD", descripcion: "Somos parte activa del tejido social de Villar del Olmo." },
  { numero: "04", titulo: "PASIÓN", descripcion: "El amor por el fútbol y por nuestros colores nos define." },
]

export type InstalacionItem = {
  nombre: string
  descripcion: string
  imagen: string
}

export const DEFAULT_INSTALACIONES_LISTA: InstalacionItem[] = [
  {
    nombre: "Vestuarios",
    descripcion: "Vestuarios completamente renovados con todas las comodidades para los jugadores y cuerpo técnico del club.",
    imagen: "/images/instalacion-vestuarios.jpg",
  },
  {
    nombre: "Campo de Juego",
    descripcion: "Césped artificial de última generación homologado para competición federada, con medidas reglamentarias.",
    imagen: "/images/instalacion-campo.jpg",
  },
  {
    nombre: "Gradas",
    descripcion: "Gradas con capacidad para los aficionados que nos acompañan en los partidos de local.",
    imagen: "/images/instalacion-gradas.jpg",
  },
]

// Convierte el texto guardado en configuracion_web.valor a un objeto, sin
// lanzar si está corrupto o vacío (config todavía no creada, JSON inválido).
export function parseJsonSafe(raw: string | null | undefined): unknown {
  if (!raw) return undefined
  try {
    return JSON.parse(raw)
  } catch {
    return undefined
  }
}

export function parseHero(raw: unknown): HeroContent {
  const r = asRecord(raw)
  return {
    tituloLinea1: sanitizeText(r.tituloLinea1, 60) || DEFAULT_HERO.tituloLinea1,
    tituloLinea2: sanitizeText(r.tituloLinea2, 60) || DEFAULT_HERO.tituloLinea2,
    tituloLinea3: sanitizeText(r.tituloLinea3, 60) || DEFAULT_HERO.tituloLinea3,
    descripcion: sanitizeText(r.descripcion, 300) || DEFAULT_HERO.descripcion,
    imagenFondo: sanitizeUrl(r.imagenFondo) ?? DEFAULT_HERO.imagenFondo,
    ctaPrimarioTexto: sanitizeText(r.ctaPrimarioTexto, 40) || DEFAULT_HERO.ctaPrimarioTexto,
    ctaPrimarioUrl: sanitizeUrl(r.ctaPrimarioUrl) ?? DEFAULT_HERO.ctaPrimarioUrl,
    ctaSecundarioTexto: sanitizeText(r.ctaSecundarioTexto, 40) || DEFAULT_HERO.ctaSecundarioTexto,
    ctaSecundarioUrl: sanitizeUrl(r.ctaSecundarioUrl) ?? DEFAULT_HERO.ctaSecundarioUrl,
  }
}

export function parseAbout(raw: unknown): AboutContent {
  const r = asRecord(raw)
  return {
    badge: sanitizeText(r.badge, 60) || DEFAULT_ABOUT.badge,
    titulo: sanitizeText(r.titulo, 100) || DEFAULT_ABOUT.titulo,
    parrafo1: sanitizeText(r.parrafo1, 600) || DEFAULT_ABOUT.parrafo1,
    parrafo2: sanitizeText(r.parrafo2, 600) || DEFAULT_ABOUT.parrafo2,
    parrafo3: sanitizeText(r.parrafo3, 600) || DEFAULT_ABOUT.parrafo3,
    enlaceTexto: sanitizeText(r.enlaceTexto, 60) || DEFAULT_ABOUT.enlaceTexto,
    enlaceUrl: sanitizeUrl(r.enlaceUrl) ?? DEFAULT_ABOUT.enlaceUrl,
  }
}

export function parseCta(raw: unknown): CtaContent {
  const r = asRecord(raw)
  return {
    badge: sanitizeText(r.badge, 60) || DEFAULT_CTA.badge,
    tituloLinea1: sanitizeText(r.tituloLinea1, 60) || DEFAULT_CTA.tituloLinea1,
    tituloLinea2: sanitizeText(r.tituloLinea2, 60) || DEFAULT_CTA.tituloLinea2,
    descripcion: sanitizeText(r.descripcion, 300) || DEFAULT_CTA.descripcion,
    botonPrimarioTexto: sanitizeText(r.botonPrimarioTexto, 40) || DEFAULT_CTA.botonPrimarioTexto,
    botonPrimarioUrl: sanitizeUrl(r.botonPrimarioUrl) ?? DEFAULT_CTA.botonPrimarioUrl,
    botonSecundarioTexto: sanitizeText(r.botonSecundarioTexto, 40) || DEFAULT_CTA.botonSecundarioTexto,
    botonSecundarioUrl: sanitizeUrl(r.botonSecundarioUrl) ?? DEFAULT_CTA.botonSecundarioUrl,
  }
}

export function parseSiteInfo(raw: unknown): SiteInfo {
  const r = asRecord(raw)
  return {
    email: sanitizeEmail(r.email) ?? DEFAULT_SITE_INFO.email,
    telefono: sanitizePhone(r.telefono) ?? DEFAULT_SITE_INFO.telefono,
    facebook: sanitizeUrl(r.facebook) ?? "",
    instagram: sanitizeUrl(r.instagram) ?? "",
    twitter: sanitizeUrl(r.twitter) ?? "",
    youtube: sanitizeUrl(r.youtube) ?? "",
  }
}

export function parseHistoria(raw: unknown): HistoriaContent {
  const r = asRecord(raw)
  return {
    tituloLinea1: sanitizeText(r.tituloLinea1, 60) || DEFAULT_HISTORIA.tituloLinea1,
    tituloLinea2: sanitizeText(r.tituloLinea2, 60) || DEFAULT_HISTORIA.tituloLinea2,
    subtitulo: sanitizeText(r.subtitulo, 300) || DEFAULT_HISTORIA.subtitulo,
    clubBadge: sanitizeText(r.clubBadge, 60) || DEFAULT_HISTORIA.clubBadge,
    clubTitulo: sanitizeText(r.clubTitulo, 100) || DEFAULT_HISTORIA.clubTitulo,
    clubParrafo1: sanitizeText(r.clubParrafo1, 600) || DEFAULT_HISTORIA.clubParrafo1,
    clubParrafo2: sanitizeText(r.clubParrafo2, 600) || DEFAULT_HISTORIA.clubParrafo2,
    clubParrafo3: sanitizeText(r.clubParrafo3, 600) || DEFAULT_HISTORIA.clubParrafo3,
    puebloBadge: sanitizeText(r.puebloBadge, 60) || DEFAULT_HISTORIA.puebloBadge,
    puebloTitulo: sanitizeText(r.puebloTitulo, 100) || DEFAULT_HISTORIA.puebloTitulo,
    puebloParrafo1: sanitizeText(r.puebloParrafo1, 600) || DEFAULT_HISTORIA.puebloParrafo1,
    puebloParrafo2: sanitizeText(r.puebloParrafo2, 600) || DEFAULT_HISTORIA.puebloParrafo2,
    puebloParrafo3: sanitizeText(r.puebloParrafo3, 600) || DEFAULT_HISTORIA.puebloParrafo3,
  }
}

export function parseContacto(raw: unknown): ContactoContent {
  const r = asRecord(raw)
  return {
    tituloLinea1: sanitizeText(r.tituloLinea1, 60) || DEFAULT_CONTACTO.tituloLinea1,
    tituloLinea2: sanitizeText(r.tituloLinea2, 60) || DEFAULT_CONTACTO.tituloLinea2,
    subtitulo: sanitizeText(r.subtitulo, 300) || DEFAULT_CONTACTO.subtitulo,
  }
}

// A diferencia de los parse* de objetos fijos, aquí `raw === undefined`
// (todavía no se ha guardado nada) es lo único que dispara el valor por
// defecto. Si el admin guarda la lista vacía a propósito (borra todos los
// hitos, por ejemplo), se respeta esa lista vacía en vez de resucitar los
// valores de fábrica.
export function parseTimeline(raw: unknown): TimelineItem[] {
  if (raw === undefined) return DEFAULT_TIMELINE
  return asArray(raw)
    .slice(0, MAX_LIST_ITEMS)
    .map((item) => {
      const r = asRecord(item)
      return {
        anio: sanitizeText(r.anio, 20),
        evento: sanitizeText(r.evento, 200),
      }
    })
    .filter((item) => item.evento)
}

export function parseValores(raw: unknown): ValueItem[] {
  if (raw === undefined) return DEFAULT_VALORES
  return asArray(raw)
    .slice(0, MAX_LIST_ITEMS)
    .map((item) => {
      const r = asRecord(item)
      return {
        numero: sanitizeText(r.numero, 10),
        titulo: sanitizeText(r.titulo, 60),
        descripcion: sanitizeText(r.descripcion, 300),
      }
    })
    .filter((item) => item.titulo)
}

export function parseInstalacionesLista(raw: unknown): InstalacionItem[] {
  if (raw === undefined) return DEFAULT_INSTALACIONES_LISTA
  return asArray(raw)
    .slice(0, MAX_LIST_ITEMS)
    .map((item) => {
      const r = asRecord(item)
      return {
        nombre: sanitizeText(r.nombre, 100),
        descripcion: sanitizeText(r.descripcion, 400),
        imagen: sanitizeUrl(r.imagen) ?? "",
      }
    })
    .filter((item) => item.nombre && item.imagen)
}

export function parsePageHeader(raw: unknown, fallback: PageHeaderContent): PageHeaderContent {
  const r = asRecord(raw)
  return {
    tituloLinea1: sanitizeText(r.tituloLinea1, 60) || fallback.tituloLinea1,
    tituloLinea2: sanitizeText(r.tituloLinea2, 60) || fallback.tituloLinea2,
    subtitulo: sanitizeText(r.subtitulo, 300) || fallback.subtitulo,
  }
}

export function parseSocios(raw: unknown): SociosContent {
  const r = asRecord(raw)
  return {
    heroBadge: sanitizeText(r.heroBadge, 60) || DEFAULT_SOCIOS.heroBadge,
    heroTituloLinea1: sanitizeText(r.heroTituloLinea1, 60) || DEFAULT_SOCIOS.heroTituloLinea1,
    heroTituloLinea2: sanitizeText(r.heroTituloLinea2, 60) || DEFAULT_SOCIOS.heroTituloLinea2,
    heroDescripcion: sanitizeText(r.heroDescripcion, 300) || DEFAULT_SOCIOS.heroDescripcion,
    heroBotonTexto: sanitizeText(r.heroBotonTexto, 40) || DEFAULT_SOCIOS.heroBotonTexto,
    heroBotonUrl: sanitizeUrl(r.heroBotonUrl) ?? DEFAULT_SOCIOS.heroBotonUrl,
    miembroTitulo: sanitizeText(r.miembroTitulo, 100) || DEFAULT_SOCIOS.miembroTitulo,
    miembroDescripcion: sanitizeText(r.miembroDescripcion, 300) || DEFAULT_SOCIOS.miembroDescripcion,
    miembroBotonTexto: sanitizeText(r.miembroBotonTexto, 40) || DEFAULT_SOCIOS.miembroBotonTexto,
    miembroBotonUrl: sanitizeUrl(r.miembroBotonUrl) ?? DEFAULT_SOCIOS.miembroBotonUrl,
  }
}
