import { ArrowDown, ArrowLeft, Play, Video } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Carousel from '../components/Carousel.jsx'
import BenchmarkResults from '../components/BenchmarkResults.jsx'
import './RAGPage.css'

const introVideo = {
  title: 'Why do LLMs give different answers?',
  file: 'Copy of Voice AI lied to Me...then I recovered why different LLM give different Answers.....mp4',
  caption: 'Most RAG systems focus on text. This project benchmarks vector and graph RAG architectures across retrieval quality, latency, and robustness to ASR errors.',
}

const results = [
  { title: 'VectorRAG-SQuAD', file: 'Squad_Vector.mp4', type: 'SQuAD evaluation', summary: 'Vector retrieval evaluated on the SQuAD question-answering benchmark.', icon: 'database' },
  { title: 'GraphRAG-SQuAD', file: 'Squad_Graph.mp4', type: 'SQuAD evaluation', summary: 'Graph retrieval evaluated on the SQuAD question-answering benchmark.', icon: 'network' },
  { title: 'VectorRAG-HotpotQA', file: 'squad_hotpotqa.mp4', type: 'HotpotQA evaluation', summary: 'Vector retrieval evaluated on multi-hop HotpotQA questions.', icon: 'database' },
  { title: 'GraphRAG-HotpotQA', file: 'graphragmultihopquestions.mp4', type: 'HotpotQA evaluation', summary: 'Graph retrieval evaluated on multi-hop HotpotQA questions.', icon: 'network' },
]

function DemoVideo({ file, title, priority = false }) {
  return <div className="rag-video-frame">
    <video controls preload={priority ? 'metadata' : 'none'} aria-label={`Play ${title}`}>
      <source src={`/fyp/${encodeURIComponent(file)}`} type="video/mp4" />
      Your browser does not support MP4 video.
    </video>
    <span className="rag-video-badge"><Play size={14} aria-hidden="true" /> Demo recording</span>
  </div>
}

import { useEffect } from 'react'

export default function RAGPage() {
  const navigate = useNavigate()
  
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  return <main className="rag-page">
    <section className="rag-hero">
      <div className="rag-shell">
        <button className="rag-back" onClick={() => navigate(-1)} style={{ marginBottom: '48px' }}>
          <ArrowLeft size={18} aria-hidden="true" /> Back to portfolio
        </button>
        <div className="rag-hero-grid">
          <motion.div className="rag-hero-copy" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <p className="rag-kicker">Voice AI RAG System</p>
            <h1>Every answer needs an evidence trail.</h1>
          <p className="rag-lede">An exploration of why large language models disagree—and how vector and graph retrieval change the evidence behind an answer.</p>
          <div className="rag-hero-meta" aria-label="Project methods"><span>RAG</span><span>LLMs</span><span>Vector search</span><span>Graph RAG</span></div>
          <a className="rag-jump" href="#results">View the results <ArrowDown size={17} aria-hidden="true" /></a>
        </motion.div>
        <motion.div className="rag-feature-demo" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.12 }}>
          <p className="rag-demo-label"><Video size={16} aria-hidden="true" /> Project introduction</p>
          <DemoVideo file={introVideo.file} title={introVideo.title} priority />
          <p className="rag-demo-caption">{introVideo.caption}</p>
        </motion.div>
        </div>
      </div>
    </section>

    <section className="rag-results" id="results">
      <div className="rag-shell">
        <div className="rag-section-head">
          <p className="rag-kicker">Recorded results</p>
          <h2>See the retrieval strategies at work.</h2>
          <p>Four recorded runs show the system moving from multi-hop graph retrieval to SQuAD evaluation across graph, HotpotQA, and vector approaches.</p>
        </div>
        <div style={{ height: '600px', position: 'relative' }}>
          <Carousel items={results} baseWidth={300} autoplay={false} autoplayDelay={3000} pauseOnHover={false} loop={false} round={false} />
        </div>
      </div>
    </section>

    <BenchmarkResults />

    <footer className="rag-footer"><div className="rag-shell">Voice AI RAG System · Brian Ooi</div></footer>
  </main>
}
