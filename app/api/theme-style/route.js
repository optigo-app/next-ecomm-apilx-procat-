import { NextResponse } from "next/server";
import { getStaticHtmlPages } from "@/app/(core)/utils/StaticFileGetter";
import fs from "fs";
import path from "path";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    console.log(searchParams, "searchParams")
    const host = searchParams.get("host") || "";
    const ht = await getStaticHtmlPages(host);
    const filePath = path.join(process.cwd(), ht.pages.styleContent);

    if (!fs.existsSync(filePath)) {
      return new NextResponse("/* Style file not found */", {
        headers: { "Content-Type": "text/css" },
      });
    }

    const styleContent = await fs.promises.readFile(filePath, "utf-8");

    return new NextResponse(styleContent, {
      headers: {
        "Content-Type": "text/css",
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("Error in theme-style API:", error);
    return new NextResponse("/* Error loading styles */", {
      headers: { "Content-Type": "text/css" },
    });
  }
}
