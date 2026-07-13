"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import { DEFAULT_SITE_INFO, parseSiteInfo, parseJsonSafe, type SiteInfo } from "@/lib/site-content"

// Lee la configuración general del sitio (contacto, redes) desde el
// navegador. Se usa en componentes que no pueden hacer el fetch en el
// servidor porque son Client Components con estado propio (formularios,
// hooks de interacción) y aparecen en muchas páginas distintas.
export function useSiteInfo() {
  const [siteInfo, setSiteInfo] = useState<SiteInfo>(DEFAULT_SITE_INFO)

  useEffect(() => {
    let cancelled = false
    const supabase = createBrowserClient()
    supabase
      .from("configuracion_web")
      .select("valor")
      .eq("clave", "sitio")
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled || !data?.valor) return
        setSiteInfo(parseSiteInfo(parseJsonSafe(data.valor)))
      })
    return () => {
      cancelled = true
    }
  }, [])

  return siteInfo
}
