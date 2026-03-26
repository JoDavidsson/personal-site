"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";

export default function CategoryDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div className="cat-dropdown" ref={ref}>
      <button
        className="cat-dropdown__trigger"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
      >
        [ SELECT CATEGORY ] &gt;
      </button>

      <div className={`cat-dropdown__menu${open ? " open" : ""}`} role="menu">
        {CATEGORIES.map((cat) => (
          <div key={cat.slug}>
            <Link
              href={`/blog/${cat.slug}`}
              className="cat-dropdown__item"
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              &gt; {cat.label}
            </Link>
            <Link
              href={cat.rssPath}
              className="cat-dropdown__item cat-dropdown__item--rss"
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              {cat.rssPath.replace("/feed/", "").replace(".xml", "")} feed
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
