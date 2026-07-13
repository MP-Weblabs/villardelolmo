import { createClient } from './server'
import type { Database } from '../database.types'

type ContactoMensajeInsert = Database['public']['Tables']['contacto_mensajes']['Insert']

// Enviar mensaje de contacto.
//
// Importante: no se hace .select() tras el insert. Un visitante anónimo no
// tiene (ni debe tener) permiso de SELECT sobre contacto_mensajes -así no
// puede leer mensajes de otras personas-, y pedir la fila de vuelta con
// RETURNING obliga a Postgres a comprobar esa política de lectura: sin ella,
// el INSERT entero se rechaza aunque el propio INSERT esté permitido.
export async function enviarMensajeContacto(mensaje: ContactoMensajeInsert) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('contacto_mensajes')
    .insert(mensaje)

  if (error) throw error
}
