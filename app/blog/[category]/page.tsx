import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostsByCategory, CATEGORIES, type Category } from "@/lib/posts";

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return CATEGORIES.map((cat) => ({ category: cat.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { category } = await params;
  const cat = CATEGORIES.find((c) => c.slug === category);
  if (!cat) return {};
  return {
    title: cat.label,
    description: `All posts in the ${cat.label} category.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;

  if (!CATEGORIES.find((c) => c.slug === category)) {
    notFound();
  }

  const posts = getPostsByCategory(category as Category);

  const cat = CATEGORIES.find((c) => c.slug === category)!;

  return (
    <>
      <SiteHeader />
      <main>
        <div className="site-wrapper">
          <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <h1>&gt; {cat.label.toUpperCase()}</h1>
              <p>Curated news and writing on {cat.label.toLowerCase()}.</p>
            </div>
            <a
              href={cat.rssPath}
              className="rss-btn"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <circle cx="6.18" cy="17.82" r="2.18"/>
                <path d="M4 11a9 9 0 0 1 9 9"/>
                <path d="M4 4a16 16 0 0 1 16 16"/>
              </svg>
              RSS
            </a>
          </div>

          {posts.length === 0 ? (
            <p style={{ fontSize: "0.85rem", color: "var(--fg-muted)", fontStyle: "italic" }}>
              No posts in this category yet.
            </p>
          ) : (
            <ul className="post-list">
              {posts.map((post, i) => (
                <li key={post.slug} className="post-list__item">
                  <div className="post-list__meta">
                    <span className="post-list__category">{cat.label}</span>
                    <span>{post.date}</span>
                  </div>
                  <Link
                    href={`/blog/${category}/${post.slug}`}
                    className="post-list__title"
                  >
                    {post.title}
                  </Link>
                  <p className="post-list__excerpt">{post.excerpt}</p>

                  {i < posts.length - 1 && (
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
