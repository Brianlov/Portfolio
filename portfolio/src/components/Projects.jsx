import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ArrowUpRight, Github } from 'lucide-react'

const PROJECTS = [
  {
    title: 'Voice Agent RAG Systems',
    blurb: 'A voice-agent research build comparing Vector RAG and Graph RAG architectures through targeted benchmarking. Designed to surface where semantic similarity breaks down across multi-hop reasoning chains.',
    tags: ['Python', 'RAG', 'LLMs', 'Voice AI'],
    color: 'var(--violet)',
    kind: 'AI Research',
    github: 'https://github.com/Brianlov/VoiceAgent',
    live: null,
    featured: true,
    ragPage: true,
  },
  {
    title: 'React Movie App',
    blurb: 'A responsive movie discovery application built to make browsing films feel fast, visual, and effortless.',
    tags: ['React', 'JavaScript', 'REST API'],
    color: 'var(--coral)',
    kind: 'Web App',
    github: 'https://github.com/Brianlov/React-Movie-App',
    live: null,
  },
  {
    title: 'Generative Medical Imaging Augmentation',
    blurb: 'CVPR-focused exploration of generative approaches for medical image augmentation and stronger training data.',
    tags: ['Python', 'Computer Vision', 'Generative AI'],
    color: 'var(--sky)',
    kind: 'Computer Vision',
    github: 'https://github.com/Brianlov/CVPRFinalVersion',
    live: 'https://cvprguiii.vercel.app/',
  },
  {
    title: 'Water Quality Monitoring System',
    blurb: 'An IoT water-monitoring dashboard integrating sensor data, real-time visualisation, and Telegram alerts.',
    tags: ['React', 'Express', 'STM32', 'ESP8266'],
    color: 'var(--lime)',
    kind: 'IoT / Full-Stack',
    github: 'https://github.com/Brianlov/Water-Quality-System-FrontEnd',
    live: null,
  },
  {
    title: 'Infosec Dungeon Survival',
    blurb: 'A retro hacker-themed terminal dungeon survival game. Features real-time combat, authentication, and inventory management.',
    tags: ['React', 'Node.js', 'Express', 'MongoDB'],
    color: 'var(--emerald)',
    kind: 'Full-Stack Game',
    github: 'https://github.com/Brianlov/InfosecDgnSurvival.git',
    live: 'https://frontend-theta-bay-86.vercel.app/',
  },
]

function ProjectCard({ project, index }) {
  const ref = useRef(null)
  const navigate = useNavigate()
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 20 })
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 20 })

  const handleMove = (e) => {
    const rect = ref.current.getBoundingClientRect()
    mx.set((e.clientX - rect.left) / rect.width - 0.5)
    my.set((e.clientY - rect.top) / rect.height - 0.5)
  }
  const handleLeave = () => { mx.set(0); my.set(0) }

  const isFeatured = project.featured === true

  // featured card: only tilt on the right column (content side)
  const cardStyle = isFeatured
    ? { '--accent': project.color, willChange: 'transform' }
    : { rotateX: rotX, rotateY: rotY, '--accent': project.color, willChange: 'transform' }

  return (
    <motion.article
      ref={ref}
      className={`project-card${isFeatured ? ' project-card--feature' : ''}`}
      style={cardStyle}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      {isFeatured ? (
        /* ── featured two-column layout ── */
        <>
          <div className="project-card-feature-left">
            <div className="project-card-top">
              <span className="tag">{project.kind}</span>
              <div className="project-card-links">
                <a
                  href={project.github}
                  aria-label={`View ${project.title} source code`}
                  className="project-icon-link"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Github size={18} />
                </a>
                {project.ragPage && (
                  <button
                    aria-label={`Open ${project.title} interactive demo`}
                    className="project-icon-link project-icon-link--rag"
                    onClick={() => navigate('/rag')}
                    title="View interactive demo"
                  >
                    <ArrowUpRight size={18} />
                  </button>
                )}
                {project.live && (
                  <a
                    href={project.live}
                    aria-label={`Open ${project.title} live demo`}
                    className="project-icon-link"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <ArrowUpRight size={18} />
                  </a>
                )}
              </div>
            </div>
            <h3 className="project-card-title">{project.title}</h3>
            <div className="project-card-tags">
              {project.tags.map((t) => (
                <span key={t} className="project-chip">{t}</span>
              ))}
            </div>
          </div>
          <div className="project-card-feature-right">
            <p className="project-card-blurb">{project.blurb}</p>
          </div>
        </>
      ) : (
        /* ── standard card layout ── */
        <>
          <div className="project-card-top">
            <span className="tag">{project.kind}</span>
            <div className="project-card-links">
              <a
                href={project.github}
                aria-label={`View ${project.title} source code`}
                className="project-icon-link"
                target="_blank"
                rel="noreferrer"
              >
                <Github size={18} />
              </a>
              {project.live && (
                <a
                  href={project.live}
                  aria-label={`Open ${project.title} live demo`}
                  className="project-icon-link"
                  target="_blank"
                  rel="noreferrer"
                >
                  <ArrowUpRight size={18} />
                </a>
              )}
            </div>
          </div>
          <h3 className="project-card-title">{project.title}</h3>
          <p className="project-card-blurb">{project.blurb}</p>
          <div className="project-card-tags">
            {project.tags.map((t) => (
              <span key={t} className="project-chip">{t}</span>
            ))}
          </div>
        </>
      )}
    </motion.article>
  )
}

export default function Projects() {
  return (
    <section id="projects" className="section-alt">
      <div className="container">
        <motion.p
          className="eyebrow"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="section-num">02 —</span>Selected Work
        </motion.p>
        <motion.h2
          className="section-heading"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          Things I've built
        </motion.h2>
        <motion.p
          className="section-sub"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.18 }}
        >
          AI research, intelligent interfaces, and connected systems — from idea to implementation.
        </motion.p>

        <div className="project-grid">
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.title} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
