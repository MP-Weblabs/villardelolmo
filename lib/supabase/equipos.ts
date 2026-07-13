import { createClient } from './server'

// Obtener todos los equipos activos
export async function getEquipos() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('equipos')
    .select(`
      *,
      categoria:categorias_equipo(id, nombre, orden)
    `)
    .eq('activo', true)
    .order('categorias_equipo(orden)')

  if (error) throw error
  return data
}

// Obtener equipos por temporada
export async function getEquiposByTemporada(temporada: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('equipos')
    .select(`
      *,
      categoria:categorias_equipo(id, nombre, orden)
    `)
    .eq('temporada', temporada)
    .eq('activo', true)
    .order('categorias_equipo(orden)')

  if (error) throw error
  return data
}

// Obtener equipo por ID (la tabla equipos no tiene columna slug)
export async function getEquipoByIdActivo(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('equipos')
    .select(`
      *,
      categoria:categorias_equipo(id, nombre, orden),
      jugadores(*)
    `)
    .eq('id', id)
    .eq('activo', true)
    .single()

  if (error) throw error
  return data
}
