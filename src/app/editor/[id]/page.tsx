import { db } from "@/db";
import { landings, profiles } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { EditorContainer } from "@/components/editor/EditorContainer";

export default async function EditorPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { userId } = await auth();
    if (!userId) redirect("/sign-in");

    const landing = await db.query.landings.findFirst({
        where: eq(landings.id, id),
    });

    if (!landing) notFound();
    if (landing.userId !== userId) redirect("/dashboard");

    // Craft.js Frame expects a serialized JSON string for initial data.
    // We check if it's a valid Craft.js state (must have a ROOT node)
    const isCraftState = landing.designJson &&
        typeof landing.designJson === 'object' &&
        'ROOT' in (landing.designJson as any);

    const initialData = isCraftState ? JSON.stringify(landing.designJson) : null;

    const profile = await db.query.profiles.findFirst({
        where: eq(profiles.id, userId),
    });

    const projectIntegrations = (landing.integrations as any) || {};
    const integrations = {
        calCom: projectIntegrations.calCom || profile?.calComUsername,
        storylaneId: projectIntegrations.storylaneId || profile?.storylaneId
    };

    return (
        <EditorContainer
            landingId={landing.id}
            landingName={landing.name}
            initialData={initialData}
            integrations={integrations}
        />
    );
}
