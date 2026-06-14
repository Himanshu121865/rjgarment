import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { ensureUploadDir, readMeta, writeMeta, defaultDisplayName } from "@/lib/media-meta";

const ALLOWED_IMAGES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const ALLOWED_VIDEOS = ["video/mp4", "video/webm", "video/quicktime"];
const ALLOWED = [...ALLOWED_IMAGES, ...ALLOWED_VIDEOS];
const MAX_SIZE = 50 * 1024 * 1024;

function checkAuth(request: Request): boolean {
    const pwd = request.headers.get("x-admin-password");
    return pwd === process.env.ADMIN_PASSWORD;
}

export async function POST(request: Request) {
    if (!checkAuth(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const formData = await request.formData();
        const files = formData.getAll("files") as File[];

        if (!files.length) {
            return NextResponse.json({ error: "No files provided" }, { status: 400 });
        }

        await ensureUploadDir();
        const uploadDir = path.join(process.cwd(), "public", "uploads");
        const meta = await readMeta();

        const uploaded: { name: string; url: string; type: string; size: number }[] = [];

        for (const file of files) {
            if (!ALLOWED.includes(file.type)) continue;
            if (file.size > MAX_SIZE) continue;

            const ext = file.name.split(".").pop();
            const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
            const buffer = Buffer.from(await file.arrayBuffer());
            await writeFile(path.join(uploadDir, unique), buffer);

            meta[unique] = {
                displayName: defaultDisplayName(file.name),
                price: 0,
                category: "",
            };

            uploaded.push({
                name: unique,
                url: `/uploads/${unique}`,
                type: file.type,
                size: file.size,
            });
        }

        await writeMeta(meta);
        return NextResponse.json({ files: uploaded });
    } catch (err) {
        console.error("Upload error:", err);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
