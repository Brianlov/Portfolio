export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <span>&copy; {year} Brian Ooi. Built with React + Vite.</span>
        <span className="footer-tag">designed &amp; coded from scratch</span>
      </div>
    </footer>
  )
}
