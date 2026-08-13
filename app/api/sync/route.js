import { NextResponse } from "next/server";
import { clearAllCache } from "@/app/(core)/cache_utility/serverCache";
import { fetchStoreInitData } from "@/app/(core)/utils/fetchStoreInit";
import { NEXT_APP_WEB } from "@/app/(core)/utils/env";
import { SyncProcatTheme, updateColorThemeFile } from "@/app/(core)/utils/API/PickThemePlattee";

export async function GET(req) {
  try {
    // 1. Clear server cache
    const cacheRes = await clearAllCache();
    console.log("Cache cleared:", cacheRes);

    // 2. Sync Store Init data
    const host = req.headers.get("host") || "";
    const storeName = NEXT_APP_WEB;
    const data = await fetchStoreInitData(storeName);
    const storeInit = data?.rd?.[0] || {};

    // 3. Sync & Update Style Content (Theme Palette)
    let styleUpdated = false;
    if (storeInit?.domain && storeInit?.YearCode) {
      try {
        const styleContent = await SyncProcatTheme({
          domainName: storeInit.domain,
          yearCode: storeInit.YearCode,
        });

        if (styleContent) {
          await updateColorThemeFile({
            host,
            styleContent,
            storeInitData: storeInit,
          });
          styleUpdated = true;
        }
      } catch (styleErr) {
        console.error("⚠️ Style content update error in sync API:", styleErr);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Cache cleared, storeInit synced, and style content updated successfully",
        cacheCleared: true,
        storeInitSynced: !!data,
        styleUpdated,
        FileCreateDate : storeInit?.FileCreateDate,
      },
      {
        headers: {
          "X-Robots-Tag": "noindex, nofollow",
        },
      }
    );
  } catch (err) {
    console.error("❌ Sync API error:", err);
    return NextResponse.json(
      { error: "Failed to perform sync operation", details: err?.message || String(err) },
      {
        status: 500,
        headers: {
          "X-Robots-Tag": "noindex, nofollow",
        },
      }
    );
  }
}

