"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  Edit,
  Loader2,
  AlertCircle,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Shield,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { Database } from "@/lib/database.types"

type Socio = Database["public"]["Tables"]["socios"]["Row"]

const tipoLabel: Record<string, string> = {
  Adulto: "Adulto",
  Juvenil: "Juvenil",
  Infantil: "Infantil",
  Veterano: "Veterano",
  Honorario: "Honorario",
}

export default function SocioDetallePage() {
  const params = useParams()
  const id = params.id as string

  const [socio, setSocio] = useState<Socio | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSocio() {
      try {
        const supabase = createClient()
        const { data, error: fetchError } = await supabase
          .from("socios")
          .select("*")
          .eq("id", id)
          .single()

        if (fetchError) throw fetchError
        setSocio(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "No se ha podido cargar el socio")
      } finally {
        setLoading(false)
      }
    }
    fetchSocio()
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !socio) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
        <p className="text-red-700 font-medium">{error || "Socio no encontrado"}</p>
        <Link href="/admin/socios" className="inline-block mt-4">
          <Button variant="outline">Volver a socios</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/socios">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-heading font-bold text-zinc-900">{socio.nombre} {socio.apellidos}</h1>
            <p className="text-zinc-600">Socio #{socio.numero_socio}</p>
          </div>
        </div>
        <Link href={`/admin/socios/${id}/editar`}>
          <Button variant="outline" className="gap-2">
            <Edit className="w-4 h-4" /> Editar
          </Button>
        </Link>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex gap-3">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
          socio.estado === "activo" ? "bg-green-100 text-green-700" :
          socio.estado === "pendiente" ? "bg-amber-100 text-amber-700" :
          "bg-zinc-100 text-zinc-700"
        }`}>
          {socio.estado}
        </span>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
          Socio {tipoLabel[socio.tipo] || socio.tipo}
        </span>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl border border-zinc-200 p-6">
        <h2 className="font-heading font-bold text-lg mb-6">Contacto</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-zinc-400" />
            <span>{socio.email}</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-zinc-400" />
            <span>{socio.telefono || "Sin teléfono"}</span>
          </div>
          <div className="flex items-center gap-3 sm:col-span-2">
            <MapPin className="w-5 h-5 text-zinc-400" />
            <span>
              {socio.direccion || "Sin dirección"}
              {socio.localidad ? `, ${socio.localidad}` : ""}
              {socio.codigo_postal ? ` (${socio.codigo_postal})` : ""}
            </span>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-xl border border-zinc-200 p-6">
        <h2 className="font-heading font-bold text-lg mb-6">Datos del Socio</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-zinc-400" />
            <span>DNI: {socio.dni || "No registrado"}</span>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-zinc-400" />
            <span>Nacimiento: {socio.fecha_nacimiento ? new Date(socio.fecha_nacimiento).toLocaleDateString("es-ES") : "No registrado"}</span>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-zinc-400" />
            <span>Alta: {new Date(socio.fecha_alta).toLocaleDateString("es-ES")}</span>
          </div>
          <div className="flex items-center gap-3">
            <CreditCard className="w-5 h-5 text-zinc-400" />
            <span>Pago: {socio.forma_pago || "No especificado"} ({socio.cuota_anual ?? "-"}€/año)</span>
          </div>
        </div>
        {socio.notas && (
          <div className="mt-4 pt-4 border-t border-zinc-100">
            <p className="text-sm text-zinc-500 mb-1">Notas</p>
            <p className="text-sm text-zinc-700 whitespace-pre-line">{socio.notas}</p>
          </div>
        )}
      </motion.div>
    </div>
  )
}
