import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Link from "next/link";
import { getAllPosts, CATEGORIES } from "@/lib/posts";

export default function BlogPage() {
  const allPosts = getAllPosts();

  return (
    <>
      <SiteHeader />
      <main>
        <div className="site-wrapper">
          <div className="page-header">
            <h1>&gt; BLOG</h1>
            <p>All posts, newest first. Use the category dropdown above to filter by topic.</p>
          </div>

          {allPosts.length === 0 ? (
            <p style={{ fontSize: "0.85rem", color: "var(--fg-muted)", fontStyle: "italic" }}>
              No posts yet. Check back soon.
            </p>
          ) : (
            <ul className="post-list">
              {allPosts.map((post, i) => (
                <li key={`${post.category}-${post.slug}`} className="post-list__item">
                  <div className="post-list__meta">
                    <span className="post-list__category">
                      {CATEGORIES.find((c) => c.slug === post.category)?.label}
                    </span>
                    <span>{post.date}</span>
                  </div>
                  <Link href={`/blog/${post.category}/${post.slug}`} className="post-list__title">
                    {post.title}
                  </Link>
                  <p className="post-list__excerpt">{post.excerpt}</p>

                  {i < allPosts.length - 1 && (
                    <div className="post-divider" aria-hidden="true">
                      - - - - - - - - - - - - - - - -
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
