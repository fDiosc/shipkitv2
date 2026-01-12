import { db } from "@/db";
import { workspaces, workspaceMembers, demos, landings, demoAnalyticsEvents } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and, count } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { BarChart3, Eye, MousePointer, Play, Globe, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AnalyticsPageProps {
    params: Promise<{ workspaceSlug: string }>;
}

async function getWorkspaceAnalytics(workspaceSlug: string, userId: string) {
    const workspace = await db.query.workspaces.findFirst({
        where: eq(workspaces.slug, workspaceSlug),
    });

    if (!workspace) return null;

    const membership = await db.query.workspaceMembers.findFirst({
        where: and(
            eq(workspaceMembers.workspaceId, workspace.id),
            eq(workspaceMembers.userId, userId)
        ),
    });

    if (!membership) return null;

    // Count demos and landings
    const demoCount = await db.select({ count: count() })
        .from(demos)
        .where(eq(demos.workspaceId, workspace.id));

    const landingCount = await db.select({ count: count() })
        .from(landings)
        .where(eq(landings.workspaceId, workspace.id));

    // Get real analytics for demos
    const demoStats = await db.select({
        views: count(demoAnalyticsEvents.id)
    })
        .from(demoAnalyticsEvents)
        .innerJoin(demos, eq(demoAnalyticsEvents.demoId, demos.id))
        .where(and(
            eq(demos.workspaceId, workspace.id),
            eq(demoAnalyticsEvents.eventType, "demo_view")
        ));

    const clickStats = await db.select({
        clicks: count(demoAnalyticsEvents.id)
    })
        .from(demoAnalyticsEvents)
        .innerJoin(demos, eq(demoAnalyticsEvents.demoId, demos.id))
        .where(and(
            eq(demos.workspaceId, workspace.id),
            eq(demoAnalyticsEvents.eventType, "hotspot_click")
        ));

    // Get per-demo breakdown
    const demosList = await db.query.demos.findMany({
        where: eq(demos.workspaceId, workspace.id),
    });

    const demoTable = await Promise.all(demosList.map(async (d) => {
        const dViews = await db.select({ count: count() })
            .from(demoAnalyticsEvents)
            .where(and(
                eq(demoAnalyticsEvents.demoId, d.id),
                eq(demoAnalyticsEvents.eventType, "demo_view")
            ));

        const dClicks = await db.select({ count: count() })
            .from(demoAnalyticsEvents)
            .where(and(
                eq(demoAnalyticsEvents.demoId, d.id),
                eq(demoAnalyticsEvents.eventType, "hotspot_click")
            ));

        return {
            id: d.id,
            name: d.name,
            views: Number(dViews[0]?.count || 0),
            clicks: Number(dClicks[0]?.count || 0),
        };
    }));

    return {
        workspace,
        stats: {
            demos: demoCount[0]?.count || 0,
            landings: landingCount[0]?.count || 0,
            views: Number(demoStats[0]?.views || 0),
            clicks: Number(clickStats[0]?.clicks || 0),
        },
        demoTable
    };
}

export default async function WorkspaceAnalyticsPage({ params }: AnalyticsPageProps) {
    const { userId } = await auth();
    if (!userId) redirect("/sign-in");

    const { workspaceSlug } = await params;
    const data = await getWorkspaceAnalytics(workspaceSlug, userId);

    if (!data) notFound();

    const { workspace, stats } = data;

    const cards = [
        {
            title: "Demo Views",
            value: stats.views.toLocaleString(),
            icon: Eye,
            description: "Total views across all demos",
            color: "text-blue-600",
            bgColor: "bg-blue-50",
        },
        {
            title: "Hotspot Clicks",
            value: stats.clicks.toLocaleString(),
            icon: MousePointer,
            description: "Total interactions",
            color: "text-purple-600",
            bgColor: "bg-purple-50",
        },
        {
            title: "Active Demos",
            value: stats.demos.toString(),
            icon: Play,
            description: "Published demos",
            color: "text-green-600",
            bgColor: "bg-green-50",
        },
        {
            title: "Landing Pages",
            value: stats.landings.toString(),
            icon: Globe,
            description: "Active landings",
            color: "text-orange-600",
            bgColor: "bg-orange-50",
        },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Analytics</h1>
                <p className="text-neutral-500">Track performance across {workspace.name}.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <Card key={card.title}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-neutral-600">
                                    {card.title}
                                </CardTitle>
                                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                                    <Icon className={`h-4 w-4 ${card.color}`} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{card.value}</div>
                                <p className="text-xs text-neutral-500">{card.description}</p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Performance by Demo Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Performance by Demo</CardTitle>
                    <CardDescription>
                        Breakdown of engagement for each product story.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="relative overflow-x-auto">
                        <table className="w-full text-sm text-left text-neutral-500">
                            <thead className="text-xs text-neutral-700 uppercase bg-neutral-50">
                                <tr>
                                    <th className="px-6 py-3 font-bold">Demo Name</th>
                                    <th className="px-6 py-3 font-bold">Views</th>
                                    <th className="px-6 py-3 font-bold">Clicks</th>
                                    <th className="px-6 py-3 font-bold">CTR</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                                {data.demoTable.map((demo) => {
                                    const ctr = demo.views > 0
                                        ? ((demo.clicks / demo.views) * 100).toFixed(1)
                                        : "0.0";
                                    return (
                                        <tr key={demo.id} className="bg-white hover:bg-neutral-50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-neutral-900">
                                                {demo.name}
                                            </td>
                                            <td className="px-6 py-4">{demo.views.toLocaleString()}</td>
                                            <td className="px-6 py-4">{demo.clicks.toLocaleString()}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-16 h-2 bg-neutral-100 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-blue-500"
                                                            style={{ width: `${Math.min(Number(ctr), 100)}%` }}
                                                        />
                                                    </div>
                                                    <span className="font-bold text-neutral-700">{ctr}%</span>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {data.demoTable.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-neutral-400">
                                            No demos found. Create your first demo to see stats!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Performance Over Time Placeholder */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-neutral-600" />
                        <CardTitle>Engagement Trends</CardTitle>
                    </div>
                    <CardDescription>
                        Daily views and interactions across all demos.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center h-48 bg-neutral-50 rounded-lg border border-dashed border-neutral-200">
                        <div className="text-center text-neutral-500">
                            <BarChart3 className="h-10 w-10 mx-auto mb-2 text-neutral-300" />
                            <p className="text-sm">Aggregation charts coming in Phase 6</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
