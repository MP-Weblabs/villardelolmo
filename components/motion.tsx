"use client"

import { motion, useInView, useAnimation, type Variants } from "framer-motion"
import { useRef, useEffect, type ReactNode } from "react"

interface FadeInProps {
  children: ReactNode
  delay?: number
  duration?: number
  direction?: "up" | "down" | "left" | "right" | "none"
  className?: string
  once?: boolean
}

export function FadeIn({ 
  children, 
  delay = 0, 
  duration = 0.3,
  direction = "up",
  className = "",
  once = true
}: FadeInProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, margin: "-30px" })
  const controls = useAnimation()

  const directions = {
    up: { y: 20, x: 0 },
    down: { y: -20, x: 0 },
    left: { x: 20, y: 0 },
    right: { x: -20, y: 0 },
    none: { x: 0, y: 0 }
  }

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { 
          opacity: 0,
          ...directions[direction]
        },
        visible: { 
          opacity: 1, 
          x: 0, 
          y: 0,
          transition: {
            duration,
            delay,
            ease: [0.25, 0.1, 0.25, 1]
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface StaggerContainerProps {
  children: ReactNode
  className?: string
  staggerDelay?: number
}

export function StaggerContainer({ 
  children, 
  className = "",
  staggerDelay = 0.05
}: StaggerContainerProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-30px" })

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.05
      }
    }
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ 
  children, 
  className = "" 
}: { 
  children: ReactNode
  className?: string 
}) {
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.25,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  }

  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  )
}

interface ScaleInProps {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
}

export function ScaleIn({ 
  children, 
  className = "",
  delay = 0,
  duration = 0.25
}: ScaleInProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-30px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ 
        duration, 
        delay,
        ease: [0.25, 0.1, 0.25, 1]
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface ScaleOnHoverProps {
  children: ReactNode
  className?: string
  scale?: number
}

export function ScaleOnHover({ 
  children, 
  className = "",
  scale = 1.02
}: ScaleOnHoverProps) {
  return (
    <motion.div
      whileHover={{ scale }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface MagneticButtonProps {
  children: ReactNode
  className?: string
}

export function MagneticButton({ children, className = "" }: MagneticButtonProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function TextReveal({ 
  children, 
  className = "",
  delay = 0
}: { 
  children: string
  className?: string
  delay?: number
}) {
  const words = children.split(" ")
  
  return (
    <motion.span className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.2,
            delay: delay + i * 0.03,
            ease: [0.25, 0.1, 0.25, 1]
          }}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  )
}

interface CountUpProps {
  end: number
  duration?: number
  suffix?: string
  prefix?: string
  className?: string
}

export function CountUp({ 
  end, 
  duration = 2, 
  suffix = "", 
  prefix = "",
  className = ""
}: CountUpProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  
  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
    >
      {isInView && (
        <motion.span
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
        >
          {prefix}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {end}
          </motion.span>
          {suffix}
        </motion.span>
      )}
    </motion.span>
  )
}

export function ParallaxImage({ 
  src, 
  alt,
  className = ""
}: { 
  src: string
  alt: string
  className?: string
}) {
  return (
    <motion.div
      className={`overflow-hidden ${className}`}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.4 }}
    >
      <motion.img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.6 }}
      />
    </motion.div>
  )
}
