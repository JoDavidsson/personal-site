"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import CategoryDropdown from "./CategoryDropdown";

const WORDMARK = `
 ██████╗ ███████╗████████╗██████╗  ██████╗ ███╗   ██╗ ██████╗ ██████╗ ███████╗
 ██╔══██╗██╔════╝╚══██╔══╝██╔══██╗██╔═══██╗████╗  ██║██╔═══██╗██╔══██╗██╔════╝
 ██████╔╝█████╗     ██║   ██████╔╝██║   ██║██╔██╗ ██║██║   ██║██║  ██║█████╗
 ██╔══██╗██╔══╝     ██║   ██╔══██╗██║   ██║██║╚██╗██║██║   ██║██║  ██║██╔══╝
 ██║  ██║███████╗   ██║   ██║  ██║╚██████╔╝██║ ╚████║╚██████╔╝██████╔╝███████╗
 ╚═╝  ╚═╝╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝ ╚═════╝ ╚═════╝ ╚══════╝`.trim();

export default function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="site-wrapper">
        <div className="site-header__inner">
          <pre className="site-header__wordmark" aria-label="RETRO_SPECT">
            {WORDMARK}
          </pre>
          <p className="site-header__sub">
            // Johannes Davidsson &mdash; writing on retail, robotics, AI, spatial computing, CV in retail
          </p>
        </div>

        <nav className="site-nav" aria-label="Main navigation">
          <Link href="/" className={pathname === "/" ? "active" : ""}>
            &gt; HOME
          </Link>
          <Link href="/blog" className={pathname.startsWith("/blog") ? "active" : ""}>
            &gt; BLOG
          </Link>
          <Link href="/about" className={pathname === "/about" ? "active" : ""}>
            &gt; ABOUT
          </Link>
          <Link href="/contact" className={pathname === "/contact" ? "active" : ""}>
            &gt; CONTACT
          </Link>

          <div className="cat-dropdown-wrapper" style={{ marginLeft: "auto" }}>
            <CategoryDropdown />
          </div>
        </nav>
      </div>
    </header>
  );
}
