import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import CircuitRail from './components/CircuitRail.jsx'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import Projects from './components/Projects.jsx'
import Skills from './components/Skills.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'
import ClickSpark from './components/ClickSpark.jsx'
import ShapeGrid from './components/ShapeGrid.jsx'
import RAGPage from './pages/RAGPage.jsx'

function PortfolioHome() {
  return (
    <ClickSpark sparkCount={8} sparkSize={10} sparkRadius={15} duration={400}>
      <div className="shapegrid-bg" aria-hidden="true">
        <ShapeGrid
          speed={0.3}
          squareSize={44}
          direction="diagonal"
          borderColor="rgba(124, 92, 252, 0.12)"
          hoverFillColor="rgba(124, 92, 252, 0.18)"
          shape="square"
          hoverTrailAmount={5}
          useGlobalMouse={true}
        />
      </div>
      <Navbar />
      <CircuitRail />
      <main>
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </ClickSpark>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PortfolioHome />} />
        <Route path="/rag" element={<RAGPage />} />
      </Routes>
    </BrowserRouter>
  )
}
