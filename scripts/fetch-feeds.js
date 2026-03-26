#!/usr/bin/env node
/**
 * Nightly RSS batch job
 *
 * Aggregates curated news from configured RSS sources per category,
 * then writes one aggregated .xml file per category to public/feed/
 *
 * Usage:
 *   node scripts/fetch-feeds.js
 *
 * Run nightly via cron:
 *   0 3 * * * cd /path/to/personal-site && node scripts/fetch-feeds.js
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { XMLParser } from "fast-xml-parser";
import https from "https";
import http from "http";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const FEED_DIR = path.join(ROOT, "public", "feed");
const CONFIG_PATH = path.join(ROOT, "config", "feeds.json");

const SITE_URL = process.env.SITE_URL ?? "https://yourdomain.com";
const SITE_TITLE = "RETRO_SPECT";
const AUTHOR = "Johannes Davidsson";
const MAX_ITEMS_PER_CATEGORY = 20;

// ─── HTTP fetch ────────────────────────────────────────────────────────────────

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith("https") ? https : http;
    const req = lib.get(url, { timeout: 10000 }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        req.destroy();
        resolve(fetchUrl(res.headers.location));
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        return;
      }
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    });
    req.on("error", reject);
    req.on("timeout", () => {
      req.destroy();
      reject(new Error(`Timeout fetching ${url}`));
    });
  });
}

// ─── XML parsing ──────────────────────────────────────────────────────────────

function parseItems(xml) {
  try {
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
    });
    const parsed = parser.parse(xml);

    // Handle RSS 2.0
    let items = [];
    if (parsed?.rss?.channel?.item) {
      const channel = parsed.rss.channel;
      items = Array.isArray(channel.item) ? channel.item : [channel.item];
      return items.map((item) => ({
        title: item.title ?? "",
        link: item.link ?? "",
        description: item.description ?? "",
        pubDate: item.pubDate ?? "",
        guid: item.guid ?? item.link ?? "",
      }));
    }

    // Handle Atom
    if (parsed?.feed?.entry) {
      const entries = Array.isArray(parsed.feed.entry)
        ? parsed.feed.entry
        : [parsed.feed.entry];
      return entries.map((entry) => ({
        title: entry.title ?? "",
        link: Array.isArray(entry.link)
          ? entry.link.find((l) => l["@_rel"] === "alternate")?.["@_href"] ?? entry.link[0]?.["@_href"] ?? ""
          : entry.link?.["@_href"] ?? "",
        description: entry.summary ?? entry.content ?? "",
        pubDate: entry.updated ?? entry.published ?? "",
        guid: entry.id ?? "",
      }));
    }

    return [];
  } catch (err) {
    console.warn(`  Parse error: ${err.message}`);
    return [];
  }
}

// ─── Build aggregated RSS ─────────────────────────────────────────────────────

function buildRSS(categoryLabel, items) {
  const channelItems = items
    .slice(0, MAX_ITEMS_PER_CATEGORY)
    .filter((i) => i.title && i.link)
    .map(
      (item) => `
    <item>
      <title><![CDATA[${item.title}]]></title>
      <link>${item.link}</link>
      <guid isPermaLink="false">${item.guid}</guid>
      <description><![CDATA[${stripHtml(item.description).slice(0, 500)}]]></description>
      <pubDate>${item.pubDate ? new Date(item.pubDate).toUTCString() : new Date().toUTCString()}</pubDate>
      <author>${AUTHOR}</author>
      <category>${categoryLabel}</category>
    </item>`
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_TITLE} — ${categoryLabel}</title>
    <link>${SITE_URL}</link>
    <description>Curated ${categoryLabel} news aggregated from trusted sources.</description>
    <language>en</language>
    <managingEditor>${AUTHOR}</managingEditor>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed/${categoryLabel.toLowerCase().replace(/\s+/g, "-")}.xml" rel="self" type="application/rss+xml"/>
    ${channelItems}
  </channel>
</rss>`;
}

function stripHtml(html) {
  return String(html ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  // Ensure output dir exists
  fs.mkdirSync(FEED_DIR, { recursive: true });

  const config = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));

  for (const [slug, catConfig] of Object.entries(config)) {
    console.log(`\n[${slug}] Fetching ${catConfig.sources.length} source(s)...`);

    const allItems = [];
    const seenGuids = new Set();

    for (const sourceUrl of catConfig.sources) {
      try {
        const xml = await fetchUrl(sourceUrl);
        const items = parseItems(xml);
        console.log(`  + ${sourceUrl}: ${items.length} items`);
        for (const item of items) {
          const key = item.guid || item.link;
          if (key && !seenGuids.has(key)) {
            seenGuids.add(key);
            allItems.push(item);
          }
        }
      } catch (err) {
        console.warn(`  ! ${sourceUrl}: ${err.message}`);
      }
    }

    // Sort newest first
    allItems.sort((a, b) => {
      const ta = new Date(a.pubDate).getTime() || 0;
      const tb = new Date(b.pubDate).getTime() || 0;
      return tb - ta;
    });

    const rss = buildRSS(catConfig.label, allItems);
    const outPath = path.join(FEED_DIR, `${slug}.xml`);
    fs.writeFileSync(outPath, rss, "utf8");
    console.log(`  -> Wrote ${outPath} (${allItems.length} items)`);
  }

  console.log("\nDone.");
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
