import { ChevronLeft, ChevronRight, Database, Network, Play } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import './Carousel.css'

export default function Carousel({ items, baseWidth = 300, autoplay = false, autoplayDelay = 3000, pauseOnHover = false, loop = false, round = false }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const activeItem = items[activeIndex]
  const goTo = (nextIndex) => setActiveIndex(loop ? (nextIndex + items.length) % items.length : Math.max(0, Math.min(nextIndex, items.length - 1)))

  useEffect(() => {
    if (!autoplay || (pauseOnHover && isHovered)) return undefined
    const timer = window.setInterval(() => goTo(activeIndex + 1), autoplayDelay)
    return () => window.clearInterval(timer)
  }, [activeIndex, autoplay, autoplayDelay, isHovered, pauseOnHover])

  const Icon = activeItem.icon === 'network' ? Network : Database
  return <div className={`result-carousel ${round ? 'result-carousel--round' : ''}`} style={{ '--carousel-width': `${baseWidth}px` }} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
    <button className="carousel-arrow" onClick={() => goTo(activeIndex - 1)} disabled={!loop && activeIndex === 0} aria-label="Show previous result"><ChevronLeft size={21} /></button>
    <div className="carousel-viewport" aria-live="polite"><AnimatePresence mode="wait" initial={false}>
      <motion.article className="carousel-slide" key={activeItem.file} initial={{ opacity: 0, x: 34 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -34 }} transition={{ duration: 0.28, ease: 'easeOut' }}>
        <div className="carousel-slide-heading"><div className="carousel-icon"><Icon size={20} aria-hidden="true" /></div><div><p>{activeItem.type}</p><h3>{activeItem.title}</h3></div></div>
        <div className="carousel-video-frame"><video controls preload="metadata" aria-label={`Play ${activeItem.title}`}><source src={`/fyp/${encodeURIComponent(activeItem.file)}`} type="video/mp4" />Your browser does not support MP4 video.</video><span><Play size={14} aria-hidden="true" /> Demo recording</span></div>
        <p className="carousel-summary">{activeItem.summary}</p>
      </motion.article>
    </AnimatePresence></div>
    <button className="carousel-arrow" onClick={() => goTo(activeIndex + 1)} disabled={!loop && activeIndex === items.length - 1} aria-label="Show next result"><ChevronRight size={21} /></button>
    <div className="carousel-pagination" aria-label="Select a result">{items.map((item, index) => <button key={item.file} className={index === activeIndex ? 'is-active' : ''} onClick={() => goTo(index)} aria-label={`Show ${item.title}`} aria-current={index === activeIndex ? 'true' : undefined}>{index + 1}</button>)}</div>
  </div>
}
