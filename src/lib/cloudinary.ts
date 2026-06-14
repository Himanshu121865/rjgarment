import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const FOLDER = 'rjgarment';

export interface CloudinaryResource {
    public_id: string;
    url: string;
    type: 'image' | 'video' | 'other';
    size: number;
    createdAt: string;
    filename: string;
    context?: Record<string, string>;
}

function parseContext(r: any): Record<string, string> | undefined {
    const c = r?.context?.custom;
    return c && typeof c === 'object' ? c as Record<string, string> : undefined;
}

export async function uploadToCloudinary(
    buffer: Buffer,
    filename: string,
    mimetype: string,
    metadata?: { displayName: string; price: number; category: string },
): Promise<CloudinaryResource> {
    const publicId = `${FOLDER}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const dataUri = `data:${mimetype};base64,${buffer.toString('base64')}`;
    const result = await cloudinary.uploader.upload(dataUri, {
        public_id: publicId,
        resource_type: mimetype.startsWith('video') ? 'video' : 'image',
        context: metadata ? {
            displayName: metadata.displayName,
            price: String(metadata.price),
            category: metadata.category,
        } : undefined,
    });
    const isVideo = mimetype.startsWith('video');
    return {
        public_id: result.public_id,
        url: result.secure_url,
        type: isVideo ? 'video' : 'image',
        size: result.bytes,
        createdAt: result.created_at,
        filename,
        context: parseContext(result),
    };
}

export async function listCloudinaryResources(): Promise<CloudinaryResource[]> {
    const resources: CloudinaryResource[] = [];
    let nextCursor: string | undefined;

    do {
        const result = await cloudinary.api.resources({
            type: 'upload',
            prefix: `${FOLDER}/`,
            max_results: 500,
            next_cursor: nextCursor,
            context: true,
        });
        for (const r of result.resources) {
            const isVideo = r.resource_type === 'video';
            resources.push({
                public_id: r.public_id,
                url: r.secure_url,
                type: isVideo ? 'video' : 'image',
                size: r.bytes,
                createdAt: r.created_at,
                filename: r.public_id.split('/').pop() || '',
                context: parseContext(r),
            });
        }
        nextCursor = result.next_cursor;
    } while (nextCursor);

    resources.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return resources;
}

export async function updateCloudinaryContext(
    publicId: string,
    context: Record<string, string>,
): Promise<void> {
    await cloudinary.uploader.explicit(publicId, {
        type: 'upload',
        context,
    });
}

export async function deleteCloudinaryResource(publicId: string): Promise<void> {
    await cloudinary.api.delete_resources([publicId]);
}

export function cloudinaryUrl(publicId: string): string {
    return `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${publicId}`;
}

export function defaultDisplayName(filename: string): string {
    return filename
        .replace(/^\d+-[a-z0-9]+\./, "")
        .replace(/\.(jpg|jpeg|png|webp|gif|mp4|webm|mov)$/i, "")
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
}
