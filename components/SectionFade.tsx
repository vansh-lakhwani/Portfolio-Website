'use client'
import { ReactNode } from 'react'
import { motion } from 'framer-motion'

/** Wraps any section in a Framer Motion fade-up entrance animation. */
export default function SectionFade({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px', amount: 0.08 }}
      transition={{ duration: 0.65, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  )
}
