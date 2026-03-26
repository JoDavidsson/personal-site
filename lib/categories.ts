// Client-safe: no Node.js imports
export type Category =
  | "retail"
  | "robotics"
  | "ai"
  | "spatial-computing"
  | "computer-vision-retail";

export interface CategoryDef {
  slug: Category;
  label: string;
  rssPath: string;
}

export const CATEGORIES: CategoryDef[] = [
  { slug: "retail",                 label: "Retail",                 rssPath: "/feed/retail" },
  { slug: "robotics",               label: "Robotics",               rssPath: "/feed/robotics" },
  { slug: "ai",                     label: "AI",                     rssPath: "/feed/ai" },
  { slug: "spatial-computing",      label: "Spatial Computing",      rssPath: "/feed/spatial-computing" },
  { slug: "computer-vision-retail", label: "Computer Vision Retail", rssPath: "/feed/computer-vision-retail" },
];
