import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { demoAnalyticsEvents, demoAnalyticsDaily } from "@/db/schema";
import { eq, and, gte, count } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

/**
 * GET: Fetch analytics data for a demo
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: demoId } = await params;
    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get('period') || '7d';

    // Calculate start date based on period
    const now = new Date();
    let startDate: Date;

    switch (period) {
        case '24h':
            startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            break;
        case '7d':
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
        case '30d':
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
        case '90d':
            startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
            break;
        default:
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    try {
        // Get demo views (unique sessions)
        const viewEvents = await db
            .select({
                count: count(),
            })
            .from(demoAnalyticsEvents)
            .where(
                and(
                    eq(demoAnalyticsEvents.demoId, demoId),
                    eq(demoAnalyticsEvents.eventType, 'demo_view'),
                    gte(demoAnalyticsEvents.ts, startDate)
                )
            );

        const totalViews = viewEvents[0]?.count || 0;

        // Get completions
        const completeEvents = await db
            .select({
                count: count(),
            })
            .from(demoAnalyticsEvents)
            .where(
                and(
                    eq(demoAnalyticsEvents.demoId, demoId),
                    eq(demoAnalyticsEvents.eventType, 'demo_complete'),
                    gte(demoAnalyticsEvents.ts, startDate)
                )
            );

        const completedViews = completeEvents[0]?.count || 0;
        const completionRate = totalViews > 0 ? (completedViews / totalViews) * 100 : 0;

        // Get step views for drop-off analysis
        const stepViewEvents = await db
            .select({
                screenId: demoAnalyticsEvents.screenId,
                count: count(),
            })
            .from(demoAnalyticsEvents)
            .where(
                and(
                    eq(demoAnalyticsEvents.demoId, demoId),
                    eq(demoAnalyticsEvents.eventType, 'screen_view'),
                    gte(demoAnalyticsEvents.ts, startDate)
                )
            )
            .groupBy(demoAnalyticsEvents.screenId);

        const stepDropoff = stepViewEvents
            .filter(s => s.screenId)
            .map((step, index, arr) => {
                const prevViews = index > 0 ? arr[index - 1]?.count || 0 : step.count;
                const dropoffRate = prevViews > 0 ? ((prevViews - step.count) / prevViews) * 100 : 0;

                return {
                    stepId: step.screenId!,
                    stepNumber: index + 1,
                    views: step.count,
                    dropoffRate: Math.max(0, dropoffRate),
                };
            });

        // Get daily aggregated data
        const startDateStr = startDate.toISOString().split('T')[0];
        const dailyData = await db
            .select()
            .from(demoAnalyticsDaily)
            .where(
                and(
                    eq(demoAnalyticsDaily.demoId, demoId),
                    gte(demoAnalyticsDaily.date, startDateStr)
                )
            )
            .orderBy(demoAnalyticsDaily.date);

        const viewsByDay = dailyData.map(d => ({
            date: d.date,
            views: d.views,
        }));

        // Calculate average time spent (placeholder)
        const avgTimeSpent = 30;

        // Count leads (placeholder)
        const leadsCount = 0;

        return NextResponse.json({
            totalViews,
            completionRate,
            avgTimeSpent,
            leadsCount,
            stepDropoff,
            viewsByDay,
        });
    } catch (error) {
        console.error('Analytics fetch error:', error);
        return NextResponse.json(
            { error: "Failed to fetch analytics" },
            { status: 500 }
        );
    }
}
