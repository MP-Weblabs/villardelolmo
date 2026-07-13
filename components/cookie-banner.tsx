"use client"

import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import { useCookieConsent } from "@/lib/cookie-consent"

export function CookieBanner() {
  const { consent, ready, accept, reject } = useCookieConsent()

  const visible = ready && consent === null

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-x-0 bottom-0 z-[100] p-4 sm:p-6"
        >
          <div className="mx-auto max-w-3xl bg-foreground text-background rounded-2xl shadow-2xl p-6 flex flex-col sm:flex-row sm:items-center gap-4">
            <p className="text-sm text-background/80 flex-1 leading-relaxed">
              Usamos cookies técnicas necesarias para que la web funcione (por ejemplo, para mantener
              tu sesión si entras como socio o administrador). Si lo aceptas, también activaremos el
              mapa de Google incrustado en la página de Contacto. Puedes leer más en nuestra{" "}
              <Link href="/cookies" className="underline hover:text-background">
                Política de Cookies
              </Link>.
            </p>
            <div className="flex gap-3 shrink-0">
              <button
                type="button"
                onClick={reject}
                className="px-4 py-2.5 text-sm font-semibold rounded-lg border border-background/30 hover:bg-background/10 transition-colors whitespace-nowrap"
              >
                Rechazar no esenciales
              </button>
              <button
                type="button"
                onClick={accept}
                className="px-4 py-2.5 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors whitespace-nowrap"
              >
                Aceptar todas
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
