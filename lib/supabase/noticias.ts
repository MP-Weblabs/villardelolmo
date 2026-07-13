import { createClient } from './server'

// Obtener todas las noticias publicadas
export async function getNoticias(limit?: number) {
  const supabase = await createClient()

  let query = supabase
    .from('noticias')
    .select(`
      *,
      categoria:categorias_noticia(id, nombre, slug)
    `)
    .eq('publicada', true)
    .order('fecha_publicacion', { ascending: false })

  if (limit) {
    query = query.limit(limit)
  }

  const { data, error } = await query

  if (error) throw error
  return data
}

// Obtener noticia por slug
export async function getNoticiaBySlug(slug: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('noticias')
    .select(`
      *,
      categoria:categorias_noticia(id, nombre, slug)
    `)
    .eq('slug', slug)
    .eq('publicada', true)
    .single()

  if (error) throw error
  return data
}

// Obtener noticias destacadas
export async function getNoticiasDestacadas(limit = 3) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('noticias')
    .select(`
      *,
      categoria:categorias_noticia(id, nombre, slug)
    `)
    .eq('publicada', true)
    .eq('destacada', true)
    .order('fecha_publicacion', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data
}
