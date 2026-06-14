import { NextResponse } from "next/server";
import { readdir, stat } from "fs/promises";
import path from "path";
import { existsSync } from "fs";
import { readMeta } from "@/lib/media-meta";

function checkAuth(request: Request): boolean {
    const pwd = request.headers.get("x-admin-password");
    return pwd === process.env.ADMIN_PASSWORD;
}

export async function GET(request: Request) {
    if (!checkAuth(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const uploadDir = path.join(process.cwd(), "public", "uploads");
        if (!existsSync(uploadDir)) {
            return NextResponse.json({ files: [] });
        }

        const meta = await readMeta();
        const entries = await readdir(uploadDir);
        const files = await Promise.all(
            entries
                .filter((name) => !name.startsWith("_"))
                .map(async (name) => {
                    const full = path.join(uploadDir, name);
                    const s = await stat(full);
                    const isImage = /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(name);
                    const isVideo = /\.(mp4|webm|mov)$/i.test(name);
                    const m = meta[name];
                    return {
                        name,
                        url: `/uploads/${name}`,
                        type: isImage ? "image" : isVideo ? "video" : "other",
                        size: s.size,
                        createdAt: s.birthtime.toISOString(),
                        displayName: m?.displayName ?? name,
                        price: m?.price ?? 0,
                        category: m?.category ?? "",
                    };
                })
        );

        files.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        return NextResponse.json({ files });
    } catch (err) {
        console.error("List error:", err);
        return NextResponse.json({ error: "Failed to list media" }, { status: 500 });
    }
}
