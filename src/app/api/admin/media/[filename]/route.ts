import { NextResponse } from "next/server";
import { unlink } from "fs/promises";
import path from "path";
import { readMeta, writeMeta } from "@/lib/media-meta";

const ALLOWED_EXT = /\.(jpg|jpeg|png|webp|gif|mp4|webm|mov)$/i;

function checkAuth(request: Request): boolean {
    const pwd = request.headers.get("x-admin-password");
    return pwd === process.env.ADMIN_PASSWORD;
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ filename: string }> }
) {
    if (!checkAuth(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { filename } = await params;

        if (!ALLOWED_EXT.test(filename)) {
            return NextResponse.json({ error: "Invalid file" }, { status: 400 });
        }

        const filePath = path.join(process.cwd(), "public", "uploads", filename);
        await unlink(filePath);

        const meta = await readMeta();
        delete meta[filename];
        await writeMeta(meta);

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("Delete error:", err);
        return NextResponse.json({ error: "Delete failed" }, { status: 500 });
    }
}
