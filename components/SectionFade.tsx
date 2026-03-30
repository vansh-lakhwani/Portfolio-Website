'use client'
import { ReactNode } from 'react'
import { motion } from 'framer-motion'

/** Wraps any section in a Framer Motion fade-up entrance animation. */
export default function SectionFade({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
