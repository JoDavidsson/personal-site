import { getPostsByCategory, CATEGORIES } from "@/lib/posts";
import type { Category } from "@/lib/categories";

const SITE_URL = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
const SITE_TITLE = "RETRO_SPECT";
const AUTHOR = "Johannes Davidsson";

function buildRSS(category: Category): string {
  const cat = CATEGORIES.find((c) => c.slug === category)!;
  const posts = getPostsByCategory(category);

  const items = posts
    .map(
      (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${SITE_URL}/blog/${category}/${post.slug}</link>
      <guid>${SITE_URL}/blog/${category}/${post.slug}</guid>
      <description><![CDATA[${post.excerpt}]]></description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <author>${AUTHOR}</author>
      <category>${cat.label}</category>
    </item>`
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_TITLE} — ${cat.label}</title>
    <link>${SITE_URL}</link>
    <description>Posts on ${cat.label} by ${AUTHOR}</description>
    <language>en</language>
    <managingEditor>${AUTHOR}</managingEditor>
    <webMaster>${AUTHOR}</webMaster>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed/${category}.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ category: string }> }
) {
  const { category } = await params;
  const valid = CATEGORIES.find((c) => c.slug === category);
  if (!valid) {
    return new Response("Not found", { status: 404 });
  }

  const xml = buildRSS(category as Category);
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
