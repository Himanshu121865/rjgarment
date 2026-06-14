import { NextResponse } from "next/server";
import { updateCloudinaryContext, FOLDER } from "@/lib/cloudinary";

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

        const publicId = `${FOLDER}/${filename}`;
        const context: Record<string, string> = {};
        if (displayName !== undefined) context.displayName = displayName;
        if (price !== undefined) context.price = String(price);
        if (category !== undefined) context.category = category;

        await updateCloudinaryContext(publicId, context);

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("Meta update error:", err);
        return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }
}
