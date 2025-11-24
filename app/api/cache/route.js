import { NextResponse } from "next/server";
import { getCache, setCache } from "@/app/(core)/cache_utility/serverCache";

export async function POST(req) {
  try {
    const { key, data } = await req.json();

    if (!key || !data) {
      return NextResponse.json({ error: "Missing key or data" }, { status: 400 });
    }

    await setCache(key, data);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ Album POST error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key");

    if (!key) {
      return NextResponse.json({ error: "Missing key" }, { status: 400 });
    }

    const cachedData = await getCache(key);
    if (!cachedData) {
      return NextResponse.json({ cached: false, data: null });
    }

    return NextResponse.json({ cached: true, data: cachedData });
  } catch (err) {
    console.error("❌ Album GET error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
