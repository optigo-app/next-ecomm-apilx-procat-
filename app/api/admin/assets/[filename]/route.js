import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { verifyCMSKey } from "@/app/(core)/utils/cmsSecurity";

/**
 * GET: Read asset content
 */
export async function GET(req, { params }) {
    const authHeader = req.headers.get("x-cms-secret");
    if (!verifyCMSKey(authHeader)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { filename } = await params;
    const { searchParams } = new URL(req.url);
    const folder = searchParams.get("folder");

    if (!folder) {
        return NextResponse.json({ error: "Folder is required" }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), "public", "WebSiteStaticImage", "html", folder, filename);

    try {
        if (!fs.existsSync(filePath)) {
            return NextResponse.json({ error: "File not found" }, { status: 404 });
        }
        const content = fs.readFileSync(filePath, "utf-8");
        return NextResponse.json({ content });
    } catch (error) {
        return NextResponse.json({ error: "Failed to read file" }, { status: 500 });
    }
}

/**
 * PUT/POST: Update or Create asset content
 */
export async function POST(req, { params }) {
    const authHeader = req.headers.get("x-cms-secret");
    if (!verifyCMSKey(authHeader)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { filename } = await params;
    const { searchParams } = new URL(req.url);
    const folder = searchParams.get("folder");

    if (!folder) {
        return NextResponse.json({ error: "Folder is required" }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), "public", "WebSiteStaticImage", "html", folder, filename);

    try {
        const { content } = await req.json();
        fs.writeFileSync(filePath, content, "utf-8");
        return NextResponse.json({ message: "File saved successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to save file" }, { status: 500 });
    }
}
