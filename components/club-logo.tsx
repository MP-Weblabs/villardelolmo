import { cn } from "@/lib/utils"
import Image from "next/image"

interface ClubLogoProps {
  className?: string
  variant?: "default" | "white" | "light"
}

export function ClubLogo({ className, variant = "default" }: ClubLogoProps) {
  return (
    <div className={cn("relative", className)}>
      <Image
        src="/images/escudo.png"
        alt="Escudo C.D. Unión Deportiva Villar del Olmo"
        fill
        className="object-contain"
      />
    </div>
  )
}
