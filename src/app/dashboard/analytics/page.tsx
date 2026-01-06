"use client";

import { useState, useEffect } from "react";
import { Wizard, WizardStep } from "@/components/dashboard/Wizard";
import { getProfile } from "@/app/actions/profile";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Users, DollarSign, Search, Layout } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AnalyticsDashboard } from "@/components/dashboard/AnalyticsDashboard";
import { db } from "@/db"; // This will need to be a client-side fetch or we use a server component wrapper

// Since we are in a client component, we'll fetch the landing ID via an effect or pass it as a prop.
// For the MVP, we'll fetch the user's landings and show the first one's analytics.

export default function AnalyticsPage() {
    const [showWizard, setShowWizard] = useState(false);
    const [landingId, setLandingId] = useState<string | null>(null);
    const [landings, setLandings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getProfile().then(profile => {
            const status = (profile?.onboardingStatus as any) || {};
            if (!status.analyticsTour) {
                setShowWizard(true);
            }
        });

        // Fetch user's first landing to show analytics
        const fetchLandings = async () => {
            try {
                const res = await fetch('/api/landings'); // We need this route or similar
                const data = await res.json();
                if (data.landings && data.landings.length > 0) {
                    setLandings(data.landings);
                    setLandingId(data.landings[0].id);
                }
            } catch (error) {
                console.error("Failed to fetch landings:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLandings();
    }, []);

    const analyticsSteps: WizardStep[] = [
        {
            title: "Growth Insights 📊",
            description: "Welcome to your performance hub. Here you can track how your landing pages are converting visitors into leads.",
        },
        {
            title: "The Funnel 📈",
            description: "Track 'Total Views' against 'Total Leads' to see your conversion rate. A healthy landing page usually converts between 2% and 10%.",
        },
        {
            title: "Data Refreshing ⏳",
            description: "Analytics data is updated daily. Once you launch a page and get your first visitors, the charts below will come to life.",
        },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Analytics</h1>
                    <p className="text-neutral-500">Track your performance across all landings.</p>
                </div>
                <div className="flex items-center gap-4">
                    {landings.length > 1 && (
                        <Select value={landingId || ""} onValueChange={setLandingId}>
                            <SelectTrigger className="w-[200px] bg-white border-neutral-100 shadow-sm rounded-xl">
                                <Layout className="h-4 w-4 mr-2 text-blue-500" />
                                <SelectValue placeholder="Select Landing" />
                            </SelectTrigger>
                            <SelectContent>
                                {landings.map((l) => (
                                    <SelectItem key={l.id} value={l.id}>
                                        {l.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-neutral-100 shadow-sm text-sm text-neutral-500">
                        <Search className="h-4 w-4" />
                        <span>Real-time filtering enabled</span>
                    </div>
                </div>
            </div>

            {landingId ? (
                <AnalyticsDashboard
                    landingId={landingId}
                    landingName={landings.find(l => l.id === landingId)?.name}
                />
            ) : loading ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-neutral-100 animate-pulse rounded-3xl" />)}
                </div>
            ) : (
                <div className="rounded-3xl border border-dashed border-neutral-200 bg-white p-12 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                        <BarChart3 className="h-6 w-6" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-neutral-900">No data to track</h3>
                    <p className="mt-2 text-neutral-500">Create and publish your first landing page to see analytics here.</p>
                </div>
            )}

            <Wizard
                wizardKey="analyticsTour"
                isOpen={showWizard}
                steps={analyticsSteps}
                onClose={() => setShowWizard(false)}
            />
        </div>
    );
}
