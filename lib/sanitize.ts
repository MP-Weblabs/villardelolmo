// Sanitización de contenido editable desde el panel de admin.
//
// El texto en sí no necesita "limpieza" contra XSS para mostrarse como texto:
// React escapa los nodos de texto automáticamente. El peligro real está en los
// campos que acaban en un atributo como href/src (enlaces, imagen de fondo,
// redes sociales): ahí sí hay que restringir el esquema de la URL para que no
// se pueda colar "javascript:", "data:", "vbscript:", etc. Estas funciones son
// la barrera de seguridad; se aplican tanto al leer de la base de datos
// (por si el dato ya guardado es inválido) como al guardar desde el admin.

const MAX_TEXT_LENGTH_DEFAULT = 500

function stripControlChars(value: string): string {
  let out = ""
  for (const ch of value) {
    const code = ch.codePointAt(0) ?? 0
    // Deja pasar tabulador (9), salto de línea (10) y retorno de carro (13);
    // descarta el resto de caracteres de control (0-31 y 127).
    if (code === 9 || code === 10 || code === 13) {
      out += ch
      continue
    }
    if (code < 32 || code === 127) continue
    out += ch
  }
  return out
}

// Quita caracteres de control y los símbolos < > (evita que el valor se
// pueda confundir con una etiqueta HTML si algún día se usa fuera de JSX,
// p. ej. en un <meta>, un feed RSS o un email).
export function sanitizeText(value: unknown, maxLength = MAX_TEXT_LENGTH_DEFAULT): string {
  if (typeof value !== "string") return ""
  return stripControlChars(value)
    .replace(/[<>]/g, "")
    .trim()
    .slice(0, maxLength)
}

// Solo admite rutas internas ("/socios") o URLs absolutas http(s). Devuelve
// null si el valor no es válido o usa un esquema peligroso, para que quien
// llama decida si aplica un valor por defecto o muestra un error.
export function sanitizeUrl(value: unknown): string | null {
  if (typeof value !== "string") return null
  const trimmed = value.trim()
  if (!trimmed) return null

  if (trimmed.startsWith("/")) {
    if (trimmed.startsWith("//") || trimmed.startsWith("/\\")) return null
    return trimmed.slice(0, 500)
  }

  try {
    const url = new URL(trimmed)
    if (url.protocol === "http:" || url.protocol === "https:") {
      return url.toString().slice(0, 500)
    }
  } catch {
    // no es una URL absoluta válida
  }
  return null
}

export function sanitizeEmail(value: unknown): string | null {
  if (typeof value !== "string") return null
  const trimmed = value.trim()
  if (!trimmed || trimmed.length > 255) return null
  const EMAIL_RE = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/
  return EMAIL_RE.test(trimmed) ? trimmed : null
}

export function sanitizePhone(value: unknown): string | null {
  if (typeof value !== "string") return null
  const cleaned = value.replace(/[^0-9+\-\s()]/g, "").trim()
  return cleaned ? cleaned.slice(0, 30) : null
}
