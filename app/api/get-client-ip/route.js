import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    // Extract IP from common proxy & CDN headers
    const forwardedFor = req.headers.get("x-forwarded-for");
    let ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "";

    if (!ip) {
      ip =
        req.headers.get("x-real-ip") ||
        req.headers.get("cf-connecting-ip") ||
        req.headers.get("x-client-ip") ||
        "";
    }

    // Clean IPv6 mapped IPv4 address (e.g. ::ffff:127.0.0.1 -> 127.0.0.1)
    if (ip.startsWith("::ffff:")) {
      ip = ip.replace("::ffff:", "");
    }

    return NextResponse.json(
      { ip: ip || "127.0.0.1" },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error("Error in get-client-ip API:", error);
    return NextResponse.json({ ip: "127.0.0.1" }, { status: 200 });
  }
}
