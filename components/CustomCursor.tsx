'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

/**
 * CustomCursor — a premium dual-layer cursor:
 *  • Small dot: snaps to pointer instantly
 *  • Outer ring: follows with spring physics (laggy, magnetic feel)
 *  • Interactive state: ring expands + turns mint on links/buttons
 *  • Hidden on touch devices (pointer: coarse)
 */
export default function CustomCursor() {
  const [visible, setVisible]     = useState(false)
  const [clicking, setClicking]   = useState(false)
  const [hovering, setHovering]   = useState(false)
  const [isTouch,  setIsTouch]    = useState(false)

  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)

  // Spring config for the lagging ring
  const springCfg = { damping: 28, stiffness: 280, mass: 0.6 }
  const ringX = useSpring(mouseX, springCfg)
  const ringY = useSpring(mouseY, springCfg)

  const isTouchDevice = useRef(false)

  useEffect(() => {
    // Detect touch-only devices and bail out
    if (window.matchMedia('(pointer: coarse)').matches) {
      isTouchDevice.current = true
      setIsTouch(true)
      return
    }

    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
      if (!visible) setVisible(true)
    }

    const onEnter = () => setVisible(true)
    const onLeave = () => setVisible(false)
    const onDown  = () => setClicking(true)
    const onUp    = () => setClicking(false)

    // Track hover on interactive elements
    const onHoverStart = (e: MouseEvent) => {
      const el = e.target as HTMLElement
      if (el.closest('a, button, [role="button"], input, textarea, select, label')) {
        setHovering(true)
      }
    }
    const onHoverEnd = (e: MouseEvent) => {
      const el = e.target as HTMLElement
      if (!el.closest('a, button, [role="button"], input, textarea, select, label')) {
        setHovering(false)
      }
    }

    window.addEventListener('mousemove',  onMove,      { passive: true })
    window.addEventListener('mouseenter', onEnter)
    window.addEventListener('mouseleave', onLeave)
    window.addEventListener('mousedown',  onDown)
    window.addEventListener('mouseup',    onUp)
    document.addEventListener('mouseover',  onHoverStart, { passive: true })
    document.addEventListener('mouseout',   onHoverEnd,   { passive: true })

    return () => {
      window.removeEventListener('mousemove',  onMove)
      window.removeEventListener('mouseenter', onEnter)
      window.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('mousedown',  onDown)
      window.removeEventListener('mouseup',    onUp)
      document.removeEventListener('mouseover',  onHoverStart)
      document.removeEventListener('mouseout',   onHoverEnd)
    }
  }, [mouseX, mouseY, visible])

  if (isTouch) return null

  const ringSize  = hovering ? 56 : clicking ? 20 : 40
  const dotSize   = clicking ? 4 : 8
  const ringColor = hovering ? 'rgba(93,202,165,0.7)' : 'rgba(93,202,165,0.35)'
  const ringBg    = hovering ? 'rgba(93,202,165,0.08)' : 'transparent'

  return (
    <>
      {/* Outer ring — spring-lagged */}
      <motion.div
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 9999,
          pointerEvents: 'none',
          width: ringSize,
          height: ringSize,
          borderRadius: '50%',
          border: `1.5px solid ${ringColor}`,
          background: ringBg,
          opacity: visible ? 1 : 0,
          transition: 'width 0.25s ease, height 0.25s ease, border-color 0.25s ease, background 0.25s ease, opacity 0.3s ease',
        }}
      />

      {/* Inner dot — instant */}
      <motion.div
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 10000,
          pointerEvents: 'none',
          width: dotSize,
          height: dotSize,
          borderRadius: '50%',
          background: hovering ? '#5DCAA5' : '#fff',
          opacity: visible ? 1 : 0,
          transition: 'width 0.15s ease, height 0.15s ease, background 0.15s ease, opacity 0.3s ease',
          boxShadow: hovering ? '0 0 12px rgba(93,202,165,0.8)' : '0 0 6px rgba(255,255,255,0.4)',
        }}
      />
    </>
  )
}
