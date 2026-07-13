"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

type ConsentValue = "accepted" | "rejected" | null

interface CookieConsentContextValue {
  consent: ConsentValue
  ready: boolean
  accept: () => void
  reject: () => void
  reset: () => void
}

const STORAGE_KEY = "udvillar-cookie-consent"

const CookieConsentContext = createContext<CookieConsentContextValue | null>(null)

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<ConsentValue>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === "accepted" || stored === "rejected") setConsent(stored)
    setReady(true)
  }, [])

  const persist = (value: ConsentValue) => {
    setConsent(value)
    if (value) window.localStorage.setItem(STORAGE_KEY, value)
    else window.localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <CookieConsentContext.Provider
      value={{
        consent,
        ready,
        accept: () => persist("accepted"),
        reject: () => persist("rejected"),
        reset: () => persist(null),
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  )
}

export function useCookieConsent() {
  const ctx = useContext(CookieConsentContext)
  if (!ctx) throw new Error("useCookieConsent debe usarse dentro de <CookieConsentProvider>")
  return ctx
}
