import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Globe, BarChart3, Zap } from "lucide-react";
import Link from "next/link";
import { NewLandingModal } from "@/components/dashboard/NewLandingModal";
import { db } from "@/db";
import { landings, leads } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, count, inArray } from "drizzle-orm";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { DashboardWizard } from "@/components/dashboard/DashboardWizard";

export default async function DashboardPage() {
    const { userId } = await auth();
    if (!userId) redirect("/sign-in");

    // Fetch stats
    const userLandings = await db.query.landings.findMany({
        where: eq(landings.userId, userId),
    });

    const activeLandings = userLandings.filter(l => l.status === "published").length;

    // Total Leads across all user landings
    let totalLeadsCount = 0;
    if (userLandings.length > 0) {
        const landingIds = userLandings.map(l => l.id);
        const [leadsRes] = await db
            .select({ value: count() })
            .from(leads)
            .where(inArray(leads.landingId, landingIds));
        totalLeadsCount = leadsRes.value;
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Section */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Dashboard</h1>
                    <p className="text-neutral-500">Welcome back! Here's an overview of your projects.</p>
                </div>
                <NewLandingModal />
            </div>

            {/* Stats Quick Grid */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Active Landings"
                    value={activeLandings.toString()}
                    description="Live and capturing leads"
                    icon={<Globe className="h-4 w-4 text-blue-600" />}
                />
                <StatCard
                    title="Total Leads"
                    value={totalLeadsCount.toString()}
                    description="Across all platforms"
                    icon={<Zap className="h-4 w-4 text-yellow-600" />}
                />
                <StatCard
                    title="Avg. Conversion"
                    value="0%"
                    description="Last 30 days"
                    icon={<BarChart3 className="h-4 w-4 text-green-600" />}
                />
                <StatCard
                    title="Total Projects"
                    value={userLandings.length.toString()}
                    description="Successfully built"
                    icon={<Plus className="h-4 w-4 text-purple-600" />}
                />
            </div>

            {/* Main Content Area */}
            {userLandings.length === 0 ? (
                <div className="rounded-xl border border-dashed border-neutral-200 bg-white p-12 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                        <Globe className="h-6 w-6" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-neutral-900">No landing pages yet</h3>
                    <p className="mt-2 text-neutral-500">Start by creating your first highly optimizing landing page.</p>
                    <div className="mt-6">
                        <NewLandingModal>
                            <Button className="gap-2">
                                <Plus className="h-4 w-4" /> Create Landing
                            </Button>
                        </NewLandingModal>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card className="shadow-sm border-neutral-100">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Recent Projects</CardTitle>
                                    <CardDescription>Your latest landing pages.</CardDescription>
                                </div>
                                <Link href="/dashboard/landings">
                                    <Button variant="ghost" size="sm" className="text-blue-600 font-bold">View all</Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {userLandings.slice(0, 3).map((landing) => (
                                    <div key={landing.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-neutral-50 transition-colors border border-transparent hover:border-neutral-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center font-bold text-blue-600">
                                                {landing.name[0]}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-neutral-900">{landing.name}</p>
                                                <p className="text-xs text-neutral-500">{landing.subdomain}.localhost</p>
                                            </div>
                                        </div>
                                        <Badge
                                            variant={landing.status === 'published' ? 'default' : 'secondary'}
                                            className={landing.status === 'published' ? 'bg-green-100 text-green-700' : ''}
                                        >
                                            {landing.status === 'published' ? 'Live' : 'Draft'}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm border-neutral-100">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Quick Insights</CardTitle>
                                    <CardDescription>How your projects are performing.</CardDescription>
                                </div>
                                <Link href="/dashboard/leads">
                                    <Button variant="ghost" size="sm" className="text-blue-600 font-bold">Manage Leads</Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent className="h-[200px] flex items-center justify-center text-center p-8">
                            <div className="space-y-2">
                                <div className="mx-auto w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600">
                                    <Zap className="h-5 w-5" />
                                </div>
                                <p className="text-sm font-bold text-neutral-900">{totalLeadsCount} Leads Captured</p>
                                <p className="text-xs text-neutral-500">You're doing great! Keep building more validation points.</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            <DashboardWizard />
        </div>
    );
}

function StatCard({ title, value, description, icon }: { title: string; value: string; description: string; icon: React.ReactNode }) {
    return (
        <Card className="shadow-sm border-neutral-100 hover:border-blue-100 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-neutral-500">{title}</CardTitle>
                <div className="h-8 w-8 rounded-lg bg-neutral-50 flex items-center justify-center">
                    {icon}
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-neutral-400 mt-1">{description}</p>
            </CardContent>
        </Card>
    );
}
