import { NextRequest, NextResponse } from 'next/server'
import { enviarMensajeContacto } from '@/lib/supabase/contacto'
import { comprobarLimite, obtenerIpCliente } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  try {
    const ip = obtenerIpCliente(request)
    const { permitido } = comprobarLimite(`contacto:${ip}`, 5, 10 * 60 * 1000)
    if (!permitido) {
      return NextResponse.json(
        { error: 'Demasiadas solicitudes. Inténtalo de nuevo más tarde.' },
        { status: 429 }
      )
    }

    const body = await request.json()

    const { nombre, email, telefono, asunto, mensaje } = body

    // Validación básica
    if (!nombre || !email || !asunto || !mensaje) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios' },
        { status: 400 }
      )
    }
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email no válido' },
        { status: 400 }
      )
    }
    
    await enviarMensajeContacto({
      nombre,
      email,
      telefono: telefono || null,
      asunto,
      mensaje,
    })

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    console.error('Error al enviar mensaje:', error)
    return NextResponse.json(
      { error: 'Error al enviar el mensaje' },
      { status: 500 }
    )
  }
}
