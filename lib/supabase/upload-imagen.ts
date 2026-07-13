import { createClient } from "./client"

// Tipos de imagen permitidos. SVG queda excluido a propósito: puede llevar
// <script> u onload= incrustado y se ejecutaría si alguien abre la URL
// directamente. El bucket de Storage también lo rechaza por su cuenta
// (allowed_mime_types), esto es una segunda barrera en el navegador.
const FIRMAS: { mime: string; bytes: number[] }[] = [
  { mime: "image/jpeg", bytes: [0xff, 0xd8, 0xff] },
  { mime: "image/png", bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] },
  { mime: "image/gif", bytes: [0x47, 0x49, 0x46, 0x38] },
]

async function detectarTipoReal(file: File): Promise<string | null> {
  const header = new Uint8Array(await file.slice(0, 16).arrayBuffer())

  for (const firma of FIRMAS) {
    if (firma.bytes.every((b, i) => header[i] === b)) return firma.mime
  }

  // WEBP: "RIFF" + 4 bytes de tamaño + "WEBP"
  const esRiff = [0x52, 0x49, 0x46, 0x46].every((b, i) => header[i] === b)
  const esWebp = [0x57, 0x45, 0x42, 0x50].every((b, i) => header[8 + i] === b)
  if (esRiff && esWebp) return "image/webp"

  return null
}

// Vuelve a dibujar la imagen en un <canvas> y la reexporta como PNG/JPEG.
// Esto descarta cualquier byte que no sea el píxel en sí: metadatos EXIF,
// scripts incrustados en polyglots, cabeceras manipuladas, etc. Lo que sale
// de aquí es una imagen "limpia" generada por el propio navegador.
async function reescribirComoImagenLimpia(file: File, mimeReal: string): Promise<Blob> {
  const bitmap = await createImageBitmap(file)
  const canvas = document.createElement("canvas")
  canvas.width = bitmap.width
  canvas.height = bitmap.height

  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("No se ha podido procesar la imagen")
  ctx.drawImage(bitmap, 0, 0)

  const salidaMime = mimeReal === "image/png" ? "image/png" : "image/jpeg"
  const blob: Blob | null = await new Promise((resolve) =>
    canvas.toBlob(resolve, salidaMime, 0.92)
  )
  if (!blob) throw new Error("No se ha podido procesar la imagen")
  return blob
}

export async function sanearImagen(file: File): Promise<{ blob: Blob; extension: string }> {
  if (file.size === 0) throw new Error("El archivo está vacío")
  if (file.size > 5 * 1024 * 1024) throw new Error("La imagen no puede superar 5 MB")

  const mimeReal = await detectarTipoReal(file)
  if (!mimeReal) {
    throw new Error("Formato no permitido. Solo se aceptan imágenes JPG, PNG, GIF o WEBP.")
  }

  // GIF (incluido animado) se sube tal cual: el canvas solo capturaría el
  // primer fotograma. Su formato es simple y no permite scripts incrustados.
  if (mimeReal === "image/gif") {
    return { blob: file, extension: "gif" }
  }

  const limpia = await reescribirComoImagenLimpia(file, mimeReal)
  return { blob: limpia, extension: limpia.type === "image/png" ? "png" : "jpg" }
}

export async function subirImagen(file: File, carpeta = ""): Promise<string> {
  const { blob, extension } = await sanearImagen(file)

  const supabase = createClient()
  const nombreArchivo = `${carpeta ? `${carpeta}/` : ""}${crypto.randomUUID()}.${extension}`

  const { error: uploadError } = await supabase.storage
    .from("galeria")
    .upload(nombreArchivo, blob, { cacheControl: "3600", upsert: false })

  if (uploadError) throw uploadError

  const { data } = supabase.storage.from("galeria").getPublicUrl(nombreArchivo)
  return data.publicUrl
}
