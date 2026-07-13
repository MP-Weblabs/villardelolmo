import type { ReactNode } from "react"

export function LegalSection({
  number,
  title,
  children,
}: {
  number: string
  title: string
  children: ReactNode
}) {
  return (
    <section className="mb-10">
      <h2 className="flex items-baseline gap-3 text-xl md:text-2xl font-bold text-foreground tracking-tight mb-4">
        <span className="text-primary">{number}.</span>
        {title}
      </h2>
      <div className="space-y-4 text-muted-foreground leading-relaxed">{children}</div>
    </section>
  )
}

export function Pendiente({ children }: { children: ReactNode }) {
  return (
    <p className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg px-4 py-3 text-sm">
      <span className="font-semibold">Pendiente de completar.</span> {children}
    </p>
  )
}
