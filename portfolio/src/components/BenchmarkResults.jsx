import { useRef, useEffect, useState } from 'react'
import './BenchmarkResults.css'

/* ─── data ──────────────────────────────────────────────────────────── */
const AXES = ['Answer\nRelevancy', 'Faithfulness', 'Context\nPrecision', 'Context\nRecall', 'Answer\nCorrectness']

const RADAR = {
  squad: {
    vector: [0.8072, 0.9650, 0.8133, 0.9500, 0.7242],
    graph:  [0.6175, 0.7450, 0.5224, 0.6400, 0.4787],
  },
  hotpot: {
    vector: [0.6309, 0.6717, 0.8133, 0.4469, 0.5077],
    graph:  [0.6620, 0.7850, 0.5224, 0.4819, 0.5928],
  },
}

const LATENCY = [
  { label: 'VectorRAG', squad: 1.19, hotpot: 3.27, kind: 'vector' },
  { label: 'GraphRAG',  squad: 1.98, hotpot: 7.83, kind: 'graph'  },
]

const PER_QUERY_SQUAD_V = [0.4, 2.5, 0.2, 1.2, 0.8, 3.1, 0.2, 0.3, 2.2, 1.0, 1.5, 0.8, 0.9, 0.4, 1.1, 0.8, 1.1, 3.5, 0.5, 1.0]
const PER_QUERY_SQUAD_G = [5.7, 1.9, 1.8, 0.5, 0.4, 1.6, 3.3, 1.1, 2.2, 2.0, 9.2, 1.5, 1.2, 1.1, 1.3, 1.1, 1.1, 0.8, 0.8, 0.9]
const PER_QUERY_HOTPOT_V = [1.2, 3.3, 5.5, 2.8, 1.0, 3.6, 3.0, 3.9, 0.9, 2.1, 12.8, 5.2, 4.1, 2.8, 1.0, 4.3, 4.9, 0.9, 0.9, 0.8]
const PER_QUERY_HOTPOT_G = [11.1, 11.2, 9.5, 6.3, 9.8, 2.8, 6.1, 4.9, 4.3, 5.7, 18.2, 9.0, 8.2, 11.1, 5.4, 4.3, 6.3, 7.8, 7.6, 7.0]

const ASR = { vector: 24.8, graph: 30.6 }

/* ─── pentagon math ─────────────────────────────────────────────────── */
const TWO_PI = Math.PI * 2
const N      = 5

function pentaPoint(angle, r, cx, cy) {
  return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)]
}

function polarPath(values, maxR, cx, cy) {
  const pts = values.map((v, i) => {
    const angle = (TWO_PI / N) * i - Math.PI / 2
    return pentaPoint(angle, v * maxR, cx, cy)
  })
  return pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(' ') + 'Z'
}

