import { NextResponse } from "next/server";
import { listCloudinaryResources, FOLDER } from "@/lib/cloudinary";

function checkAuth(request: Request): boolean {
    const pwd = request.headers.get("x-admin-password");
    return pwd === process.env.ADMIN_PASSWORD;
}

export async function GET(request: Request) {
    if (!checkAuth(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const resources = await listCloudinaryResources();

        const files = resources.map((r) => {
            const key = r.public_id.replace(`${FOLDER}/`, '');
            const ctx = r.context || {};
            return {
                name: key,
                url: r.url,
                type: r.type,
                size: r.size,
                createdAt: r.createdAt,
                displayName: ctx.displayName ?? r.filename,
                price: ctx.price ? parseFloat(ctx.price) : 0,
                category: ctx.category ?? "",
            };
        });

        return NextResponse.json({ files });
    } catch (err) {
        console.error("List error:", err);
        return NextResponse.json({ error: "Failed to list media" }, { status: 500 });
    }
}
