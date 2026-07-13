"use client"

import { useState } from "react"
import Image from "next/image"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Loader2, AlertCircle } from "lucide-react"
import { subirImagen } from "@/lib/supabase/upload-imagen"

interface ImageUploadFieldProps {
  id?: string
  label: string
  value: string
  onChange: (url: string) => void
  carpeta?: string
  required?: boolean
}

export function ImageUploadField({ id, label, value, onChange, carpeta, required }: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError(null)
    try {
      const url = await subirImagen(file, carpeta)
      onChange(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se ha podido subir la imagen")
    } finally {
      setUploading(false)
      e.target.value = ""
    }
  }

  return (
    <div className="space-y-2">
      {label && <Label htmlFor={id}>{label}{required ? " *" : ""}</Label>}
      {value && (
        <div className="relative aspect-video w-full max-w-xs overflow-hidden rounded-lg border border-zinc-200">
          <Image src={value} alt="Vista previa" fill className="object-cover" />
        </div>
      )}
      <Input
        id={id}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleFileChange}
        disabled={uploading}
      />
      <p className="text-xs text-zinc-500">JPG, PNG, GIF o WEBP, máx. 5 MB. No se admiten SVG.</p>
      {uploading && (
        <p className="text-xs text-zinc-500 flex items-center gap-1">
          <Loader2 className="w-3 h-3 animate-spin" /> Subiendo y comprobando la imagen...
        </p>
      )}
      {error && (
        <p className="text-xs text-red-600 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" /> {error}
        </p>
      )}
    </div>
  )
}
