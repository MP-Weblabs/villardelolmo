"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { 
  Percent,
  Store,
  Utensils,
  Car,
  Dumbbell,
  Gift,
  Copy,
  CheckCircle,
  ExternalLink,
  Tag,
  Clock
} from "lucide-react"

const beneficios = [
  {
    id: 1,
    titulo: "Bar Restaurante El Campo",
    descripcion: "10% de descuento en consumiciones y menús",
    descuento: "10%",
    categoria: "Restauración",
    icono: Utensils,
    codigo: "UDVO10BAR",
    direccion: "Plaza Mayor 5, Villar del Olmo",
    validoHasta: "2026-12-31",
    activo: true
  },
  {
    id: 2,
    titulo: "Autoservicio Villar",
    descripcion: "5% en compras superiores a 30€",
    descuento: "5%",
    categoria: "Comercio",
    icono: Store,
    codigo: "UDVO5AUTO",
    direccion: "Calle Real 12, Villar del Olmo",
    validoHasta: "2026-12-31",
    activo: true
  },
  {
    id: 3,
    titulo: "Gimnasio FitVillar",
    descripcion: "15% descuento en cuota mensual",
    descuento: "15%",
    categoria: "Deportes",
    icono: Dumbbell,
    codigo: "UDVO15GYM",
    direccion: "Av. de Madrid 8, Villar del Olmo",
    validoHasta: "2026-06-30",
    activo: true
  },
  {
    id: 4,
    titulo: "Taller Mecánico Hermanos López",
    descripcion: "10% en revisiones y mantenimiento",
    descuento: "10%",
    categoria: "Automoción",
    icono: Car,
    codigo: "UDVO10MECA",
    direccion: "Pol. Industrial, Nave 3",
    validoHasta: "2026-12-31",
    activo: true
  },
  {
    id: 5,
    titulo: "Tienda Deportiva ProSport",
    descripcion: "20% en equipaciones del club",
    descuento: "20%",
    categoria: "Deportes",
    icono: Gift,
    codigo: "UDVO20EQUIP",
    direccion: "Online - prosport.es",
    validoHasta: "2026-12-31",
    activo: true
  }
]

const categorias = ["Todos", "Restauración", "Comercio", "Deportes", "Automoción"]

export default function BeneficiosSocioPage() {
  const [categoriaActiva, setCategoriaActiva] = useState("Todos")
  const [codigoCopiado, setCodigoCopiado] = useState<string | null>(null)

  const beneficiosFiltrados = categoriaActiva === "Todos" 
    ? beneficios 
    : beneficios.filter(b => b.categoria === categoriaActiva)

  const copiarCodigo = (codigo: string) => {
    navigator.clipboard.writeText(codigo)
    setCodigoCopiado(codigo)
    setTimeout(() => setCodigoCopiado(null), 2000)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-heading font-bold text-foreground">Beneficios</h1>
        <p className="text-muted-foreground mt-1">Descuentos exclusivos para socios del club</p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <div className="bg-card rounded-xl border border-border p-4 text-center">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <Percent className="w-5 h-5 text-primary" />
          </div>
          <p className="text-2xl font-heading font-bold mt-2">{beneficios.length}</p>
          <p className="text-sm text-muted-foreground">Descuentos activos</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 text-center">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <Store className="w-5 h-5 text-primary" />
          </div>
          <p className="text-2xl font-heading font-bold mt-2">{beneficios.length}</p>
          <p className="text-sm text-muted-foreground">Comercios</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 text-center">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <Tag className="w-5 h-5 text-primary" />
          </div>
          <p className="text-2xl font-heading font-bold mt-2">20%</p>
          <p className="text-sm text-muted-foreground">Máximo descuento</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 text-center">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <Gift className="w-5 h-5 text-primary" />
          </div>
          <p className="text-2xl font-heading font-bold mt-2">4</p>
          <p className="text-sm text-muted-foreground">Categorías</p>
        </div>
      </motion.div>

      {/* Filtros */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap gap-2"
      >
        {categorias.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoriaActiva(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              categoriaActiva === cat
                ? "bg-primary text-white"
                : "bg-muted hover:bg-muted/80 text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </motion.div>

      {/* Lista de beneficios */}
      <div className="grid md:grid-cols-2 gap-6">
        {beneficiosFiltrados.map((beneficio, index) => {
          const Icon = beneficio.icono
          return (
            <motion.div
              key={beneficio.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-lg">{beneficio.titulo}</h3>
                      <p className="text-muted-foreground text-sm mt-1">{beneficio.descripcion}</p>
                    </div>
                  </div>
                  <div className="bg-primary text-white text-lg font-heading font-bold px-3 py-1 rounded-lg">
                    {beneficio.descuento}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <Clock className="w-4 h-4" />
                    <span>Válido hasta {new Date(beneficio.validoHasta).toLocaleDateString("es-ES")}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-muted rounded-lg px-4 py-3 font-mono text-sm">
                      {beneficio.codigo}
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copiarCodigo(beneficio.codigo)}
                      className="flex-shrink-0"
                    >
                      {codigoCopiado === beneficio.codigo ? (
                        <CheckCircle className="w-4 h-4 text-primary" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{beneficio.direccion}</span>
                  <Button variant="ghost" size="sm" className="gap-1 text-primary">
                    Ver más <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl border border-primary/20 p-8 text-center"
      >
        <h3 className="text-xl font-heading font-bold">¿Tienes un negocio?</h3>
        <p className="text-muted-foreground mt-2 max-w-md mx-auto">
          Colabora con el club y ofrece descuentos a nuestros socios. Contacta con nosotros para más información.
        </p>
        <Button className="mt-4 bg-primary hover:bg-primary/90">
          Quiero colaborar
        </Button>
      </motion.div>
    </div>
  )
}
