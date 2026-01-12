import { db } from "@/db";
import { demos, demoRevisions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { EmbedPlayer } from "./EmbedPlayer";

interface EmbedPageProps {
    params: Promise<{ publicId: string }>;
    searchParams: Promise<{
        theme?: string;
        hideBranding?: string;
        autoplay?: string;
    }>;
}

// Type for revision content snapshot
interface RevisionContent {
    screens: Array<{
        id: string;
        order: number;
        imageUrl: string;
        hotspots: Array<{
            id: string;
            type: string | null;
            targetScreenId: string | null;
            x: number;
            y: number;
            w: number;
            h: number;
            label: string | null;
            tooltipText: string | null;
            arrowPosition?: string | null;
            offsetX?: number | null;
            offsetY?: number | null;
            orderInScreen?: number | null;
        }>;
    }>;
    steps: Array<{
        id: string;
        order: number;
        screenId: string;
        hotspotId: string | null;
        title: string | null;
        body: string | null;
        placement: string | null;
    }>;
    settings: {
        showBranding?: boolean | null;
        name?: string;
        description?: string | null;
    };
}

async function getPublicDemo(publicId: string) {
    const demo = await db.query.demos.findFirst({
        where: eq(demos.publicId, publicId),
    });

    if (!demo || demo.status !== "published" || !demo.currentRevisionId) {
        return null;
    }

    const revision = await db.query.demoRevisions.findFirst({
        where: eq(demoRevisions.id, demo.currentRevisionId),
    });

    if (!revision) {
        return null;
    }

    return {
        demo,
        content: revision.content as RevisionContent,
    };
}

export async function generateMetadata({ params }: EmbedPageProps) {
    const { publicId } = await params;
    const result = await getPublicDemo(publicId);

    if (!result) {
        return { title: "Demo Not Found" };
    }

    return {
        title: result.content.settings?.name || result.demo.name,
        description: result.content.settings?.description || "Interactive product demo",
        robots: "noindex, nofollow",
    };
}

export default async function EmbedDemoPage({ params, searchParams }: EmbedPageProps) {
    const { publicId } = await params;
    const { hideBranding, autoplay } = await searchParams;

    const result = await getPublicDemo(publicId);

    if (!result) {
        notFound();
    }

    const { demo, content } = result;
    const showBranding = hideBranding !== "true" && content.settings?.showBranding !== false;

    return (
        <EmbedPlayer
            demoId={demo.id}
            publicId={publicId}
            screens={content.screens.map(s => ({
                id: s.id,
                order: s.order,
                imageUrl: s.imageUrl,
                hotspots: s.hotspots.map(h => ({
                    id: h.id,
                    type: h.type,
                    targetScreenId: h.targetScreenId,
                    x: h.x,
                    y: h.y,
                    w: h.w,
                    h: h.h,
                    label: h.label,
                    tooltipText: h.tooltipText,
                    arrowPosition: h.arrowPosition,
                    offsetX: h.offsetX,
                    offsetY: h.offsetY,
                    orderInScreen: h.orderInScreen,
                })),
            }))}
            steps={content.steps.map(s => ({
                id: s.id,
                order: s.order,
                screenId: s.screenId,
                hotspotId: s.hotspotId,
                title: s.title,
                body: s.body,
                placement: s.placement,
            }))}
            showBranding={showBranding}
            autoplay={autoplay === "true"}
        />
    );
}

