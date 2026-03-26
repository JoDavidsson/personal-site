import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Link from "next/link";
import TopicPills from "@/components/TopicPills";
import NewsReel from "@/components/NewsReel";
import { getAllPosts, CATEGORIES } from "@/lib/posts";

export default function HomePage() {
  const allPosts = getAllPosts().slice(0, 5);

  return (
    <>
      <SiteHeader />
      <main>
        <div className="site-wrapper">
          {/* Hero */}
          <section style={{ padding: "4rem 0 3rem" }}>
            <p
              style={{
                fontSize: "0.75rem",
                color: "var(--fg-muted)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: "1rem",
              }}
            >
              // SYSTEM ONLINE
            </p>
            <h1
              style={{
                fontSize: "1.75rem",
                fontWeight: 700,
                lineHeight: 1.2,
                letterSpacing: "-0.02em",
                marginBottom: "1.25rem",
              }}
            >
              Observations on the intersection of
              <br />
              retail, machines, and intelligence.
            </h1>
            <p
              style={{
                fontSize: "0.875rem",
                color: "var(--fg-muted)",
                maxWidth: "540px",
                lineHeight: 1.7,
              }}
            >
              I write about computer vision in brick-and-mortar retail,
              autonomous robotics in logistics, spatial computing interfaces,
              and the AI systems reshaping how things are sold and moved.
              Occasional detours into whatever caught my attention.
            </p>
          </section>

          {/* Category Overview */}
          <section style={{ marginBottom: "3rem" }}>
            <p
              style={{
                fontSize: "0.7rem",
                color: "var(--fg-muted)",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                marginBottom: "1rem",
                paddingBottom: "0.5rem",
                borderBottom: "1px solid var(--border)",
              }}
            >
              // TOPICS
            </p>
            <TopicPills />
          </section>

          {/* Curated News Reel */}
          <NewsReel />

          {/* Recent Posts */}
          <section>
            <p
              style={{
                fontSize: "0.7rem",
                color: "var(--fg-muted)",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                marginBottom: "1rem",
                paddingBottom: "0.5rem",
                borderBottom: "1px solid var(--border)",
              }}
            >
              // RECENT_POSTS
            </p>

            {allPosts.length === 0 ? (
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "var(--fg-muted)",
                  fontStyle: "italic",
                  padding: "2rem 0",
                }}
              >
                No posts yet. Check back soon.
              </p>
            ) : (
              <ul className="post-list">
                {allPosts.map((post) => (
                  <li key={`${post.category}-${post.slug}`} className="post-list__item">
                    <div className="post-list__meta">
                      <span className="post-list__category">
                        {CATEGORIES.find((c) => c.slug === post.category)?.label}
                      </span>
                      <span>{post.date}</span>
                    </div>
                    <Link
                      href={`/blog/${post.category}/${post.slug}`}
                      className="post-list__title"
                    >
                      {post.title}
                    </Link>
                    <p className="post-list__excerpt">{post.excerpt}</p>
                  </li>
                ))}
              </ul>
            )}

            <div style={{ textAlign: "center", padding: "2rem 0" }}>
              <Link
                href="/blog"
                style={{
                  fontSize: "0.75rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--fg-muted)",
                  border: "1px solid var(--border)",
                  padding: "0.5rem 1.25rem",
                  display: "inline-block",
                  transition: "border-color 0.15s, color 0.15s",
                }}
              >
                [ VIEW ALL POSTS &gt; ]
              </Link>
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
