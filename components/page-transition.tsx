"use client"

import { motion, AnimatePresence, type Variants } from "framer-motion"
import { usePathname } from "next/navigation"
import { type ReactNode } from "react"

interface PageTransitionProps {
  children: ReactNode
}

const pageVariants: Variants = {
  initial: {
    opacity: 0,
  },
  enter: {
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.15,
      ease: "easeOut",
    },
  },
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial="initial"
        animate="enter"
        exit="exit"
        variants={pageVariants}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
