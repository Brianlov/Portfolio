import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'

const NODES = [
  { id: 'hero', label: 'Start' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Build' },
  { id: 'skills', label: 'Stack' },
  { id: 'contact', label: 'Connect' },
]

export default function CircuitRail() {
  const [activeId, setActiveId] = useState('hero')
  const { scrollYProgress } = useScroll()
  const lineHeight = useSpring(scrollYProgress, { stiffness: 90, damping: 24 })

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        })
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    )
    NODES.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <nav className="circuit-rail" aria-label="Page sections">
      <div className="circuit-rail-track">
        <motion.div
          className="circuit-rail-fill"
          style={{ scaleY: lineHeight }}
        />
        {NODES.map((node, i) => (
          <a
            key={node.id}
            href={`#${node.id}`}
            className={`circuit-node ${activeId === node.id ? 'is-active' : ''}`}
            style={{ top: `${(i / (NODES.length - 1)) * 100}%` }}
            aria-current={activeId === node.id ? 'location' : undefined}
          >
            <span className="circuit-dot" />
            <span className="circuit-label">{node.label}</span>
          </a>
        ))}
      </div>
    </nav>
  )
}
