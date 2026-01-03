import { db } from "@/db";
import { landings, profiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { PublicRenderer } from "@/components/editor/PublicRenderer";

export default async function PublicLandingPage({
    params
}: {
    params: Promise<{ subdomain: string }>
}) {
    const { subdomain } = await params;

    const landing = await db.query.landings.findFirst({
        where: eq(landings.subdomain, subdomain),
    });

    if (!landing) {
        notFound();
    }

    const profile = await db.query.profiles.findFirst({
        where: eq(profiles.id, landing.userId),
    });

    const projectIntegrations = (landing.integrations as any) || {};
    const integrations = {
        calCom: projectIntegrations.calCom || profile?.calComUsername
    };

    const designData = landing.designJson as any;

    return (
        <div className="min-h-screen bg-white">
            <PublicRenderer
                data={designData}
                landingId={landing.id}
                integrations={integrations}
            />

            {/* Branding badge */}
            <div className="fixed bottom-4 right-4 z-50">
                <a
                    href="https://landingbuilder.com"
                    target="_blank"
                    className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-neutral-200 px-3 py-1.5 rounded-full shadow-sm hover:shadow-md transition-all text-[11px] font-medium text-neutral-600"
                >
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    Powered by Landing Builder
                </a>
            </div>
        </div>
    );
}
