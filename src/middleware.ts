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
    const rawRootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "shipkit.app";
    const rootDomain = normalizeDomain(rawRootDomain);

    const searchParams = req.nextUrl.searchParams.toString();
    const path = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ''}`;

    // Detection logic
    const isRootDomain = hostname === rootDomain || hostname === `www.${rootDomain}` || hostname === "localhost:3000";

    console.log(`[Middleware] Host: ${hostname}, Root: ${rootDomain}, isRoot: ${isRootDomain}, Path: ${url.pathname}`);

    // 1. Handle Subdomain Routing (Public Landings)
    // Only if NOT the root domain and has a subdomain
    if (!isRootDomain && hostname.endsWith(`.${rootDomain}`)) {
        const subdomain = hostname.replace(`.${rootDomain}`, "").replace(/^www\./, "");

        if (subdomain && subdomain !== "") {
            const rewriteUrl = new URL(`/public/${subdomain}${path}`, req.url);
            console.log(`[Middleware] Subdomain Rewrite: ${rewriteUrl.pathname}`);
            return NextResponse.rewrite(rewriteUrl);
        }
    }

    // 2. Handle Custom Domain Lookup
    // If not a subdomain and not the root domain, it might be a custom domain
    if (!isRootDomain) {
        try {
            const landing = await db.query.landings.findFirst({
                where: eq(landings.customDomain, hostname),
                columns: { subdomain: true }
            });

            if (landing) {
                const rewriteUrl = new URL(`/public/${landing.subdomain}${path}`, req.url);
                console.log(`[Middleware] Custom Domain Rewrite: ${rewriteUrl.pathname}`);
                return NextResponse.rewrite(rewriteUrl);
            }
        } catch (error) {
            console.error("[Middleware] Custom domain error:", error);
        }
    }

    // 3. Handle Protected Routes (Dashboard)
    if (isProtectedRoute(req)) {
        await auth.protect();
    }

    // 4. Handle Embed Routes - Allow cross-origin embedding
    if (url.pathname.startsWith('/productstory/embed/')) {
        const response = NextResponse.next();
        // Allow embedding from any origin
        response.headers.set('X-Frame-Options', 'ALLOWALL');
        response.headers.set('Content-Security-Policy', "frame-ancestors *");
        return response;
    }

    return NextResponse.next();
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};
