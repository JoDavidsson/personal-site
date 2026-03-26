"use client";

import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";

export default function TopicPills() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
      {CATEGORIES.map((cat) => (
        <Link
          key={cat.slug}
          href={`/blog/${cat.slug}`}
          style={{
            display: "inline-block",
            padding: "0.35rem 0.75rem",
            border: "1px solid var(--border)",
            fontSize: "0.7rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--fg)",
            transition: "border-color 0.15s, color 0.15s",
          }}
          onMouseEnter={(e) => {
            const t = e.currentTarget;
            t.style.borderColor = "var(--accent)";
            t.style.color = "var(--accent)";
          }}
          onMouseLeave={(e) => {
            const t = e.currentTarget;
            t.style.borderColor = "var(--border)";
            t.style.color = "var(--fg)";
          }}
        >
          {cat.label}
        </Link>
      ))}
    </div>
  );
}
