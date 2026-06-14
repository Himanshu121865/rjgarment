import { NextResponse } from "next/server";
import { deleteCloudinaryResource, FOLDER } from "@/lib/cloudinary";

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
        const publicId = `${FOLDER}/${filename}`;

        await deleteCloudinaryResource(publicId);

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("Delete error:", err);
        return NextResponse.json({ error: "Delete failed" }, { status: 500 });
    }
}