/* ─── RadarChart ────────────────────────────────────────────────────── */
function RadarChart({ dataset, vectorVals, graphVals, animated }) {
  const SIZE   = 280
  const CX     = SIZE / 2
  const CY     = SIZE / 2
  const MAX_R  = SIZE * 0.36
  const RINGS  = [0.25, 0.5, 0.75, 1.0]
  const LABEL_R = MAX_R + 34

  const axisAngles = Array.from({ length: N }, (_, i) => (TWO_PI / N) * i - Math.PI / 2)

  // Build ring paths
  const ringPaths = RINGS.map(r =>
    polarPath(Array(N).fill(r), MAX_R, CX, CY)
  )

  const vPath = polarPath(vectorVals, MAX_R, CX, CY)
  const gPath = polarPath(graphVals, MAX_R, CX, CY)

  return (
    <figure className="radar-figure">
      <figcaption className="radar-caption">
        <span className="benchmark-overline">{dataset}</span>
      </figcaption>

      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="radar-svg"
        role="img"
        aria-label={`Pentagon radar chart for ${dataset}`}
      >
        {/* rings */}
        {ringPaths.map((d, i) => (
          <path key={i} d={d} fill="none" stroke="var(--line)" strokeWidth="1" />
        ))}

        {/* axis spokes */}
        {axisAngles.map((a, i) => {
          const [x, y] = pentaPoint(a, MAX_R, CX, CY)
          return <line key={i} x1={CX} y1={CY} x2={x} y2={y} stroke="var(--line)" strokeWidth="1" />
        })}

        {/* ring labels */}
        {RINGS.map((r, i) => {
          const [x, y] = pentaPoint(-Math.PI / 2 + 0.08, r * MAX_R, CX, CY)
          return (
            <text key={i} x={x} y={y} fontSize="7" fill="var(--ink-faint)" fontFamily="var(--font-mono)" textAnchor="middle">
              {r}
            </text>
          )
        })}

        {/* GraphRAG fill */}
        <path
          d={gPath}
          fill="var(--coral)"
          fillOpacity="0.15"
          stroke="var(--coral)"
          strokeWidth="1.8"
          strokeLinejoin="round"
          className="radar-area"
        />

        {/* VectorRAG fill */}
        <path
          d={vPath}
          fill="var(--violet)"
          fillOpacity="0.18"
          stroke="var(--violet)"
          strokeWidth="2"
          strokeLinejoin="round"
          className="radar-area"
        />

        {/* dots on vertices */}
        {axisAngles.map((a, i) => {
          const vr = vectorVals[i] * MAX_R
          const gr = graphVals[i] * MAX_R
          const [vx, vy] = pentaPoint(a, vr, CX, CY)
          const [gx, gy] = pentaPoint(a, gr, CX, CY)
          return (
            <g key={i}>
              <circle cx={gx} cy={gy} r="3" fill="var(--coral)" />
              <circle cx={vx} cy={vy} r="3.5" fill="var(--violet)" />
            </g>
          )
        })}

        {/* axis labels */}
        {axisAngles.map((a, i) => {
          const [lx, ly] = pentaPoint(a, LABEL_R, CX, CY)
          const parts = AXES[i].split('\n')
          const anchor = lx < CX - 4 ? 'end' : lx > CX + 4 ? 'start' : 'middle'
          return (
            <text
              key={i}
              x={lx}
              y={ly - (parts.length - 1) * 5}
              fontSize="8.5"
              fill="var(--ink-soft)"
              fontFamily="var(--font-mono)"
              textAnchor={anchor}
            >
              {parts.map((p, j) => (
                <tspan key={j} x={lx} dy={j === 0 ? 0 : 11}>{p}</tspan>
              ))}
            </text>
          )
        })}
      </svg>

      {/* score table under chart */}
      <div className="radar-table-wrap">
        <table className="radar-score-table">
          <thead>
            <tr>
              <th></th>
              {AXES.map((a, i) => <th key={i}>{a.replace('\n', ' ')}</th>)}
            </tr>
          </thead>
          <tbody>
            <tr className="is-vector">
              <td>Vector</td>
              {vectorVals.map((v, i) => <td key={i}>{v.toFixed(4)}</td>)}
            </tr>
            <tr className="is-graph">
              <td>Graph</td>
              {graphVals.map((v, i) => <td key={i}>{v.toFixed(4)}</td>)}
            </tr>
          </tbody>
        </table>
      </div>
    </figure>
  )
}

