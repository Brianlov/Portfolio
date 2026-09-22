import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const LINKS = [
  { id: 'about',    label: 'About'    },
  { id: 'projects', label: 'Projects' },
  { id: 'skills',   label: 'Stack'    },
  { id: 'contact',  label: 'Contact'  },
]

export default function Navbar() {
  const [open,     setOpen]     = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active,   setActive]   = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // active section tracking via IntersectionObserver
  useEffect(() => {
    const ids = ['hero', ...LINKS.map((l) => l.id)]
    const observers = ids.map((id) => {
      const el = document.getElementById(id)
      if (!el) return null
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id) },
        { rootMargin: '-40% 0px -50% 0px', threshold: 0 },
      )
      obs.observe(el)
      return obs
    })
    return () => observers.forEach((o) => o?.disconnect())
  }, [])

  return (
    <header className={`navbar ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="container navbar-inner">
        <a href="#hero" className="navbar-logo">
          BO<span className="navbar-logo-dot">.</span>
        </a>

        <nav className="navbar-links">
          {LINKS.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className={active === l.id ? 'is-active' : ''}
            >
              {l.label}
            </a>
          ))}
          <a href="#contact" className="btn btn-primary navbar-cta">Let's talk</a>
        </nav>

        <button
          className="navbar-toggle"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={open ? 'close' : 'open'}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0,   opacity: 1 }}
              exit={{    rotate: 90,  opacity: 0 }}
              transition={{ duration: 0.18 }}
              style={{ display: 'flex' }}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="navbar-mobile"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{    opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            {LINKS.map((l) => (
              <a key={l.id} href={`#${l.id}`} onClick={() => setOpen(false)}>
                {l.label}
              </a>
            ))}
            <a href="#contact" className="btn btn-primary" onClick={() => setOpen(false)}>
              Let's talk
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
