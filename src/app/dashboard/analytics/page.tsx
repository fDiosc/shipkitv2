"use client";

import { useState, useEffect } from "react";
import { Wizard, WizardStep } from "@/components/dashboard/Wizard";
import { getProfile } from "@/app/actions/profile";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Users, DollarSign } from "lucide-react";

export default function AnalyticsPage() {
    const [showWizard, setShowWizard] = useState(false);

    useEffect(() => {
        getProfile().then(profile => {
            const status = (profile?.onboardingStatus as any) || {};
            if (!status.analyticsTour) {
                setShowWizard(true);
            }
        });
    }, []);

    const analyticsSteps: WizardStep[] = [
        {
            title: "Growth Insights 📊",
            description: "Welcome to your performance hub. Here you can track how your landing pages are converting visitors into leads.",
        },
        {
            title: "The Funnel  funnel",
            description: "Track 'Total Views' against 'Total Leads' to see your conversion rate. A healthy landing page usually converts between 2% and 10%.",
        },
        {
            title: "Data Refreshing ⏳",
            description: "Analytics data is updated daily. Once you launch a page and get your first visitors, the charts below will come to life.",
        },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Analytics</h1>
                <p className="text-neutral-500">Track your performance across all landings.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard title="Total Views" value="0" icon={<Users className="h-4 w-4" />} description="+0% from last month" />
                <StatsCard title="Total Leads" value="0" icon={<TrendingUp className="h-4 w-4" />} description="+0% from last month" />
                <StatsCard title="Conversion Rate" value="0%" icon={<BarChart3 className="h-4 w-4" />} description="+0% from last month" />
                <StatsCard title="Revenue" value="$0.00" icon={<DollarSign className="h-4 w-4" />} description="+0% from last month" />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Overview</CardTitle>
                    <CardDescription>Your traffic and conversion data over time.</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center border-t border-dashed border-neutral-200 m-6 rounded-lg bg-neutral-50">
                    <p className="text-neutral-400 text-sm italic">No data available yet. Launch a page to start tracking.</p>
                </CardContent>
            </Card>

            <Wizard
                wizardKey="analyticsTour"
                isOpen={showWizard}
                steps={analyticsSteps}
                onClose={() => setShowWizard(false)}
            />
        </div>
    );
}

function StatsCard({ title, value, icon, description }: { title: string; value: string; icon: React.ReactNode; description: string }) {
    return (
        <Card className="shadow-sm border-neutral-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-neutral-600">{title}</CardTitle>
                <div className="text-blue-500 bg-blue-50 p-1.5 rounded-md">{icon}</div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-neutral-900">{value}</div>
                <p className="text-xs text-neutral-500 mt-1">{description}</p>
            </CardContent>
        </Card>
    );
}
