// Limitador de peticiones muy simple, en memoria, por IP. Sirve como barrera
// básica contra spam/abuso en formularios públicos (p.ej. contacto). No es
// apto para entornos multi-instancia (cada instancia serverless tendría su
// propio contador), pero añade una defensa razonable para un sitio de tráfico
// bajo sin depender de infraestructura externa (Redis, etc.).
const intentos = new Map<string, { count: number; resetAt: number }>()

export function comprobarLimite(
  clave: string,
  maxPeticiones: number,
  ventanaMs: number
): { permitido: boolean; restante: number } {
  const ahora = Date.now()
  const entrada = intentos.get(clave)

  if (!entrada || ahora > entrada.resetAt) {
    intentos.set(clave, { count: 1, resetAt: ahora + ventanaMs })
    return { permitido: true, restante: maxPeticiones - 1 }
  }

  if (entrada.count >= maxPeticiones) {
    return { permitido: false, restante: 0 }
  }

  entrada.count += 1
  return { permitido: true, restante: maxPeticiones - entrada.count }
}

export function obtenerIpCliente(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) return forwarded.split(",")[0].trim()
  return request.headers.get("x-real-ip") || "unknown"
}
