import { NextRequest, NextResponse } from "next/server";
import { readdir, stat } from "fs/promises";
import path from "path";
import { existsSync } from "fs";
import { readMeta } from "@/lib/media-meta";

const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

export async function GET(req: NextRequest) {
    try {
        const uploadDir = path.join(process.cwd(), "public", "uploads");
        if (!existsSync(uploadDir)) {
            return NextResponse.json({ files: [] });
        }

        const meta = await readMeta();
        const entries = await readdir(uploadDir);
        const now = Date.now();

        const files = await Promise.all(
            entries
                .filter((name) => !name.startsWith("_"))
                .map(async (name) => {
                    const full = path.join(uploadDir, name);
                    const s = await stat(full);
                    const age = now - s.mtimeMs;
                    const isImage = /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(name);
                    const isVideo = /\.(mp4|webm|mov)$/i.test(name);
                    const m = meta[name];
                    return {
                        name,
                        url: `/uploads/${name}`,
                        type: isImage ? "image" : isVideo ? "video" : "other",
                        createdAt: s.mtime.toISOString(),
                        age,
                        displayName: m?.displayName ?? null,
                        price: m?.price ?? null,
                        category: m?.category ?? null,
                    };
                })
        );

        const { searchParams } = new URL(req.url);
        const older = searchParams.get("older") === "true";

        const filtered = files
            .filter((f) => f.type !== "other")
            .filter((f) => older ? f.age >= SEVEN_DAYS : f.age < SEVEN_DAYS)
            .sort((a, b) => a.age - b.age);

        return NextResponse.json({ files: filtered });
    } catch (err) {
        console.error("Recent list error:", err);
        return NextResponse.json({ error: "Failed" }, { status: 500 });
    }
}
