import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import { ArrowDown, Cpu, Braces, Sparkles, Github, Linkedin, FileText } from 'lucide-react'
import PixelTransition from './PixelTransition.jsx'

const ROLES = ['Aspiring AI Engineer', 'RAG & LLM Builder', 'Computer Engineer']

function useCycler(words, interval = 10000) {
  const [index, setIndex] = useState(0)
  const [text, setText] = useState(words[0])
  useEffect(() => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%'
    const target = words[index]
    let frame = 0
    const scramble = setInterval(() => {
      frame += 1
      const resolved = Math.floor(frame / 2.5)
      setText(target.split('').map((letter, position) => position < resolved ? letter : letter === ' ' ? ' ' : alphabet[Math.floor(Math.random() * alphabet.length)]).join(''))
      if (resolved >= target.length) clearInterval(scramble)
    }, 45)
    return () => clearInterval(scramble)
  }, [index, words])
  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % words.length), interval)
    return () => clearInterval(timer)
  }, [interval, words.length])
  return text
}

function FloatIcon({ Icon, top, left, delay, color }) {
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 60, damping: 12 })
  const sy = useSpring(my, { stiffness: 60, damping: 12 })

  useEffect(() => {
    const onMove = (e) => {
      const dx = (e.clientX / window.innerWidth - 0.5) * 24
      const dy = (e.clientY / window.innerHeight - 0.5) * 24
      mx.set(dx)
      my.set(dy)
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [mx, my])

  return (
    <motion.div
      className="hero-float-icon"
      style={{ top, left, x: sx, y: sy, color }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1, rotate: [0, -6, 6, 0] }}
      transition={{ delay, duration: 1, rotate: { repeat: Infinity, duration: 6, ease: 'easeInOut' } }}
    >
      <Icon size={28} strokeWidth={1.75} />
    </motion.div>
  )
}

export default function Hero() {
  const role = useCycler(ROLES)
  const [cueFaded, setCueFaded] = useState(false)

  useEffect(() => {
    const onScroll = () => setCueFaded(window.scrollY > window.innerHeight * 0.6)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section id="hero" className="hero">

      <FloatIcon Icon={Cpu} top="15%" left="7%" delay={0.2} color="var(--violet)" />
      <FloatIcon Icon={Braces} top="78%" left="6%" delay={0.4} color="var(--coral)" />
      <FloatIcon Icon={Sparkles} top="20%" left="90%" delay={0.6} color="var(--sky)" />

      <div className="container hero-layout">
      <div className="hero-inner">
        <motion.p
          className="eyebrow"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Open to AI engineering &amp; software development roles
        </motion.p>

        <motion.h1
          className="hero-title"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Hi, I'm <span className="hero-title-accent">Brian Ooi</span>.
          <br />
          I build things that <span className="hero-title-underline">learn</span> and{' '}
          <span className="hero-title-underline">help</span>.
        </motion.h1>

        <motion.div
          className="hero-role"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <span className="hero-role-prefix">/&gt;</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={role}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
            >
              {role}
            </motion.span>
          </AnimatePresence>
        </motion.div>

        <motion.p
          className="hero-sub"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          UTeM Computer Engineering graduate with a 3.95 CGPA, turning AI research and
          full-stack engineering into practical, human-centred software.
        </motion.p>

        <motion.div
          className="hero-actions"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <a href="#projects" className="btn btn-primary">
            See my work
          </a>
          <a href="/Resume.pdf" className="btn btn-ghost" target="_blank" rel="noreferrer">
            <FileText size={18} /> Resume
          </a>
          <div className="hero-socials">
            <a href="https://github.com/Brianlov" aria-label="GitHub" target="_blank" rel="noreferrer">
              <Github size={20} />
            </a>
            <a href="https://www.linkedin.com/in/brian-ooi-0543a133a" aria-label="LinkedIn" target="_blank" rel="noreferrer">
              <Linkedin size={20} />
            </a>
          </div>
        </motion.div>
      </div>
      <PixelTransition
        className="hero-pixel-card"
        aspectRatio="120%"
        gridSize={12}
        pixelColor="var(--violet)"
        animationStepDuration={0.5}
        firstContent={
          <img
            src="/brianface1.jpeg"
            alt="Brian Ooi"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
          />
        }
        secondContent={
          <img
            src="/brianface.jpg"
            alt="Brian Ooi"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
          />
        }
      />
      </div>

      <motion.a
        href="#about"
        className="hero-scroll-cue"
        animate={{ y: [0, 8, 0], opacity: cueFaded ? 0 : 1 }}
        transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut', opacity: { duration: 0.4, repeat: 0 } }}
        aria-label="Scroll to About section"
        style={{ pointerEvents: cueFaded ? 'none' : 'auto' }}
      >
        <ArrowDown size={20} />
      </motion.a>
    </section>
  )
}
