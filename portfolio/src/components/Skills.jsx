import { motion } from 'framer-motion'

const GROUPS = [
  {
    label: 'Languages',
    items: ['Python', 'JavaScript', 'C / C++', 'Java', 'HTML / CSS'],
  },
  {
    label: 'Web & Full-Stack',
    items: ['React', 'Node.js', 'Express.js', 'REST APIs', 'Vite'],
  },
  {
    label: 'AI / ML',
    items: ['RAG Development', 'Llama 2 Fine-tuning', 'LoRA Adapters', 'Machine Learning', 'Hugging Face'],
  },
  {
    label: 'Tools & Infra',
    items: ['Git / GitHub', 'Wireshark', 'STM32', 'ESP8266', 'ThingSpeak'],
  },
]

const chipVariants = {
  hidden: { opacity: 0, y: 8 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] } },
}

export default function Skills() {
  return (
    <section id="skills">
      <div className="container">
        <motion.p
          className="eyebrow"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="section-num">03 —</span>Toolbox
        </motion.p>
        <motion.h2
          className="section-heading"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          What I work with
        </motion.h2>
        <motion.p
          className="section-sub"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.18 }}
        >
          Not an exhaustive list — just what I reach for most when building.
        </motion.p>

        <div className="skills-grid">
          {GROUPS.map((group, gi) => (
            <motion.div
              key={group.label}
              className="skills-group"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: gi * 0.1 }}
            >
              <h3 className="skills-group-title">{group.label}</h3>
              <motion.div
                className="skills-chips"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                variants={{ show: { transition: { staggerChildren: 0.06 } } }}
              >
                {group.items.map((item) => (
                  <motion.span
                    key={item}
                    className="skill-chip"
                    variants={chipVariants}
                    whileHover={{
                      y: -3,
                      scale: 1.04,
                      transition: { type: 'spring', stiffness: 380, damping: 18 },
                    }}
                  >
                    {item}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
