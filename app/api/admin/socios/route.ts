import { NextRequest, NextResponse } from "next/server"
import { isAdmin } from "@/lib/supabase/auth"
import { createAdminClient, generarPasswordSegura } from "@/lib/supabase/admin-client"

export async function POST(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })
  }

  const body = await request.json()
  const {
    nombre,
    apellidos,
    email,
    telefono,
    dni,
    direccion,
    codigo_postal,
    localidad,
    fecha_nacimiento,
    tipo,
    forma_pago,
  } = body

  if (!nombre || !apellidos || !email || !tipo || !forma_pago) {
    return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 })
  }

  const admin = createAdminClient()

  const { count } = await admin
    .from("socios")
    .select("*", { count: "exact", head: true })

  const numeroSocio = String((count || 0) + 1).padStart(5, "0")

  const cuota_anual =
    tipo === "Infantil" ? 50 : tipo === "Juvenil" ? 75 : tipo === "Veterano" ? 80 : 100

  const { data: socio, error: insertError } = await admin
    .from("socios")
    .insert({
      numero_socio: numeroSocio,
      nombre,
      apellidos,
      email,
      telefono: telefono || null,
      dni: dni || null,
      direccion: direccion || null,
      codigo_postal: codigo_postal || null,
      localidad: localidad || null,
      fecha_nacimiento: fecha_nacimiento || null,
      tipo,
      estado: "activo",
      fecha_alta: new Date().toISOString().split("T")[0],
      forma_pago,
      cuota_anual,
    })
    .select()
    .single()

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  // Crear la cuenta de acceso del socio con una contraseña generada.
  const password = generarPasswordSegura()
  const { error: authError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (authError) {
    // El socio ya se ha creado en la base de datos; si falla la cuenta
    // (p.ej. ya existe un usuario con ese email), avisamos sin contraseña.
    return NextResponse.json({
      success: true,
      socio,
      generatedPassword: null,
      authWarning:
        authError.message.includes("already been registered") || authError.code === "email_exists"
          ? "Ya existe una cuenta con este email; el socio puede acceder con su contraseña actual."
          : `No se pudo crear la cuenta de acceso: ${authError.message}`,
    })
  }

  return NextResponse.json({ success: true, socio, generatedPassword: password })
}
