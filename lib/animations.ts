import type { Variants } from 'framer-motion'

/** Staggered fade-up animation variant factory */
export function fadeUp(delay = 0): Variants {
  return {
    hidden:  { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay, duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
    },
  }
}

/** Shared container variant (stagger children) */
export const staggerContainer: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.1 } },
}

/** Simple fade variant (no y movement) */
export const fadeIn: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
}

/** Generic fade-up item (use inside staggerContainer) */
export const fadeUpItem: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
}