/* ─── LatencyBarChart ───────────────────────────────────────────────── */
function LatencyBarChart() {
  const W = 520, H = 220, PAD = { top: 24, right: 32, bottom: 40, left: 52 }
  const innerW = W - PAD.left - PAD.right
  const innerH = H - PAD.top  - PAD.bottom

  const maxVal = 9
  const yTicks = [0, 2, 4, 6, 8]
  const TARGET = 1.5

  const yScale = v => PAD.top + innerH - (v / maxVal) * innerH

  const datasets = [
    { label: 'SQuAD', vector: LATENCY[0].squad, graph: LATENCY[1].squad },
    { label: 'HotpotQA', vector: LATENCY[0].hotpot, graph: LATENCY[1].hotpot }
  ]

  const barW = 44
  const spacing = 12
  const groupW = innerW / 2

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="latency-line-svg" role="img" aria-label="Latency bar chart">
      {/* grid */}
      {yTicks.map(v => (
        <g key={v}>
          <line
            x1={PAD.left} y1={yScale(v)}
            x2={PAD.left + innerW} y2={yScale(v)}
            stroke="var(--line)" strokeWidth="1"
          />
          <text x={PAD.left - 8} y={yScale(v) + 3} fontSize="9" fill="var(--ink-faint)" fontFamily="var(--font-mono)" textAnchor="end">
            {v}s
          </text>
        </g>
      ))}

      {/* 1.5s target line */}
      <line
        x1={PAD.left} y1={yScale(TARGET)}
        x2={PAD.left + innerW} y2={yScale(TARGET)}
        stroke="var(--lime)" strokeWidth="1.5" strokeDasharray="5 3"
      />
      <text x={PAD.left + innerW - 4} y={yScale(TARGET) - 6} fontSize="8.5" fill="var(--lime)" fontFamily="var(--font-mono)" textAnchor="end" style={{ filter: 'drop-shadow(0 0 4px var(--lime))' }}>
        1.5s target
      </text>

      {/* bars */}
      {datasets.map((d, i) => {
        const groupCx = PAD.left + groupW * i + groupW / 2
        const vX = groupCx - barW - spacing / 2
        const gX = groupCx + spacing / 2
        
        const y0 = yScale(0)
        const vY = yScale(d.vector)
        const gY = yScale(d.graph)

        return (
          <g key={d.label}>
            <text x={groupCx} y={H - PAD.bottom + 18} fontSize="11" fill="var(--ink-soft)" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="600">
              {d.label}
            </text>

            {/* Vector bar */}
            <path d={`M${vX},${y0} L${vX},${vY+4} Q${vX},${vY} ${vX+4},${vY} L${vX+barW-4},${vY} Q${vX+barW},${vY} ${vX+barW},${vY+4} L${vX+barW},${y0} Z`} fill="var(--violet)" />
            <text x={vX + barW / 2} y={vY - 8} fontSize="10" fill="var(--violet)" fontFamily="var(--font-mono)" textAnchor="middle">
              {d.vector.toFixed(2)}s
            </text>

            {/* Graph bar */}
            <path d={`M${gX},${y0} L${gX},${gY+4} Q${gX},${gY} ${gX+4},${gY} L${gX+barW-4},${gY} Q${gX+barW},${gY} ${gX+barW},${gY+4} L${gX+barW},${y0} Z`} fill="var(--coral)" />
            <text x={gX + barW / 2} y={gY - 8} fontSize="10" fill="var(--coral)" fontFamily="var(--font-mono)" textAnchor="middle">
              {d.graph.toFixed(2)}s
            </text>
          </g>
        )
      })}
      
      {/* y-axis label */}
      <text
        x={14}
        y={PAD.top + innerH / 2}
        fontSize="9"
        fill="var(--ink-faint)"
        fontFamily="var(--font-mono)"
        textAnchor="middle"
        transform={`rotate(-90, 14, ${PAD.top + innerH / 2})`}
      >
        avg delay (s)
      </text>
    </svg>
  )
}

/* ─── LatencyPerQueryChart ──────────────────────────────────────────── */
function LatencyPerQueryChart({ title, vectorData, graphData, maxVal, isLeft }) {
  const W = 420, H = 220, PAD = { top: 24, right: 16, bottom: 32, left: 32 }
  const innerW = W - PAD.left - PAD.right
  const innerH = H - PAD.top  - PAD.bottom
  const TARGET = 1.5

  const xScale = i => PAD.left + (i / 19) * innerW
  const yScale = v => PAD.top + innerH - (v / maxVal) * innerH

  const mkPath = data => data.map((v, i) => `${i === 0 ? 'M' : 'L'}${xScale(i).toFixed(1)},${yScale(v).toFixed(1)}`).join(' ')
  const mkArea = data => `${mkPath(data)} L${xScale(19).toFixed(1)},${yScale(0)} L${xScale(0).toFixed(1)},${yScale(0)} Z`

  const yTicks = []
  for (let i = 0; i <= maxVal; i += (maxVal > 10 ? 5 : 2)) yTicks.push(i)

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', overflow: 'visible' }} role="img" aria-label={`Per-query latency for ${title}`}>
      <text x={W/2} y={12} fontSize="14" fill="var(--ink)" fontFamily="var(--font-display)" textAnchor="middle" fontWeight="700">
        {title}
      </text>

      {/* grid */}
      {yTicks.map(v => (
        <g key={v}>
          <line x1={PAD.left} y1={yScale(v)} x2={W-PAD.right} y2={yScale(v)} stroke="var(--line)" strokeWidth="1" />
          {isLeft && (
            <text x={PAD.left - 8} y={yScale(v) + 3} fontSize="9" fill="var(--ink-faint)" fontFamily="var(--font-mono)" textAnchor="end">
              {v}s
            </text>
          )}
        </g>
      ))}

      {/* 1.5s target line */}
      <line x1={PAD.left} y1={yScale(TARGET)} x2={W-PAD.right} y2={yScale(TARGET)} stroke="var(--lime)" strokeDasharray="4 2" strokeWidth="1" />

      {/* Graph Area & Line */}
      <path d={mkArea(graphData)} fill="var(--coral)" fillOpacity="0.05" />
      <path d={mkPath(graphData)} fill="none" stroke="var(--coral)" strokeWidth="1.5" strokeLinejoin="round" />
      {graphData.map((v, i) => <circle key={`g${i}`} cx={xScale(i)} cy={yScale(v)} r="2.5" fill="var(--coral)" />)}

      {/* Vector Area & Line */}
      <path d={mkArea(vectorData)} fill="var(--violet)" fillOpacity="0.1" />
      <path d={mkPath(vectorData)} fill="none" stroke="var(--violet)" strokeWidth="1.5" strokeLinejoin="round" />
      {vectorData.map((v, i) => <circle key={`v${i}`} cx={xScale(i)} cy={yScale(v)} r="2.5" fill="var(--violet)" />)}

      {/* x-axis labels */}
      {[1, 5, 10, 15, 20].map(v => (
        <text key={v} x={xScale(v - 1)} y={H - 6} fontSize="9" fill="var(--ink-soft)" fontFamily="var(--font-mono)" textAnchor="middle">
          {v}
        </text>
      ))}
      <text x={W/2} y={H + 10} fontSize="9" fill="var(--ink-faint)" fontFamily="var(--font-mono)" textAnchor="middle">Query #</text>
    </svg>
  )
}

