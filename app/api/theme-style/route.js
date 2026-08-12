import { NextResponse } from "next/server";
import { getStaticHtmlPages } from "@/app/(core)/utils/StaticFileGetter";
import fs from "fs";
import path from "path";

// ─── Server-side in-memory cache (per domain) ─────────────────────────────────
// Keyed by hostname: Map<host, { content: string, mtimeMs: number }>
const _styleCache = new Map();

async function getStyleForHost(host) {
  const ht = await getStaticHtmlPages(host);
  const filePath = path.join(process.cwd(), ht.pages.styleContent);

  if (!fs.existsSync(filePath)) {
    _styleCache.delete(host);
    return "/* Style file not found */";
  }

  const stat = await fs.promises.stat(filePath);
  const mtimeMs = stat.mtimeMs;

  // Return cached content if file has not been modified/recreated
  const cached = _styleCache.get(host);
  if (cached && cached.mtimeMs === mtimeMs) {
    return cached.content;
  }

  // Re-read file content when created/modified timestamp changes
  const styleContent = await fs.promises.readFile(filePath, "utf-8");
  _styleCache.set(host, { content: styleContent, mtimeMs });
  console.log(`🎨 [THEME STYLE UPDATED/CACHED] ${host} → ${ht.pages.styleContent} (mtime: ${mtimeMs})`);
  return styleContent;
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const host = searchParams.get("host") || "";

    const styleContent = await getStyleForHost(host);

    return new NextResponse(styleContent, {
      headers: {
        "Content-Type": "text/css; charset=utf-8",
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
      },
    });
  } catch (error) {
    console.error("Error in theme-style API:", error);
    return new NextResponse("/* Error loading styles */", {
      headers: {
        "Content-Type": "text/css",
        "Cache-Control": "no-store",
      },
    });
  }
}
