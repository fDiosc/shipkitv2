import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Dynamic import to avoid issues when BLOB token is not set
const isProductionUpload = !!process.env.BLOB_READ_WRITE_TOKEN;

export async function POST(request: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // Validate file type
        const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 });
        }

        // Production mode: Use Vercel Blob
        if (isProductionUpload) {
            const { put } = await import("@vercel/blob");

            const ext = file.name.split('.').pop() || 'png';
            const filename = `demos/${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

            const blob = await put(filename, file, {
                access: "public",
                addRandomSuffix: false,
            });

            return NextResponse.json({
                url: blob.url,
                width: null,
                height: null,
                mode: "blob",
            });
        }

        // Development mode: Convert to base64 data URL
        const buffer = await file.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');
        const dataUrl = `data:${file.type};base64,${base64}`;

        return NextResponse.json({
            url: dataUrl,
            width: null,
            height: null,
            mode: "base64",
        });

    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}

// Route segment config for larger body sizes
export const runtime = "nodejs";
export const maxDuration = 30;

