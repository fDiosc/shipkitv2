"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts';
import { Eye, Users, MousePointerClick, Mail, TrendingUp, Globe, Clock, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";

interface AnalyticsData {
    analytics: {
        totalViews: number;
        uniqueVisitors: number;
        sessions: number;
        avgDuration: number;
        bounceRate: number;
        byDevice: Record<string, number>;
        bySources: Record<string, number>;
        dailyViews: Array<{ date: string; views: number }>;
    };
    events: {
        leadCaptures: number;
        ctaClicks: number;
    };
    leads: {
        captured: number;
    };
    conversionRate: string;
}

export function AnalyticsDashboard({ landingId, landingName }: { landingId: string, landingName?: string }) {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dateRange, setDateRange] = useState('7daysAgo');

    useEffect(() => {
        async function fetchAnalytics() {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`/api/analytics/${landingId}?startDate=${dateRange}`);
                const json = await res.json();

                if (!res.ok) {
                    throw new Error(json.details || json.error || "Failed to fetch analytics");
                }

                setData(json);
            } catch (err: any) {
                console.error('Failed to fetch analytics:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchAnalytics();
    }, [landingId, dateRange]);

    if (loading) {
        return (
            <div className="space-y-6 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24 rounded-2xl" />)}
                </div>
                <Skeleton className="h-[400px] rounded-2xl" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Skeleton className="h-[300px] rounded-2xl" />
                    <Skeleton className="h-[300px] rounded-2xl" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center bg-red-50/30 rounded-3xl border border-red-100 shadow-sm mt-4">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4 border border-red-100">
                    <TrendingUp className="h-8 w-8 text-red-500 opacity-50" />
                </div>
                <h3 className="text-lg font-bold text-red-900">Analytics Error</h3>
                <p className="text-red-700 max-w-md mx-auto mt-2 text-sm">
                    {error}
                </p>
                <div className="mt-6 p-4 bg-white rounded-2xl border border-red-100 text-[11px] text-red-400 font-mono text-left max-w-sm">
                    TIP: Check if your GA4_PROPERTY_ID and credentials are correctly configured in .env.local
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-3xl border border-neutral-100 shadow-sm">
                <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mb-4">
                    <BarChart className="h-8 w-8 text-neutral-300" />
                </div>
                <h3 className="text-lg font-bold text-neutral-900">No analytics data yet</h3>
                <p className="text-neutral-500 max-w-xs mx-auto mt-2">
                    Once you start getting visitors to your landing page, metrics will appear here in real-time.
                </p>
            </div>
        );
    }

    const dailyData = data.analytics.dailyViews.map(d => ({
        date: new Date(d.date.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')).toLocaleDateString('default', { month: 'short', day: 'numeric' }),
        views: d.views
    }));

    return (
        <div className="space-y-6 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Date Range Selector */}
            <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-neutral-100 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-neutral-900">
                            {landingName ? `${landingName} Analysis` : "Performance Report"}
                        </h2>
                        <p className="text-xs text-neutral-500">Track your scaling metrics</p>
                    </div>
                </div>
                <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="bg-neutral-50 border-none rounded-xl px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-blue-500 cursor-pointer hover:bg-neutral-100 transition-colors"
                >
                    <option value="today">Today</option>
                    <option value="7daysAgo">Last 7 days</option>
                    <option value="30daysAgo">Last 30 days</option>
                    <option value="90daysAgo">Last 90 days</option>
                </select>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <MetricCard
                    icon={<Eye className="h-5 w-5" />}
                    label="Page Views"
                    value={data.analytics.totalViews.toLocaleString()}
                    color="blue"
                />
                <MetricCard
                    icon={<Users className="h-5 w-5" />}
                    label="Unique Visitors"
                    value={data.analytics.uniqueVisitors.toLocaleString()}
                    color="green"
                />
                <MetricCard
                    icon={<Mail className="h-5 w-5" />}
                    label="Leads (Source of Truth)"
                    value={data.leads.captured.toLocaleString()}
                    color="purple"
                />
                <MetricCard
                    icon={<TrendingUp className="h-5 w-5" />}
                    label="Conversion Rate"
                    value={`${data.conversionRate}%`}
                    color="orange"
                />
            </div>

            {/* Main Traffic Chart */}
            <Card className="rounded-3xl border-neutral-100 shadow-sm overflow-hidden">
                <CardHeader className="bg-neutral-50/50 border-b border-neutral-100 px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-xl font-black">Traffic Overview</CardTitle>
                            <CardDescription>Daily page views across your landing</CardDescription>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-blue-500" />
                                <span className="text-xs font-bold text-neutral-500 uppercase">Views</span>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-8">
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={dailyData}>
                                <defs>
                                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#999' }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#999' }}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="views"
                                    stroke="#2563eb"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorViews)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Secondary Breakdowns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="rounded-3xl border-neutral-100 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Globe className="h-5 w-5 text-blue-500" /> Top Traffic Sources
                        </CardTitle>
                        <CardDescription>Where your visitors are coming from</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {Object.entries(data.analytics.bySources)
                            .sort(([, a], [, b]) => b - a)
                            .slice(0, 5)
                            .map(([source, views], i) => (
                                <div key={source} className="group relative">
                                    <div className="flex justify-between items-center mb-1.5 relative z-10">
                                        <span className="text-sm font-bold capitalize text-neutral-700">{source}</span>
                                        <span className="text-sm font-black text-neutral-900">{views} views</span>
                                    </div>
                                    <div className="h-2 w-full bg-neutral-50 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-blue-500 rounded-full transition-all duration-1000"
                                            style={{ width: `${(views / data.analytics.totalViews) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                    </CardContent>
                </Card>

                <Card className="rounded-3xl border-neutral-100 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MousePointerClick className="h-5 w-5 text-purple-500" /> Device Breakdown
                        </CardTitle>
                        <CardDescription>Views by platform type</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={Object.entries(data.analytics.byDevice).map(([device, views]) => ({ device, views }))}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis dataKey="device" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#999' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#999' }} />
                                    <Tooltip />
                                    <Bar dataKey="views" fill="#7c3aed" radius={[8, 8, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Engagement Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <EngagementCard
                    label="CTA Clicks"
                    value={data.events.ctaClicks}
                    icon={<MousePointerClick className="h-4 w-4" />}
                />
                <EngagementCard
                    label="Avg. Duration"
                    value={`${Math.round(data.analytics.avgDuration)}s`}
                    icon={<Clock className="h-4 w-4" />}
                />
                <EngagementCard
                    label="Bounce Rate"
                    value={`${data.analytics.bounceRate.toFixed(1)}%`}
                    icon={<ArrowDownRight className="h-4 w-4" />}
                />
            </div>

            <p className="text-[10px] text-center text-neutral-400 font-mono tracking-widest uppercase py-4">
                Analytics engine powered by Google & Microsoft • 🚀 ShipKit Original
            </p>
        </div>
    );
}

function MetricCard({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string, color: 'blue' | 'green' | 'purple' | 'orange' }) {
    const colors: Record<string, string> = {
        blue: 'bg-blue-50 text-blue-600 border-blue-100',
        green: 'bg-green-50 text-green-600 border-green-100',
        purple: 'bg-purple-50 text-purple-600 border-purple-100',
        orange: 'bg-orange-50 text-orange-600 border-orange-100',
    };

    return (
        <Card className={`p-6 rounded-3xl border transition-all hover:scale-[1.02] cursor-default border-neutral-100 shadow-sm`}>
            <div className="flex items-start justify-between">
                <div className={`p-3 rounded-2xl ${colors[color]} border shadow-inner`}>
                    {icon}
                </div>
            </div>
            <div className="mt-8">
                <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider">{label}</p>
                <p className="text-3xl font-black text-neutral-900 mt-1">{value}</p>
            </div>
        </Card>
    );
}

function EngagementCard({ label, value, icon }: any) {
    return (
        <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-neutral-50 rounded-xl flex items-center justify-center text-neutral-500">
                    {icon}
                </div>
                <div>
                    <p className="text-xs font-bold text-neutral-500 uppercase tracking-tighter">{label}</p>
                    <p className="text-xl font-black text-neutral-900">{value}</p>
                </div>
            </div>
            <div className="h-2 w-2 rounded-full bg-blue-500" />
        </div>
    );
}
