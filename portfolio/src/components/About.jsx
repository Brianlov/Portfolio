import { motion } from 'framer-motion'
import { GraduationCap, Rocket, Coffee, MapPin } from 'lucide-react'
import EyeTrackingAvatar from './EyeTrackingAvatar.jsx'

const FACTS = [
  { icon: GraduationCap, label: 'B.Eng Computer Engineering, UTeM — CGPA 3.95' },
  { icon: Rocket,        label: 'RAG, LLM fine-tuning & full-stack systems' },
  { icon: Coffee,        label: 'Python, Node.js, Express.js & React' },
  { icon: MapPin,        label: 'Kedah, Malaysia — open to opportunities' },
]

export default function About() {
  return (
    <section id="about">
      <div className="container about-grid">
        <motion.div
          className="about-portrait"
          style={{ rotate: '-3deg' }}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
        >
          <EyeTrackingAvatar />
          <div className="about-portrait-tag">curious by default. rigorous by habit.</div>
        </motion.div>

        <div>
          <motion.p
            className="eyebrow"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-num">01 —</span>About Me
          </motion.p>

          <motion.h2
            className="section-heading"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            The short version
          </motion.h2>

          <motion.p
            className="pull-quote"
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.18, duration: 0.55 }}
          >
            I turn demanding AI research into working software — fast.
          </motion.p>

          <motion.p
            className="about-body"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25 }}
          >
            I'm Brian, a Computer Engineering graduate from UTeM with a 3.95 CGPA and a
            focus on AI engineering. I enjoy taking demanding ideas from research to working
            builds — from RAG chatbots and Llama 2 fine-tuning to IoT monitoring systems.
            I'm seeking an AI research or software development role where careful thinking,
            strong implementation, and real-world impact matter.
          </motion.p>

          <motion.ul
            className="about-facts"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={{ show: { transition: { staggerChildren: 0.08 } } }}
          >
            {FACTS.map(({ icon: Icon, label }) => (
              <motion.li
                key={label}
                variants={{ hidden: { opacity: 0, x: -12 }, show: { opacity: 1, x: 0 } }}
              >
                <Icon size={18} />
                <span>{label}</span>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  )
}
