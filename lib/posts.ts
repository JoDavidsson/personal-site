import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";
import { CATEGORIES, type Category } from "./categories";

export type { Category };
export { CATEGORIES };

export interface PostMeta {
  slug: string;
  category: Category;
  title: string;
  date: string;
  excerpt: string;
}

function getPostSlugs(category: Category): string[] {
  const dir = path.join(process.cwd(), "content/posts", category);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export function getAllPosts(): PostMeta[] {
  const posts: PostMeta[] = [];

  for (const cat of CATEGORIES) {
    const slugs = getPostSlugs(cat.slug);
    for (const slug of slugs) {
      const fullPath = path.join(
        process.cwd(),
        "content/posts",
        cat.slug,
        `${slug}.md`
      );
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(fileContents);
      posts.push({
        slug,
        category: cat.slug,
        title: data.title ?? slug,
        date: data.date ?? "",
        excerpt: data.excerpt ?? "",
      });
    }
  }

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostsByCategory(category: Category): PostMeta[] {
  const dir = path.join(process.cwd(), "content/posts", category);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""))
    .map((slug) => {
      const fullPath = path.join(dir, `${slug}.md`);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(fileContents);
      return {
        slug,
        category,
        title: data.title ?? slug,
        date: data.date ?? "",
        excerpt: data.excerpt ?? "",
      } as PostMeta;
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPostContent(
  category: Category,
  slug: string
): Promise<string> {
  const fullPath = path.join(
    process.cwd(),
    "content/posts",
    category,
    `${slug}.md`
  );
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { content } = matter(fileContents);
  const processed = await remark().use(remarkHtml).process(content);
  return processed.toString();
}
