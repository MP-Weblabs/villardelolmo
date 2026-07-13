import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Evita open redirects: solo permite rutas internas relativas (empiezan por
// "/" pero no por "//" ni "/\", que los navegadores tratan como absolutas).
export function sanitizeInternalPath(path: string | null, fallback: string): string {
  if (!path) return fallback
  if (!path.startsWith('/')) return fallback
  if (path.startsWith('//') || path.startsWith('/\\')) return fallback
  return path
}
