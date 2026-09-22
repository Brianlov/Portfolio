# Design System: Brian Ooi Portfolio

## Surface Type
**Brand / Marketing** — single-page portfolio. Every pixel competes for attention. Err on bold, not safe.

---

## Color Tokens

All colors are CSS custom properties on `:root`. **Never hard-code hex values** — always reference tokens.

| Token | Value | Usage |
|---|---|---|
| `--bg` | `#F6F5FC` | Page background (light lavender-white) |
| `--bg-alt` | `#ECE9FA` | Alternate section backgrounds |
| `--card` | `#FFFFFF` | Card surfaces |
| `--ink` | `#16162A` | Primary text, borders, buttons |
| `--ink-soft` | `#55536E` | Body text, secondary labels |
| `--ink-faint` | `#8987A3` | Tertiary text, placeholders |
| `--violet` | `#7C5CFC` | Primary accent — interactive elements, highlights |
| `--violet-deep` | `#5B3DE0` | Stronger violet for eyebrow labels, icons |
| `--lime` | `#C6F135` | Pop accent — used sparingly for shadow punches, underlines |
| `--coral` | `#FF6B4A` | Warm accent — used for box-shadow punches, prefix glyphs |
| `--sky` | `#5EC8F2` | Cool accent — float icons, gradients |
| `--line` | `rgba(22,22,42,0.1)` | Borders, dividers |

### Accent Usage Rules
- **Never use all three accents (violet, lime, coral) on the same element**
- Lime and coral are for *punch accents* only (box-shadow offsets, underlines, glow rings) — not fills
- Violet is the primary brand color and can be used as fills

---

## Typography

| Token | Font | Usage |
|---|---|---|
| `--font-display` | Space Grotesk | Headings (h1–h4), nav logo, buttons |
| `--font-body` | Inter | Body text, descriptions |
| `--font-mono` | Space Mono | Eyebrows, labels, badges, chips, code |

### Scale
- Hero title: `clamp(40px, 6.2vw, 76px)`, letter-spacing `-0.02em`
- Section heading: `clamp(32px, 5vw, 48px)`
- Body: `17–18px`, line-height `1.6–1.75`
- Eyebrow: `13px`, `text-transform: uppercase`, `letter-spacing: 0.08em`
- Mono labels / chips: `11–14px`

### Rules
- One `<h1>` per page (Hero title only)
- Eyebrows always come before section headings — monospace, uppercase, violet-deep
- Never use `font-weight: 400` for headings — minimum `600`

---

## Spacing & Layout

- Container max-width: `1120px`, padding `0 24px`
- Section padding: `120px 0` (desktop), `80px 0` (mobile ≤760px)
- Grid gaps follow multiples of 8: `8, 16, 24, 28, 32, 40, 48, 56, 72px`

---

## Component Patterns

### Buttons (`.btn`)
- Border-radius: `100px` (pill)
- Border: `2px solid var(--ink)`
- Hover: `translate(-3px, -3px)` + `box-shadow: 4px 4px 0 [accent]`
- Primary (`.btn-primary`): ink fill, bg text, lime shadow on hover
- Ghost (`.btn-ghost`): transparent, ink text, coral shadow on hover
- **Never use border-radius < 100px on buttons**

### Cards (`.project-card`)
- Border-radius: `20px`
- Border: `1px solid var(--line)` + `4px solid var(--accent)` top stripe
- Background: `var(--card)`
- Hover: `box-shadow: 0 20px 40px rgba(22,22,42,0.1)`
- **No gradient fills on cards** — use the top border stripe for color injection

### Tags / Chips
- Border-radius: `100px` (always pill)
- Background: `var(--bg-alt)` or `var(--card)`
- Border: `1px solid var(--line)`
- Font: `var(--font-mono)`, `12–14px`

### Eyebrow Label
- Monospace, uppercase, violet-deep
- Prefixed with a lime dot (via `::before` pseudo-element with glow ring)

### Avatar (EyeTrackingAvatar)
- 5 poses auto-cycling every 8s via `setInterval`
- Pose transitions: directional slide (up/right/down/left/diagonal) + opacity fade, 0.38s
- Continuous idle float bob: `y: [0, -10, 0]` on 3.2s infinite loop
- Hover lean: `rotateX`/`rotateY` ±10° spring-driven perspective tilt toward cursor
- Click easter egg: "shh" pose for 2.5s
- Badge label crossfades with each pose

### PixelTransition
- GSAP pixel-dissolve on hover/touch
- Used in Hero for photo reveal (firstContent → secondContent)
- Grid size: 12, pixelColor: `var(--violet)`, stepDuration: 0.5s

---

## Animation Principles

1. **Framer Motion first** — all UI animations use Framer Motion unless there's a specific reason (GSAP only for the pixel grid effect)
2. **Spring feel over linear** — prefer `useSpring` / cubic-bezier easing over `ease-in-out`
3. **Entrance animations**: `opacity: 0 → 1` + `y: 16 → 0` or `scale: 0.9 → 1`, duration `0.5–0.65s`
4. **Stagger children**: `staggerChildren: 0.08s` for list reveals
5. **`whileInView` + `once: true`** for scroll-triggered reveals (About, Projects, Skills sections)
6. **Never animate layout properties** (width, height, padding) — only transform and opacity
7. **`prefers-reduced-motion`** is respected globally in CSS — `animation-duration: 0.001ms`

### Micro-animation Catalogue
| Element | Animation |
|---|---|
| Hero float icons | Parallax on mouse + infinite rotation `[0, -6, 6, 0]` |
| Scroll cue | `y: [0, 8, 0]` infinite, fades out at 60% scroll |
| Role cycler | Character scramble (custom), 10s interval |
| Avatar | Float bob + directional slide pose transitions + hover lean |
| Circuit rail | Scale fill on scroll progress |
| Buttons | Translate punch on hover |
| Skill chips | Border-color transition on hover |

---

## Anti-Patterns (Do NOT Do These)

- ❌ No dark mode toggle — this site is light-mode only
- ❌ No gradient backgrounds on sections (bg-alt is a solid muted lavender)
- ❌ No box shadows using `rgba(0,0,0,x)` — use `rgba(22,22,42,x)` (ink-tinted)
- ❌ No `border-radius: 8px` on buttons or chips — must be pill (`100px`)
- ❌ No inline `color: #hex` — always use CSS tokens
- ❌ No TailwindCSS — vanilla CSS only
- ❌ Don't add sections without updating `CircuitRail.jsx` nav nodes
- ❌ Don't animate `width`, `height`, or `margin` — use `transform` only
- ❌ Avatar is hidden on mobile (`≤900px`) — don't add it back without a mobile layout plan
