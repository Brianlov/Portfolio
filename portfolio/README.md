# Your Name — Portfolio

A React + Vite portfolio built for a final-year Computer Engineering student. Playful,
motion-driven design with a signature "circuit rail" that tracks your scroll progress
down the left side of the page — a nod to the hardware + software mix of computer
engineering.

## Getting started

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually `http://localhost:5173`).

To build for production:

```bash
npm run build
npm run preview
```

## What to customize before you ship this

1. **`index.html`** — page title and meta description.
2. **`src/components/Hero.jsx`** — your name, tagline, role list, resume link, social URLs.
3. **`src/components/About.jsx`** — bio text and quick facts. Swap the placeholder
   portrait box for a real `<img>` of you (drop the image in `public/` and reference it,
   e.g. `public/me.jpg` → `<img src="/me.jpg" />`).
4. **`src/components/Projects.jsx`** — replace the 4 placeholder projects with your real
   ones: title, one-line blurb, tags, GitHub link, live-demo link. Consider adding a
   screenshot/GIF per project as a background image on `.project-card` for extra polish.
5. **`src/components/Skills.jsx`** — edit the skill groups/items to match your actual stack.
6. **`src/components/Contact.jsx`** — your real email and social links.
7. **`public/resume.pdf`** — drop your resume PDF here so the "Resume" button in the hero
   works (or remove the button in `Hero.jsx` if you'd rather not link one yet).
8. **`public/favicon.svg`** — swap for your own mark if you want.

## Structure

```
src/
  components/
    Navbar.jsx       fixed nav + mobile menu
    CircuitRail.jsx  the signature scroll-progress rail (desktop only)
    Hero.jsx         landing section with cycling role text + floating icons
    About.jsx        bio + quick facts
    Projects.jsx     tilt-on-hover project cards
    Skills.jsx       grouped, animated skill chips
    Contact.jsx      CTA + email + socials
    Footer.jsx
  App.jsx
  index.css          all design tokens + styles (CSS variables at the top)
```

## Design notes

- **Palette / type / motion tokens** all live at the top of `src/index.css` as CSS
  variables (`--violet`, `--coral`, `--lime`, `--font-display`, etc.) — change those to
  reskin the whole site without touching component code.
- Animations respect `prefers-reduced-motion`.
- The circuit rail hides below 900px width; on mobile the nav + content still fully work.
- No CSS framework — plain CSS with variables, so there's nothing extra to learn to keep
  customizing it.

## Deploying

This is a static Vite app, so it deploys easily to **Vercel**, **Netlify**, or **GitHub
Pages**. For GitHub Pages specifically, set `base: '/your-repo-name/'` in
`vite.config.js` before building.