/* ─── Main export ───────────────────────────────────────────────────── */
import SlideCommit from './SlideCommit';
import GradientWaves from './GradientWaves';
import StrokeText from './StrokeText';

export default function BenchmarkResults() {
  const sectionRef = useRef(null)
  const [animated, setAnimated] = useState(false)
  const [isRevealed, setIsRevealed] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setAnimated(true); obs.disconnect() } },
      { threshold: 0.15 }
    )
    if (sectionRef.current) obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [])

  const vectorBetter = ASR.vector < ASR.graph  // true → VectorRAG wins ASR

  return (
    <section className="rag-benchmarks" ref={sectionRef} aria-labelledby="benchmark-title">
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <GradientWaves
          horizonColor="#F6F5FC"
          waveColor="#7C5CFC"
          crestColor="#FF6B4A"
          speed={0.4}
          amplitude={2.5}
          waveScale={0.6}
          opacity={1.0}
          mouseInteraction={true}
        />
      </div>

      <div className="rag-shell" style={{ position: 'relative', zIndex: 1 }}>

        {!isRevealed ? (
          <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '48px' }}>
            <div style={{ maxWidth: '720px', width: '100%', pointerEvents: 'none' }}>
              <StrokeText
                text="Lets Explore !"
                curve={true}
                strokeColor="var(--violet)"
                fillColor="var(--ink)"
                strokeWidth={1.5}
                drawDuration={1.4}
                fillDelay={0.2}
                stagger={0.06}
                ease="power2.out"
                trigger="scroll"
                scrollStart="bottom 95%"
                fillMode="wipe"
                fontSize={76}
                fontWeight={800}
                letterSpacing={0}
              />
            </div>
            <SlideCommit
              label="Slide to reveal benchmarks"
              doneLabel="Unlocked"
              onDone={() => setTimeout(() => setIsRevealed(true), 400)}
              trackColor="var(--card)"
              handleColor="var(--violet)"
              successColor="var(--lime)"
              width={420}
              height={72}
              radius={36}
              speed={50}
              landingDip={0}
              holdMs={400}
            />
          </div>
        ) : (
          <div className="rag-benchmarks-content fade-in">
            {/* ── intro ── */}
            <div className="rag-section-head benchmark-intro">
              <p className="rag-kicker">Benchmark results</p>
              <h2 id="benchmark-title">The right RAG depends on the job.</h2>
              <p>Both architectures were evaluated in the same Pipecat voice-agent setup across RAGAS retrieval quality, average RAG delay, and resilience to ASR noise.</p>
            </div>

            {/* ── legend ── */}
            <div className="bm-legend">
              <span className="bm-dot is-vector" />VectorRAG
              <span className="bm-dot is-graph"  />GraphRAG
            </div>

            {/* ══ 01 Retrieval quality ══ */}
            <div className="benchmark-section-title">
              <span>01</span>
              <div><h3>Retrieval quality</h3><p>VectorRAG performs better for factual queries (SQuAD), while GraphRAG excels at multi-hop reasoning (HotpotQA).</p></div>
            </div>

            <div className="radar-grid">
          <RadarChart
            dataset="SQuAD"
            vectorVals={RADAR.squad.vector}
            graphVals={RADAR.squad.graph}
            animated={animated}
          />
          <RadarChart
            dataset="HotpotQA"
            vectorVals={RADAR.hotpot.vector}
            graphVals={RADAR.hotpot.graph}
            animated={animated}
          />
        </div>

        {/* ══ 02 Latency ══ */}
        <div className="benchmark-section-title">
          <span>02</span>
          <div><h3>Latency</h3><p>Lower latency translates to higher system responsiveness, enabling a more natural and fluid conversation.</p></div>
        </div>

        <div className="benchmark-panel latency-panel">
          <div className="latency-chart-wrap">
            <LatencyBarChart />
          </div>
          <div className="latency-legend-col">
            <div className="latency-leg-item">
              <span className="bm-dot is-vector" style={{ width: 12, height: 12 }} />
              <div>
                <strong>VectorRAG</strong>
                <p>SQuAD: 1.19s — HotpotQA: 3.27s</p>
              </div>
            </div>
            <div className="latency-leg-item">
              <span className="bm-dot is-graph" style={{ width: 12, height: 12 }} />
              <div>
                <strong>GraphRAG</strong>
                <p>SQuAD: 1.98s — HotpotQA: 7.83s</p>
              </div>
            </div>
            <p className="benchmark-note" style={{ marginTop: 24 }}>
              VectorRAG-SQuAD is the fastest. GraphRAG-HotpotQA is the slowest — retrieval delay is the main contributor to time-to-first-response.
            </p>
          </div>
          
          <div className="per-query-grid">
            <h4 className="per-query-title">RAG Delay per Query</h4>
            <LatencyPerQueryChart
              title="SQuAD"
              vectorData={PER_QUERY_SQUAD_V}
              graphData={PER_QUERY_SQUAD_G}
              maxVal={20}
              isLeft={true}
            />
            <LatencyPerQueryChart
              title="HotpotQA"
              vectorData={PER_QUERY_HOTPOT_V}
              graphData={PER_QUERY_HOTPOT_G}
              maxVal={20}
              isLeft={false}
            />
          </div>
        </div>

        {/* ══ 03 ASR Robustness ══ */}
        <div className="benchmark-section-title">
          <span>03</span>
          <div><h3>ASR robustness</h3><p>Voice-based systems must account for background noise and transcription errors. Robustness against ASR inaccuracies is essential to prevent misunderstandings and ensure a complete conversation.</p></div>
        </div>

        <div className="asr-big-panel">
          {/* VectorRAG big stat */}
          <div className={`asr-stat-card ${vectorBetter ? 'asr-winner' : ''}`}>
            <p className="benchmark-overline">VectorRAG</p>
            <div className="asr-big-value" style={{ '--asr-accent': 'var(--violet)' }}>
              {ASR.vector}<span className="asr-unit">%</span>
            </div>
            <p className="asr-sub">accuracy loss at 40% WER</p>
            {vectorBetter && (
              <div className="asr-badge">
                <svg viewBox="0 0 16 16" width="12" height="12" fill="none">
                  <path d="M8 1l1.8 3.6L14 5.3l-3 2.9.7 4.1L8 10.4l-3.7 1.9.7-4.1L2 5.3l4.2-.7L8 1z" fill="currentColor"/>
                </svg>
                more robust
              </div>
            )}
          </div>

          {/* vs divider */}
          <div className="asr-vs" aria-hidden="true">vs</div>

          {/* GraphRAG big stat */}
          <div className={`asr-stat-card ${!vectorBetter ? 'asr-winner' : ''}`}>
            <p className="benchmark-overline" style={{ '--accent-color': 'var(--coral)' }}>GraphRAG</p>
            <div className="asr-big-value" style={{ '--asr-accent': 'var(--coral)' }}>
              {ASR.graph}<span className="asr-unit">%</span>
            </div>
            <p className="asr-sub">accuracy loss at 40% WER</p>
            {!vectorBetter && (
              <div className="asr-badge" style={{ background: 'var(--coral)' }}>
                <svg viewBox="0 0 16 16" width="12" height="12" fill="none">
                  <path d="M8 1l1.8 3.6L14 5.3l-3 2.9.7 4.1L8 10.4l-3.7 1.9.7-4.1L2 5.3l4.2-.7L8 1z" fill="currentColor"/>
                </svg>
                more robust
              </div>
            )}
          </div>

          {/* diff callout */}
          <div className="asr-diff">
            <span className="asr-diff-val">+{(ASR.graph - ASR.vector).toFixed(1)}%</span>
            <p>extra loss for GraphRAG under heavy ASR noise (HotpotQA)</p>
          </div>
        </div>

        {/* conclusion */}
        <aside className="benchmark-conclusion">
          <strong>Deployment takeaway:</strong> VectorRAG's low latency and ASR robustness make it ideal for real-time voice agents, while GraphRAG excels at complex, multi-hop reasoning across scattered documents. Ultimately, there is no universal winner—the best architecture depends entirely on whether your application prioritizes conversational fluidity or deep contextual connections.
        </aside>
          </div>
        )}
      </div>
    </section>
  )
}
