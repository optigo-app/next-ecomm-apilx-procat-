import { NextResponse } from "next/server";
import { clearAllCache } from "@/app/(core)/cache_utility/serverCache";

export async function GET(req) {
  try {
    const res = await clearAllCache()
    console.log("res", res)
    return NextResponse.redirect(new URL("/", req.url));
  } catch (err) {
    console.error("❌ Cache clear error:", err);
    return NextResponse.json({ error: "Failed to clear cache" }, { status: 500 });
  }
}
