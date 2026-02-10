import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { verifyCMSKey } from "@/app/(core)/utils/cmsSecurity";

/**
 * GET: List assets in a folder
 */
export async function GET(req) {
    const authHeader = req.headers.get("x-cms-secret");
    if (!verifyCMSKey(authHeader)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const folder = searchParams.get("folder");

    if (!folder) {
        return NextResponse.json({ error: "Folder is required" }, { status: 400 });
    }

    const folderPath = path.join(process.cwd(), "public", "WebSiteStaticImage", "html", folder);

    try {
        if (!fs.existsSync(folderPath)) {
            return NextResponse.json({ files: [] });
        }
        const files = fs.readdirSync(folderPath).map(file => {
            const stats = fs.statSync(path.join(folderPath, file));
            return {
                name: file,
                size: stats.size,
                isDir: stats.isDirectory()
            };
        });
        return NextResponse.json({ files });
    } catch (error) {
        return NextResponse.json({ error: "Failed to list assets" }, { status: 500 });
    }
}

/**
 * POST: Create a new file
 */
export async function POST(req) {
    const authHeader = req.headers.get("x-cms-secret");
    if (!verifyCMSKey(authHeader)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { folder, filename } = await req.json();
        if (!folder || !filename) {
            return NextResponse.json({ error: "Folder and filename are required" }, { status: 400 });
        }

        const filePath = path.join(process.cwd(), "public", "WebSiteStaticImage", "html", folder, filename);

        if (fs.existsSync(filePath)) {
            return NextResponse.json({ error: "File already exists" }, { status: 400 });
        }

        fs.writeFileSync(filePath, "<!-- New HTML File -->", "utf-8");
        return NextResponse.json({ message: "File created successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create file" }, { status: 500 });
    }
}

/**
 * DELETE: Remove a file
 */
export async function DELETE(req) {
    const authHeader = req.headers.get("x-cms-secret");
    if (!verifyCMSKey(authHeader)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const folder = searchParams.get("folder");
        const filename = searchParams.get("filename");

        if (!folder || !filename) {
            return NextResponse.json({ error: "Folder and filename are required" }, { status: 400 });
        }

        const filePath = path.join(process.cwd(), "public", "WebSiteStaticImage", "html", folder, filename);

        if (!fs.existsSync(filePath)) {
            return NextResponse.json({ error: "File not found" }, { status: 404 });
        }

        fs.unlinkSync(filePath);
        return NextResponse.json({ message: "File deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete file" }, { status: 500 });
    }
}
