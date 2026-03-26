import fs from "fs";
import path from "path";
import { XMLParser } from "fast-xml-parser";
import type { Category } from "@/lib/categories";
import { CATEGORIES } from "@/lib/categories";

interface NewsItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  source: string;
}

function toString(val: unknown): string {
  if (typeof val === "string") return val;
  if (typeof val === "object" && val !== null) {
    // Some XML fields are objects like { "#text": "...", "@_url": "..." }
    // Prefer #text if present, otherwise stringify cautiously
    const obj = val as Record<string, unknown>;
    if (obj["#text"] != null) return String(obj["#text"]);
    return JSON.stringify(val);
  }
  return String(val ?? "");
}

function stripHtml(html: unknown): string {
  return toString(html)
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseXMLFile(filePath: string): NewsItem[] {
  if (!fs.existsSync(filePath)) return [];
  const xml = fs.readFileSync(filePath, "utf8");
  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });
  const parsed = parser.parse(xml);
  const items = parsed?.rss?.channel?.item ?? [];
  const channelTitle = parsed?.rss?.channel?.title ?? "";
  return (Array.isArray(items) ? items : [items])
    .map((item: Record<string, unknown>) => ({
      title: stripHtml(item.title),
      link: toString(item.link || item.guid || "#"),
      description: stripHtml(item.description),
      pubDate: toString(item.pubDate),
      source: toString(channelTitle),
    }))
    .filter((item) => item.title);
}

function timeAgo(dateStr: string): string {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  if (isNaN(diff)) return "";
  const h = Math.floor(diff / 3600000);
  if (h < 1) return "just now";
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export default async function NewsReel({ category }: { category?: Category }) {
  const FEED_DIR = path.join(process.cwd(), "public", "feed");

  if (category) {
    const items = parseXMLFile(path.join(FEED_DIR, `${category}.xml`));
    if (!items.length) {
      return (
        <div style={{ padding: "1rem 0", fontSize: "0.8rem", color: "var(--fg-muted)", fontStyle: "italic" }}>
          No news items yet. Run the batch job to populate.
        </div>
      );
    }
    return (
      <div className="news-reel">
        <div className="news-reel__track">
          {items.slice(0, 20).map((item, i) => (
            <a
              key={i}
              href={item.link}
              className="news-reel__item"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="news-reel__meta">
                <span className="news-reel__time">{timeAgo(item.pubDate)}</span>
              </span>
              <span className="news-reel__title">{item.title}</span>
              {item.description && (
                <span className="news-reel__desc">{item.description}</span>
              )}
            </a>
          ))}
        </div>
      </div>
    );
  }

  // Homepage — aggregate from all categories
  const allItems: (NewsItem & { catLabel: string })[] = [];
  for (const cat of CATEGORIES) {
    const items = parseXMLFile(path.join(FEED_DIR, `${cat.slug}.xml`));
    for (const item of items.slice(0, 10)) {
      allItems.push({ ...item, catLabel: cat.label });
    }
  }

  allItems.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

  if (!allItems.length) return null;

  return (
    <div className="news-reel">
      <p
        style={{
          fontSize: "0.7rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "var(--fg-muted)",
          marginBottom: "1rem",
          paddingBottom: "0.5rem",
          borderBottom: "1px solid var(--border)",
        }}
      >
        // CURATED NEWS
      </p>
      <div className="news-reel__track">
        {allItems.slice(0, 30).map((item, i) => (
          <a
            key={i}
            href={item.link}
            className="news-reel__item"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="news-reel__meta">
              <span className="news-reel__cat">{item.catLabel}</span>
              <span className="news-reel__time">{timeAgo(item.pubDate)}</span>
            </span>
            <span className="news-reel__title">{item.title}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
