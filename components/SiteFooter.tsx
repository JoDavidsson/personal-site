import Link from "next/link";

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-wrapper">
        <div className="site-footer__inner">
          <span>
            &copy; {year} Johannes Davidsson &mdash; RETRO_SPECT
          </span>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            <Link href="/">Home</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
