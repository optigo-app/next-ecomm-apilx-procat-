import { NextResponse } from "next/server";
import { clearAllCache } from "@/app/(core)/cache_utility/serverCache";
import { revalidateStoreInit } from "@/app/(core)/cache_utility/storeInitCache";
import { fetchStoreInitData } from "@/app/(core)/utils/fetchStoreInit";
import { NEXT_APP_WEB } from "@/app/(core)/utils/env";
import { SyncProcatTheme, updateColorThemeFile } from "@/app/(core)/utils/API/PickThemePlattee";

async function executeClearAndRebuildCache(req) {
  const host = req.headers.get("host") || "";
  const logs = [];

  // 1. Clear server cache directory (.next_cache, menu, album cache & cache index)
  logs.push("Purging server-side cache directories (.next_cache, menu, album caches)...");
  await clearAllCache();
  logs.push("Server cache directory & album cache purged successfully.");

  // 2. Revalidate and rebuild storeInit data
  logs.push("Rebuilding storeInit cache from upstream API...");
  let storeInit = null;
  try {
    storeInit = await revalidateStoreInit(host);
    logs.push("StoreInit cache revalidated and updated on disk.");
  } catch (err) {
    logs.push(`Warning: revalidateStoreInit fallback — ${err?.message || err}`);
    const data = await fetchStoreInitData(NEXT_APP_WEB);
    storeInit = data?.rd?.[0] || {};
  }

  // 3. Sync and update theme styling palette if applicable
  let styleUpdated = false;
  const storeInitData = storeInit?.rd?.[0] || storeInit || {};
  if (storeInitData?.domain && storeInitData?.YearCode) {
    try {
      logs.push(`Syncing theme palette for domain ${storeInitData.domain} (YearCode: ${storeInitData.YearCode})...`);
      const styleContent = await SyncProcatTheme({
        domainName: storeInitData.domain,
        yearCode: storeInitData.YearCode,
      });

      if (styleContent) {
        await updateColorThemeFile({
          host,
          styleContent,
          storeInitData,
        });
        styleUpdated = true;
        logs.push("Theme color palette updated successfully.");
      }
    } catch (styleErr) {
      logs.push(`Warning: Theme sync error — ${styleErr?.message || styleErr}`);
    }
  }

  return {
    success: true,
    message: "All caches successfully cleared and rebuilt.",
    timestamp: new Date().toISOString(),
    details: {
      serverCacheCleared: true,
      storeInitRebuilt: true,
      styleUpdated,
      fileCreateDate: storeInitData?.FileCreateDate || null,
    },
    logs,
  };
}

export async function GET(req) {
  try {
    const result = await executeClearAndRebuildCache(req);
    return NextResponse.json(result, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "X-Robots-Tag": "noindex, nofollow",
      },
    });
  } catch (err) {
    console.error("❌ /api/clear-cache GET error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to clear and rebuild cache", details: err?.message || String(err) },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "no-store",
        },
      }
    );
  }
}

export async function POST(req) {
  try {
    const result = await executeClearAndRebuildCache(req);
    return NextResponse.json(result, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "X-Robots-Tag": "noindex, nofollow",
      },
    });
  } catch (err) {
    console.error("❌ /api/clear-cache POST error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to clear and rebuild cache", details: err?.message || String(err) },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "no-store",
        },
      }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
      "Access-Control-Max-Age": "86400",
    },
  });
}
