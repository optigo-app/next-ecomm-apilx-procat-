import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const SECRET_HEADER = "x-cms-secret";

// Helper to validate and resolve path
const resolveSafePath = (requestedPath) => {
    const root = process.cwd();
    const safePath = path.resolve(root, requestedPath).replace(/\\/g, '/'); // Normalize for Windows
    const normalizedRoot = root.replace(/\\/g, '/');

    // Prevent path traversal
    if (!safePath.startsWith(normalizedRoot)) {
        throw new Error("Invalid path");
    }

    // Restrict access to 'app' and 'public' strictly
    const relative = safePath.replace(normalizedRoot, '');
    const isRoot = relative === '' || relative === '/';

    // If root, we only allow listing specific folders manually in the handler
    if (isRoot) return { path: safePath, isRoot: true };

    const allowedPrefixes = ['/app', '/public'];
    const isAllowed = allowedPrefixes.some(prefix => relative.startsWith(prefix));

    if (!isAllowed) {
        throw new Error("Access denied: Only 'app' and 'public' directories are accessible.");
    }

    return { path: safePath, isRoot: false };
};

export async function GET(req) {
    const secret = req.headers.get(SECRET_HEADER);

    if (!secret) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const mode = searchParams.get("type"); // 'list' or 'content'
    const queryPath = searchParams.get("path") || "";

    try {
        const { path: fullPath, isRoot } = resolveSafePath(queryPath);

        if (mode === "list") {
            if (isRoot) {
                // Manually return app and public
                return NextResponse.json([
                    { name: "app", type: "dir" },
                    { name: "public", type: "dir" }
                ]);
            }

            if (!fs.existsSync(fullPath)) {
                return NextResponse.json({ error: "Path not found" }, { status: 404 });
            }

            const stats = fs.statSync(fullPath);
            if (!stats.isDirectory()) {
                return NextResponse.json({ error: "Not a directory" }, { status: 400 });
            }

            const items = fs.readdirSync(fullPath, { withFileTypes: true });
            const result = items.map(item => ({
                name: item.name,
                type: item.isDirectory() ? "dir" : "file"
            }));
            return NextResponse.json(result);
        }

        if (mode === "content") {
            if (isRoot) return NextResponse.json({ error: "Cannot read root" }, { status: 400 });

            if (!fs.existsSync(fullPath)) {
                return NextResponse.json({ error: "File not found" }, { status: 404 });
            }

            const stats = fs.statSync(fullPath);
            if (stats.isDirectory()) {
                return NextResponse.json({ error: "Cannot read directory content" }, { status: 400 });
            }

            const content = fs.readFileSync(fullPath, "utf-8");
            return NextResponse.json({ content });
        }

        return NextResponse.json({ error: "Invalid mode" }, { status: 400 });

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    const secret = req.headers.get(SECRET_HEADER);
    if (!secret) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { path: queryPath, content } = body;

        if (!queryPath) return NextResponse.json({ error: "Path required" }, { status: 400 });

        const { path: fullPath, isRoot } = resolveSafePath(queryPath);

        if (isRoot) return NextResponse.json({ error: "Cannot write to root" }, { status: 403 });

        // Ensure we are writing to an existing file or creating one in a valid dir?
        // For safety, let's allow writing.
        fs.writeFileSync(fullPath, content, "utf-8");

        return NextResponse.json({ message: "File saved successfully" });

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
