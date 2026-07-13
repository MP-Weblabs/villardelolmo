"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

// Pequeños wrappers de framer-motion para los elementos con "whileHover" de
// la página de Historia. `motion.div` no se puede usar directamente dentro
// de un Server Component (page.tsx ya no lleva "use client" porque ahora
// hace fetch de datos en el servidor); aislar el hover aquí resuelve eso.

export function ValueCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div className={className} whileHover={{ scale: 1.02 }}>
      {children}
    </motion.div>
  )
}

export function TimelineRow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div className={className} whileHover={{ x: 10 }}>
      {children}
    </motion.div>
  )
}
