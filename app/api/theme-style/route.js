import { NextResponse } from "next/server";
import { getStaticHtmlPages } from "@/app/(core)/utils/StaticFileGetter";
import fs from "fs";
import path from "path";

// ─── Server-side in-memory cache (per domain) ─────────────────────────────────
// Keyed by hostname. Cleared on process restart (i.e. new deployment).
// This means each domain's CSS is read from disk at most ONCE per server lifetime.
const _styleCache = new Map(); // Map<host, string>

async function getStyleForHost(host) {
  // Return from memory if already loaded for this host.
  if (_styleCache.has(host)) {
    return _styleCache.get(host);
  }

  const ht = await getStaticHtmlPages(host);
  const filePath = path.join(process.cwd(), ht.pages.styleContent);

  if (!fs.existsSync(filePath)) {
    _styleCache.set(host, "/* Style file not found */");
    return _styleCache.get(host);
  }

  const styleContent = await fs.promises.readFile(filePath, "utf-8");
  _styleCache.set(host, styleContent);
  console.log(`🎨 [THEME STYLE CACHED] ${host} → ${ht.pages.styleContent}`);
  return styleContent;
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const host = searchParams.get("host") || "";
    const version = searchParams.get("v") || "";

    const styleContent = await getStyleForHost(host);

    // If a version token (?v=TOKEN) is present, the URL is content-addressed —
    // safe to cache for a very long time in the browser (1 year).
    // Without a version token, use a shorter cache to avoid stale styles.
    const cacheControl = version
      ? "public, max-age=31536000, immutable"       // 1 year — browser won't re-request until token changes
      : "public, max-age=3600, stale-while-revalidate=600"; // 1 hour fallback

    return new NextResponse(styleContent, {
      headers: {
        "Content-Type": "text/css; charset=utf-8",
        "Cache-Control": cacheControl,
        ...(version ? { "ETag": `"${version}"` } : {}),
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
