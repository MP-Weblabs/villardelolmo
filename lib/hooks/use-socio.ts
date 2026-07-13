"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import type { Database } from "@/lib/database.types"

type Socio = Database["public"]["Tables"]["socios"]["Row"]

export function useSocio() {
  const [socio, setSocio] = useState<Socio | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSocio = async () => {
    setLoading(true)
    const supabase = createBrowserClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || !user.email) {
      setError("No hay sesión activa")
      setLoading(false)
      return
    }

    const { data, error: socioError } = await supabase
      .from("socios")
      .select("*")
      .eq("email", user.email)
      .single()

    if (socioError) {
      setError("No se ha encontrado tu ficha de socio. Contacta con el club.")
      setSocio(null)
    } else {
      setSocio(data)
      setError(null)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchSocio()
  }, [])

  return { socio, loading, error, refetch: fetchSocio }
}
