"use server";

import { db } from "@/db";
import { landings } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { generateLandingContent } from "@/lib/ai/engine";
import { checkLandingLimit, checkAIGenerationLimit, incrementAIGenerationProgress } from "@/app/actions/usage";

export async function generateLandingMagic(formData: FormData) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const name = formData.get("name") as string;
    const subdomain = formData.get("subdomain") as string;
    const description = formData.get("description") as string;

    // Check Landing Limit
    const { allowed: landingAllowed } = await checkLandingLimit();
    if (!landingAllowed) {
        return { success: false, error: "Landing limit reached. Upgrade to Pro for unlimited landings! 🚀" };
    }

    // Check AI Limit
    const { allowed: aiAllowed, remaining } = await checkAIGenerationLimit();
    if (!aiAllowed) {
        return { success: false, error: "Monthly AI generation limit reached. Upgrade to Pro for unlimited magic! ✨" };
    }

    // 0. Pre-check subdomain
    const existing = await db.query.landings.findFirst({
        where: eq(landings.subdomain, subdomain),
    });

    if (existing) {
        return { success: false, error: "Este subdomínio já está em uso." };
    }

    try {
        // 1. Generate Content via AI
        const aiData = await generateLandingContent(description);

        // 2. Map AI data to Craft.js JSON structure
        const primary = aiData.theme.primaryColor || "#6366f1";
        const bg = aiData.theme.backgroundColor || "#ffffff";

        const designJson = {
            ROOT: {
                type: { resolvedName: "Container" },
                isCanvas: true,
                props: { padding: 0, background: bg, gap: "0" },
                nodes: [
                    "header-node",
                    "hero-node",
                    ...(aiData.logoCloud.isActive ? ["logo-cloud-node"] : []),
                    "features-node",
                    "form-node",
                    ...(aiData.pricing.isActive ? ["pricing-node"] : []),
                    ...(aiData.faq.isActive ? ["faq-node"] : []),
                    ...(aiData.calCom.isActive ? ["calcom-node"] : []),
                    "footer-node"
                ],
                displayName: "ROOT",
                custom: {}
            },
            "header-node": {
                type: { resolvedName: "Header" },
                props: {
                    logoText: aiData.header.brandName,
                    ctaText: aiData.header.ctaText,
                    links: aiData.header.links,
                    accentColor: primary
                },
                parent: "ROOT",
                nodes: [],
                displayName: "Header",
                custom: {}
            },
            "footer-node": {
                type: { resolvedName: "Footer" },
                props: {
                    logoText: aiData.footer.brandName,
                    accentColor: primary
                },
                parent: "ROOT",
                nodes: [],
                displayName: "Footer",
                custom: {}
            },
            "hero-node": {
                type: { resolvedName: "Hero" },
                props: {
                    title: aiData.hero.title,
                    subtitle: aiData.hero.subtitle,
                    background: "transparent",
                    buttonColor: primary
                },
                parent: "ROOT",
                nodes: ["hero-container"],
                displayName: "Hero",
                custom: {}
            },
            "hero-container": {
                type: { resolvedName: "Container" },
                props: { padding: 0, background: "transparent" },
                parent: "hero-node",
                nodes: [],
                displayName: "Container",
                custom: {}
            },
            ...(aiData.logoCloud.isActive ? {
                "logo-cloud-node": {
                    type: { resolvedName: "LogoCloud" },
                    props: {
                        title: aiData.logoCloud.title,
                        logos: aiData.logoCloud.logos
                    },
                    parent: "ROOT",
                    nodes: [],
                    displayName: "Social Proof",
                    custom: {}
                }
            } : {}),
            "form-node": {
                type: { resolvedName: "LeadForm" },
                props: {
                    placeholder: aiData.leadForm.placeholder,
                    buttonText: aiData.leadForm.buttonText,
                    buttonColor: primary
                },
                parent: "ROOT",
                nodes: [],
                displayName: "Lead Form",
                custom: {}
            },
            "features-node": {
                type: { resolvedName: "FeatureCards" },
                props: {
                    title: "Features",
                    subtitle: "Everything you need",
                    features: aiData.featureCards,
                    accentColor: primary
                },
                parent: "ROOT",
                nodes: [],
                displayName: "Features",
                custom: {}
            },
            ...(aiData.pricing.isActive ? {
                "pricing-node": {
                    type: { resolvedName: "PricingTable" },
                    props: {
                        title: aiData.pricing.title,
                        plans: aiData.pricing.plans.map(p => ({ ...p, buttonColor: primary })),
                        accentColor: primary
                    },
                    parent: "ROOT",
                    nodes: [],
                    displayName: "Pricing Table",
                    custom: {}
                }
            } : {}),
            ...(aiData.faq.isActive ? {
                "faq-node": {
                    type: { resolvedName: "FAQ" },
                    props: {
                        title: aiData.faq.title,
                        items: aiData.faq.items
                    },
                    parent: "ROOT",
                    nodes: [],
                    displayName: "FAQ Section",
                    custom: {}
                }
            } : {}),
            ...(aiData.calCom.isActive ? {
                "calcom-node": {
                    type: { resolvedName: "CalCom" },
                    props: {
                        title: aiData.calCom.title,
                        subtitle: aiData.calCom.subtitle,
                        calLink: aiData.calCom.calLink
                    },
                    parent: "ROOT",
                    nodes: [],
                    displayName: "Cal.com Scheduler",
                    custom: {}
                }
            } : {})
        };

        // 3. Save to DB
        const [newLanding] = await db.insert(landings).values({
            userId,
            name,
            subdomain,
            designJson,
            status: "draft",
        }).returning();

        revalidatePath("/dashboard/landings");
        revalidatePath("/dashboard");

        // Increment AI Usage
        await incrementAIGenerationProgress();

        return { success: true, id: newLanding.id };
    } catch (error: any) {
        console.error("AI Generation Error:", error);
        return { success: false, error: "Não foi possível gerar a landing com GPT-5.2. Verifique o console." };
    }
}
