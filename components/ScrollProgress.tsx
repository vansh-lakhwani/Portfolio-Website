'use client'
import { useEffect } from 'react'
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion'

/**
 * ScrollProgress — a thin 2px bar at the very top of the viewport.
 * Fills from 0% → 100% as the user scrolls. Mint → purple gradient.
 */
export default function ScrollProgress() {
  const scrollPct = useMotionValue(0)
  const smooth    = useSpring(scrollPct, { damping: 30, stiffness: 200, mass: 0.5 })
  const scaleX    = useTransform(smooth, [0, 100], [0, 1])

  useEffect(() => {
    const update = () => {
      const top    = window.scrollY
      const height = document.documentElement.scrollHeight - window.innerHeight
      scrollPct.set(height > 0 ? (top / height) * 100 : 0)
    }
    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [scrollPct])

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[60] h-[2px] pointer-events-none"
      aria-hidden="true"
    >
      <motion.div
        style={{
          scaleX,
          originX: 0,
          height: '100%',
          background: 'linear-gradient(90deg, #5DCAA5 0%, #7F77DD 100%)',
          boxShadow: '0 0 8px rgba(93,202,165,0.6)',
        }}
      />
    </div>
  )
}
