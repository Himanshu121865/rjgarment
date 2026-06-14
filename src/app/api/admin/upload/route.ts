import { NextResponse } from "next/server";
import { readMeta, writeMeta, defaultDisplayName } from "@/lib/media-meta";
import { uploadToCloudinary, FOLDER } from "@/lib/cloudinary";

const ALLOWED_IMAGES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
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

        const meta = await readMeta();
        const uploaded: { name: string; url: string; type: string; size: number }[] = [];

        for (const file of files) {
            if (!ALLOWED.includes(file.type)) continue;
            if (file.size > MAX_SIZE) continue;

            const buffer = Buffer.from(await file.arrayBuffer());
            const resource = await uploadToCloudinary(buffer, file.name, file.type);
            const key = resource.public_id.replace(`${FOLDER}/`, '');

            meta[key] = {
                displayName: defaultDisplayName(file.name),
                price: 0,
                category: "",
            };

            uploaded.push({
                name: key,
                url: resource.url,
                type: file.type,
                size: file.size,
            });
        }

        await writeMeta(meta);
        return NextResponse.json({ files: uploaded });
    } catch (err) {
        console.error("Upload error:", err);
        const msg = err instanceof Error ? err.message : "Upload failed";
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}
