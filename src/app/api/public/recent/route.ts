import { NextRequest, NextResponse } from "next/server";
import { listCloudinaryResources, FOLDER } from "@/lib/cloudinary";

const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

export async function GET(req: NextRequest) {
    try {
        const resources = await listCloudinaryResources();

        const now = Date.now();

        const files = resources.map((r) => {
            const key = r.public_id.replace(`${FOLDER}/`, '');
            const ctx = r.context || {};
            const createdAt = r.createdAt;
            const age = now - new Date(createdAt).getTime();
            return {
                name: key,
                url: r.url,
                type: r.type,
                size: r.size,
                createdAt,
                age,
                displayName: ctx.displayName ?? null,
                price: ctx.price ? parseFloat(ctx.price) : null,
                category: ctx.category ?? null,
            };
        });

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
