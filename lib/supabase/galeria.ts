import { createClient } from "./client"
import { subirImagen } from "./upload-imagen"
import type { Database } from "../database.types"

type Galeria = Database["public"]["Tables"]["galeria"]["Row"]
type GaleriaInsert = Database["public"]["Tables"]["galeria"]["Insert"]
type GaleriaUpdate = Database["public"]["Tables"]["galeria"]["Update"]

// ============================================
// OBTENER IMÁGENES
// ============================================

export async function getGaleria(options?: {
  album?: string
  publicada?: boolean
  destacada?: boolean
  limit?: number
}) {
  const supabase = createClient()
  
  let query = supabase
    .from("galeria")
    .select("*")
    .order("orden", { ascending: true })
    .order("created_at", { ascending: false })

  if (options?.album) {
    query = query.eq("album", options.album)
  }
  if (options?.publicada !== undefined) {
    query = query.eq("publicada", options.publicada)
  }
  if (options?.destacada) {
    query = query.eq("destacada", true)
  }
  if (options?.limit) {
    query = query.limit(options.limit)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching galeria:", error)
    return []
  }

  return data as Galeria[]
}

export async function getGaleriaPublicada(limit?: number) {
  return getGaleria({ publicada: true, limit })
}

// ============================================
// SUBIR ARCHIVO AL BUCKET "galeria"
// ============================================

export async function subirImagenGaleria(file: File) {
  return subirImagen(file, "fotos")
}

// ============================================
// CREAR IMAGEN
// ============================================

export async function createImagen(imagen: GaleriaInsert) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from("galeria")
    .insert(imagen)
    .select()
    .single()

  if (error) {
    console.error("Error creating imagen:", error)
    throw new Error(error.message)
  }

  return data as Galeria
}

// ============================================
// ACTUALIZAR IMAGEN
// ============================================

export async function updateImagen(id: string, updates: GaleriaUpdate) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from("galeria")
    .update(updates)
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("Error updating imagen:", error)
    throw new Error(error.message)
  }

  return data as Galeria
}

// ============================================
// ELIMINAR IMAGEN
// ============================================

export async function deleteImagen(id: string) {
  const supabase = createClient()
  
  const { error } = await supabase
    .from("galeria")
    .delete()
    .eq("id", id)

  if (error) {
    console.error("Error deleting imagen:", error)
    throw new Error(error.message)
  }

  return true
}

// ============================================
// TOGGLE PUBLICADA/DESTACADA
// ============================================

export async function toggleImagenPublicada(id: string, publicada: boolean) {
  return updateImagen(id, { publicada })
}

export async function toggleImagenDestacada(id: string, destacada: boolean) {
  return updateImagen(id, { destacada })
}
