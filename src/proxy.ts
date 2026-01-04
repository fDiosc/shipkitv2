import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { landings } from "@/db/schema";
import { eq } from "drizzle-orm";

import { normalizeDomain } from "@/lib/urls";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/api/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
    const url = req.nextUrl;
    const hostname = req.headers.get("host") || "localhost:3000";

    // Define the root domain
    const rawRootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000";
    const rootDomain = normalizeDomain(rawRootDomain);

    const searchParams = req.nextUrl.searchParams.toString();
    const path = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ''}`;

    // Extract subdomain
    const subdomain = hostname.endsWith(rootDomain)
        ? hostname.replace(`.${rootDomain}`, "").replace(/^www\./, "")
        : null;

    console.log(`[Proxy] Host: ${hostname}, Subdomain: ${subdomain}, Path: ${url.pathname}`);

    // 1. Handle Subdomain Routing (Public Landings)
    if (subdomain && subdomain !== rootDomain && hostname !== rootDomain && subdomain !== "") {
        const rewriteUrl = new URL(`/public/${subdomain}${path}`, req.url);
        console.log(`[Proxy] Subdomain Rewrite: ${rewriteUrl.pathname}`);
        return NextResponse.rewrite(rewriteUrl);
    }

    // 2. Handle Custom Domain Lookup
    // If not a subdomain and not the root domain, it might be a custom domain
    if (!subdomain && hostname !== rootDomain && hostname !== "localhost:3000") {
        try {
            const landing = await db.query.landings.findFirst({
                where: eq(landings.customDomain, hostname),
                columns: { subdomain: true }
            });

            if (landing) {
                const rewriteUrl = new URL(`/public/${landing.subdomain}${path}`, req.url);
                console.log(`[Proxy] Custom Domain Rewrite: ${rewriteUrl.pathname}`);
                return NextResponse.rewrite(rewriteUrl);
            }
        } catch (error) {
            console.error("[Proxy] Custom domain error:", error);
        }
    }

    // 3. Handle Protected Routes (Dashboard)
    if (isProtectedRoute(req)) {
        await auth.protect();
    }
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};
