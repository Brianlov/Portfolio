import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'

// ─── pose definitions ────────────────────────────────────────────────────────
// each pose enters from a different direction for variety
const SLIDE_DIRS = [
  { x: 0,   y: -24 }, // up
  { x: 24,  y: 0   }, // right
  { x: 0,   y: 24  }, // down
  { x: -24, y: 0   }, // left
  { x: 20,  y: -20 }, // top-right diagonal
]

const CYCLE_POSES = [
  {
    id: 'base',
    src: '/BrianAvatorBgRemover.png',
    alt: 'Brian giving a thumbs-up',
    eyes: { L: { x: 38.5, y: 37 }, R: { x: 61.5, y: 37 } },
    label: "Hi, I'm Brian",
  },
  {
    id: 'confident',
    src: '/BrianConfidentBgRemover.png',
    alt: 'Brian looking confident',
    eyes: { L: { x: 37.5, y: 36 }, R: { x: 62, y: 36 } },
    label: 'Lets Go!!!',
  },
  {
    id: 'presenting',
    src: '/BrianPresentingBgRemover.png',
    alt: 'Brian presenting',
    eyes: { L: { x: 37.5, y: 35 }, R: { x: 62, y: 35 } },
    label: 'Check this out',
  },
  {
    id: 'thinking',
    src: '/BrianThinkingBgRemove.png',
    alt: 'Brian thinking',
    eyes: { L: { x: 37, y: 36 }, R: { x: 61.5, y: 36 } },
    label: 'Hmm, how to optimize?',
  },
  {
    id: 'wave',
    src: '/BrianWaveBgRemove.png',
    alt: 'Brian waving',
    eyes: { L: { x: 38, y: 37 }, R: { x: 62, y: 37 } },
    label: 'Nice to meet you!',
  },
]

const SHH_POSE = {
  id: 'shh',
  src: '/BrianShhBgRemove.png',
  alt: 'Brian doing the shh gesture',
  eyes: { L: { x: 37, y: 43 }, R: { x: 62, y: 41 } },
  winking: true,
  label: 'Shh... u found me 🥰',
}

const CYCLE_MS = 8000
const SHH_MS   = 2500

// ─── idle float bob ───────────────────────────────────────────────────────────
const floatVariants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3.2,
      ease: 'easeInOut',
      repeat: Infinity,
      repeatType: 'loop',
    },
  },
}

// ─── component ───────────────────────────────────────────────────────────────
export default function EyeTrackingAvatar() {
  const frameRef = useRef(null)
  const cycleRef = useRef(null)
  const shhRef   = useRef(null)

  const [poseIdx, setPoseIdx] = useState(0)
  const [isShh,   setIsShh]   = useState(false)

  const pose = isShh ? SHH_POSE : CYCLE_POSES[poseIdx]

  // raw gaze values — tracked for future iris overlay
  const rawX  = useMotionValue(0)
  const rawY  = useMotionValue(0)

  // ── hover lean (perspective tilt toward cursor) ───────────────────────────
  const leanX       = useMotionValue(0)
  const leanY       = useMotionValue(0)
  const springLeanX = useSpring(leanX, { stiffness: 80, damping: 18 })
  const springLeanY = useSpring(leanY, { stiffness: 80, damping: 18 })

  const handleMouseMove = useCallback((e) => {
    const box = e.currentTarget.getBoundingClientRect()
    const nx = (e.clientX - box.left) / box.width  - 0.5
    const ny = (e.clientY - box.top)  / box.height - 0.5
    leanX.set(ny * -10)
    leanY.set(nx *  10)
  }, [leanX, leanY])

  const handleMouseLeave = useCallback(() => {
    leanX.set(0)
    leanY.set(0)
  }, [leanX, leanY])

  // ── eye tracking (raw values, feed into gazeX/gazeY for future iris) ──────
  useEffect(() => {
    const onMove = (e) => {
      const box = frameRef.current?.getBoundingClientRect()
      if (!box) return
      const cx      = box.left + box.width  / 2
      const cy      = box.top  + box.height * (pose.eyes.L.y / 100)
      const angle   = Math.atan2(e.clientY - cy, e.clientX - cx)
      const clamped = Math.min(4.5, Math.hypot(e.clientX - cx, e.clientY - cy) / 85)
      rawX.set(Math.cos(angle) * clamped)
      rawY.set(Math.sin(angle) * clamped)
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [pose.eyes.L.y, rawX, rawY])

  // ── auto-cycle (skip when shh is active) ─────────────────────────────────
  useEffect(() => {
    if (isShh) return
    cycleRef.current = setInterval(() => {
      setPoseIdx((i) => (i + 1) % CYCLE_POSES.length)
    }, CYCLE_MS)
    return () => clearInterval(cycleRef.current)
  }, [isShh])

  // ── click → shh, auto-revert ──────────────────────────────────────────────
  const handleClick = useCallback(() => {
    if (isShh) return
    clearInterval(cycleRef.current)
    clearTimeout(shhRef.current)
    setIsShh(true)
    shhRef.current = setTimeout(() => setIsShh(false), SHH_MS)
  }, [isShh])

  // cleanup on unmount
  useEffect(
    () => () => {
      clearInterval(cycleRef.current)
      clearTimeout(shhRef.current)
    },
    [],
  )

  // slide direction for the current pose index
  const slideDir = isShh ? { x: 0, y: 0 } : SLIDE_DIRS[poseIdx % SLIDE_DIRS.length]

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <motion.div
      className="avatar"
      role="img"
      aria-label="Brian's illustrated avatar — click to see a secret!"
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        cursor: isShh ? 'default' : 'pointer',
        perspective: 600,
        rotateX: springLeanX,
        rotateY: springLeanY,
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.65, delay: 0.25 }}
    >
      {/* continuous float bob */}
      <motion.div variants={floatVariants} animate="animate">
        {/* photo frame */}
        <div ref={frameRef} className="avatar-photo">
          {/* directional slide + crossfade on pose change */}
          <AnimatePresence mode="wait">
            <motion.img
              key={pose.id}
              src={pose.src}
              alt={pose.alt}
              draggable={false}
              initial={{ opacity: 0, x: slideDir.x, y: slideDir.y, scale: 0.95 }}
              animate={{ opacity: 1, x: 0,           y: 0,           scale: 1    }}
              exit={{    opacity: 0, x: -slideDir.x, y: -slideDir.y, scale: 1.03 }}
              transition={{ duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] }}
            />
          </AnimatePresence>
        </div>
      </motion.div>

      {/* badge label */}
      <AnimatePresence mode="wait">
        <motion.span
          key={pose.id}
          className="avatar-label"
          initial={{ opacity: 0, y: 5,  scale: 0.88 }}
          animate={{ opacity: 1, y: 0,  scale: 1    }}
          exit={{    opacity: 0, y: -5, scale: 0.88  }}
          transition={{ duration: 0.18 }}
        >
          {pose.label}
        </motion.span>
      </AnimatePresence>
    </motion.div>
  )
}
