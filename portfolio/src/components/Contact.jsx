import { motion } from 'framer-motion'
import { Mail, Github, Linkedin, ArrowUpRight } from 'lucide-react'

export default function Contact() {
  return (
    <section id="contact" className="section-alt">
      <div className="container contact-inner">
        <motion.p
          className="eyebrow"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="section-num">04 —</span>Get in touch
        </motion.p>

        <motion.h2
          className="contact-heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          Let's build something
          <br />
          worth <span className="hero-title-underline">talking about</span>.
        </motion.h2>

        <motion.p
          className="section-sub section-sub--spaced"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          I'm actively looking for AI engineering, AI research, and software development opportunities.
          If you're building something meaningful, I'd love to hear about it.
        </motion.p>

        <motion.a
          href="mailto:Brianooi1109@gmail.com"
          className="contact-email"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          whileHover={{
            x: -3,
            y: -3,
            boxShadow: '4px 4px 0 var(--lime)',
            transition: { type: 'spring', stiffness: 380, damping: 18 },
          }}
        >
          <Mail size={22} />
          Brianooi1109@gmail.com
          <ArrowUpRight size={18} />
        </motion.a>

        <motion.div
          className="contact-socials"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <a href="https://github.com/Brianlov" target="_blank" rel="noreferrer" className="btn btn-ghost">
            <Github size={18} /> GitHub
          </a>
          <a href="https://www.linkedin.com/in/ooi-brian-0543a133a" target="_blank" rel="noreferrer" className="btn btn-ghost">
            <Linkedin size={18} /> LinkedIn
          </a>
        </motion.div>
      </div>
    </section>
  )
}
