import { NextResponse } from "next/server";
import { readMeta, writeMeta } from "@/lib/media-meta";

function checkAuth(request: Request): boolean {
    const pwd = request.headers.get("x-admin-password");
    return pwd === process.env.ADMIN_PASSWORD;
}

export async function PUT(request: Request) {
    if (!checkAuth(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { filename, displayName, price, category } = body;

        if (!filename) {
            return NextResponse.json({ error: "filename required" }, { status: 400 });
        }

        const meta = await readMeta();

        if (!meta[filename]) {
            return NextResponse.json({ error: "File not found in metadata" }, { status: 404 });
        }

        if (displayName !== undefined) meta[filename].displayName = displayName;
        if (price !== undefined) meta[filename].price = price;
        if (category !== undefined) meta[filename].category = category;

        await writeMeta(meta);

        return NextResponse.json({ success: true, meta: meta[filename] });
    } catch (err) {
        console.error("Meta update error:", err);
        return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }
}
