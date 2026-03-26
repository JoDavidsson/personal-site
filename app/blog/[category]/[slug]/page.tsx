import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPostContent, CATEGORIES, type Category } from "@/lib/posts";

interface Props {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    category: post.category,
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { category, slug } = await params;
  const posts = getAllPosts();
  const post = posts.find((p) => p.category === category && p.slug === slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function PostPage({ params }: Props) {
  const { category, slug } = await params;

  const cat = CATEGORIES.find((c) => c.slug === category);
  if (!cat) notFound();

  let content: string;
  try {
    content = await getPostContent(category as Category, slug);
  } catch {
    notFound();
  }

  const posts = getAllPosts().filter((p) => p.category === category);
  const currentIndex = posts.findIndex((p) => p.slug === slug);
  const prevPost = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;
  const nextPost = currentIndex > 0 ? posts[currentIndex - 1] : null;

  const currentPost = posts[currentIndex];

  return (
    <>
      <SiteHeader />
      <main>
        <div className="site-wrapper">
          <article className="post">
            <Link href="/blog" className="back-link">
              &lt;&lt; BACK TO BLOG
            </Link>

            <header className="post__header">
              <div className="post__meta">
                <span className="post__category">{cat.label}</span>
                <span>{currentPost.date}</span>
              </div>
              <h1 className="post__title">{currentPost.title}</h1>
            </header>

            <div
              className="post__content"
              dangerouslySetInnerHTML={{ __html: content }}
            />

            {/* Post Navigation */}
            {(prevPost || nextPost) && (
              <nav
                aria-label="Post navigation"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "1rem",
                  marginTop: "3rem",
                  paddingTop: "1.5rem",
                  borderTop: "1px solid var(--border)",
                  flexWrap: "wrap",
                }}
              >
                {prevPost ? (
                  <Link
                    href={`/blog/${category}/${prevPost.slug}`}
                    style={{ fontSize: "0.75rem", color: "var(--fg-muted)" }}
                  >
                    &lt;&lt; {prevPost.title}
                  </Link>
                ) : (
                  <span />
                )}
                {nextPost && (
                  <Link
                    href={`/blog/${category}/${nextPost.slug}`}
                    style={{ fontSize: "0.75rem", color: "var(--fg-muted)", textAlign: "right" }}
                  >
                    {nextPost.title} &gt;&gt;
                  </Link>
                )}
              </nav>
            )}
          </article>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
