"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";

export default function CategoryDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleToggle = useCallback(() => {
    setOpen((v) => !v);
  }, []);

  const handleSelect = useCallback(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <div className="cat-dropdown" ref={ref}>
      <button
        className={`cat-dropdown__trigger${open ? " open" : ""}`}
        onClick={handleToggle}
        aria-expanded={open}
        aria-haspopup="true"
        type="button"
      >
        [ SELECT CATEGORY ] {open ? "^" : ">"}
      </button>

      {open && (
        <div className="cat-dropdown__menu" role="menu">
          {CATEGORIES.map((cat) => (
            <div key={cat.slug}>
              <Link
                href={`/blog/${cat.slug}`}
                className="cat-dropdown__item"
                role="menuitem"
                onClick={handleSelect}
              >
                &gt; {cat.label}
              </Link>
              <Link
                href={`/feed/${cat.slug}.xml`}
                className="cat-dropdown__item cat-dropdown__item--rss"
                role="menuitem"
                onClick={handleSelect}
              >
                RSS: {cat.slug}
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
