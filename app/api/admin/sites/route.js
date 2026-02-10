import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { verifyCMSKey } from "@/app/(core)/utils/cmsSecurity";

const SITES_PATH = path.join(process.cwd(), "app", "(core)", "config", "sites.json");

/**
 * GET: Fetch all sites
 */
export async function GET(req) {
    const authHeader = req.headers.get("x-cms-secret");
    if (!verifyCMSKey(authHeader)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const data = JSON.parse(fs.readFileSync(SITES_PATH, "utf-8"));
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: "Failed to read sites" }, { status: 500 });
    }
}

/**
 * POST: Create or Update a site
 */
export async function POST(req) {
    const authHeader = req.headers.get("x-cms-secret");
    if (!verifyCMSKey(authHeader)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { sites } = JSON.parse(fs.readFileSync(SITES_PATH, "utf-8"));

        const existingIndex = sites.findIndex(s => s.id === body.id);
        if (existingIndex > -1) {
            sites[existingIndex] = { ...sites[existingIndex], ...body };
        } else {
            sites.push(body);
        }

        fs.writeFileSync(SITES_PATH, JSON.stringify({ sites }, null, 2));

        // Ensure folder existence
        const folderPath = path.join(process.cwd(), "public", "WebSiteStaticImage", "html", body.folder);
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }

        return NextResponse.json({ message: "Site updated successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update site" }, { status: 500 });
    }
}
