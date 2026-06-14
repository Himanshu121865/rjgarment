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
}

export async function uploadToCloudinary(
    buffer: Buffer,
    filename: string,
    mimetype: string,
): Promise<CloudinaryResource> {
    return new Promise((resolve, reject) => {
        const publicId = `${FOLDER}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                public_id: publicId,
                resource_type: mimetype.startsWith('video') ? 'video' : 'image',
            },
            (err, result) => {
                if (err || !result) return reject(err || new Error('Upload failed'));
                const isVideo = mimetype.startsWith('video');
                resolve({
                    public_id: result.public_id,
                    url: result.secure_url,
                    type: isVideo ? 'video' : 'image',
                    size: result.bytes,
                    createdAt: result.created_at,
                    filename: filename,
                });
            },
        );
        uploadStream.end(buffer);
    });
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
            });
        }
        nextCursor = result.next_cursor;
    } while (nextCursor);

    resources.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return resources;
}

export async function deleteCloudinaryResource(publicId: string): Promise<void> {
    await cloudinary.api.delete_resources([publicId]);
}

export function cloudinaryUrl(publicId: string): string {
    return `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${publicId}`;
}
