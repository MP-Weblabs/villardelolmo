import { ImageOff } from "lucide-react"
import { cn } from "@/lib/utils"

export function ImagePlaceholder({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0 flex items-center justify-center bg-muted", className)}>
      <ImageOff className="h-8 w-8 text-muted-foreground/40" />
    </div>
  )
}
