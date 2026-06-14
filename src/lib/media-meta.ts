import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

export interface FileMeta {
    displayName: string;
    price: number;
    category: string;
}

export type MediaMeta = Record<string, FileMeta>;

function metaPath(): string {
    return path.join(process.cwd(), "public", "uploads", "_meta.json");
}

function uploadDir(): string {
    return path.join(process.cwd(), "public", "uploads");
}

export async function ensureUploadDir(): Promise<void> {
    const dir = uploadDir();
    if (!existsSync(dir)) {
        await mkdir(dir, { recursive: true });
    }
}

export async function readMeta(): Promise<MediaMeta> {
    await ensureUploadDir();
    const fp = metaPath();
    if (!existsSync(fp)) {
        await writeFile(fp, JSON.stringify({}), "utf-8");
        return {};
    }
    try {
        const raw = await readFile(fp, "utf-8");
        return JSON.parse(raw);
    } catch {
        return {};
    }
}

export async function writeMeta(meta: MediaMeta): Promise<void> {
    await ensureUploadDir();
    await writeFile(metaPath(), JSON.stringify(meta, null, 2), "utf-8");
}

export function defaultDisplayName(filename: string): string {
    return filename
        .replace(/^\d+-[a-z0-9]+\./, "")
        .replace(/\.(jpg|jpeg|png|webp|gif|mp4|webm|mov)$/i, "")
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
}
