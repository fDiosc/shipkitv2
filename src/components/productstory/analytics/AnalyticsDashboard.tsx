"use client";

import { useState } from "react";
import { Eye, CheckCircle, Clock, Users, TrendingDown, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnalyticsData {
    totalViews: number;
    completionRate: number;
    avgTimeSpent: number; // seconds
    leadsCount: number;
    stepDropoff: Array<{
        stepId: string;
        stepNumber: number;
        views: number;
        dropoffRate: number;
    }>;
    viewsByDay: Array<{
        date: string;
        views: number;
    }>;
}

interface AnalyticsDashboardProps {
    demoId: string;
    demoName: string;
    data: AnalyticsData;
    isLoading?: boolean;
}

export function AnalyticsDashboard({
    demoId,
    demoName,
    data,
    isLoading = false
}: AnalyticsDashboardProps) {
    const [period, setPeriod] = useState<'24h' | '7d' | '30d' | '90d'>('7d');

    const formatDuration = (seconds: number) => {
        if (seconds < 60) return `${Math.round(seconds)}s`;
        const minutes = Math.floor(seconds / 60);
        const secs = Math.round(seconds % 60);
        return `${minutes}m ${secs}s`;
    };

    const formatNumber = (num: number) => {
        if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
        return num.toString();
    };

    if (isLoading) {
        return (
            <div className="p-8 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600" />
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-neutral-900">{demoName}</h2>
                    <p className="text-sm text-neutral-500">Analytics Overview</p>
                </div>

                {/* Period Selector */}
                <div className="flex items-center gap-1 bg-neutral-100 rounded-lg p-1">
                    {(['24h', '7d', '30d', '90d'] as const).map((p) => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={cn(
                                "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                                period === p
                                    ? "bg-white text-neutral-900 shadow-sm"
                                    : "text-neutral-600 hover:text-neutral-900"
                            )}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    title="Total Views"
                    value={formatNumber(data.totalViews)}
                    icon={Eye}
                    iconColor="text-blue-500"
                    bgColor="bg-blue-50"
                />
                <MetricCard
                    title="Completion Rate"
                    value={`${data.completionRate.toFixed(1)}%`}
                    icon={CheckCircle}
                    iconColor="text-green-500"
                    bgColor="bg-green-50"
                />
                <MetricCard
                    title="Avg. Time Spent"
                    value={formatDuration(data.avgTimeSpent)}
                    icon={Clock}
                    iconColor="text-amber-500"
                    bgColor="bg-amber-50"
                />
                <MetricCard
                    title="Leads Captured"
                    value={formatNumber(data.leadsCount)}
                    icon={Users}
                    iconColor="text-violet-500"
                    bgColor="bg-violet-50"
                />
            </div>

            {/* Drop-off Funnel */}
            <div className="bg-white rounded-xl border p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <TrendingDown className="w-5 h-5 text-neutral-400" />
                        <h3 className="font-semibold text-neutral-900">Step Drop-off</h3>
                    </div>
                    <p className="text-sm text-neutral-500">
                        Identify where viewers leave your demo
                    </p>
                </div>

                <DropoffFunnel steps={data.stepDropoff} />
            </div>

            {/* Views Over Time */}
            <div className="bg-white rounded-xl border p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-neutral-400" />
                        <h3 className="font-semibold text-neutral-900">Views Over Time</h3>
                    </div>
                </div>

                <ViewsChart data={data.viewsByDay} />
            </div>
        </div>
    );
}

interface MetricCardProps {
    title: string;
    value: string;
    icon: React.ComponentType<{ className?: string }>;
    iconColor: string;
    bgColor: string;
    change?: number;
}

function MetricCard({ title, value, icon: Icon, iconColor, bgColor, change }: MetricCardProps) {
    return (
        <div className="bg-white rounded-xl border p-5">
            <div className="flex items-start justify-between">
                <div className={cn("p-2.5 rounded-lg", bgColor)}>
                    <Icon className={cn("w-5 h-5", iconColor)} />
                </div>
                {change !== undefined && (
                    <span className={cn(
                        "text-xs font-medium px-2 py-0.5 rounded-full",
                        change >= 0
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                    )}>
                        {change >= 0 ? '+' : ''}{change}%
                    </span>
                )}
            </div>
            <div className="mt-4">
                <p className="text-2xl font-bold text-neutral-900">{value}</p>
                <p className="text-sm text-neutral-500 mt-0.5">{title}</p>
            </div>
        </div>
    );
}

interface DropoffFunnelProps {
    steps: Array<{
        stepId: string;
        stepNumber: number;
        views: number;
        dropoffRate: number;
    }>;
}

function DropoffFunnel({ steps }: DropoffFunnelProps) {
    if (steps.length === 0) {
        return (
            <div className="text-center py-8 text-neutral-400">
                No data available yet
            </div>
        );
    }

    const maxViews = Math.max(...steps.map(s => s.views));

    return (
        <div className="space-y-3">
            {steps.map((step, index) => {
                const widthPercent = maxViews > 0 ? (step.views / maxViews) * 100 : 0;
                const isHighDropoff = step.dropoffRate > 30;

                return (
                    <div key={step.stepId} className="relative">
                        {/* Step label */}
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-neutral-700">
                                Step {step.stepNumber}
                            </span>
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-neutral-500">
                                    {step.views} views
                                </span>
                                {index > 0 && (
                                    <span className={cn(
                                        "text-xs px-2 py-0.5 rounded-full",
                                        isHighDropoff
                                            ? "bg-red-100 text-red-700"
                                            : "bg-neutral-100 text-neutral-600"
                                    )}>
                                        -{step.dropoffRate.toFixed(0)}%
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Bar */}
                        <div className="h-8 bg-neutral-100 rounded-lg overflow-hidden">
                            <div
                                className={cn(
                                    "h-full rounded-lg transition-all duration-500",
                                    isHighDropoff ? "bg-red-400" : "bg-violet-500"
                                )}
                                style={{ width: `${widthPercent}%` }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

interface ViewsChartProps {
    data: Array<{
        date: string;
        views: number;
    }>;
}

function ViewsChart({ data }: ViewsChartProps) {
    if (data.length === 0) {
        return (
            <div className="text-center py-8 text-neutral-400">
                No data available yet
            </div>
        );
    }

    const maxViews = Math.max(...data.map(d => d.views));
    const chartHeight = 200;

    return (
        <div className="relative h-[200px]">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-6 w-10 flex flex-col justify-between text-xs text-neutral-400">
                <span>{maxViews}</span>
                <span>{Math.round(maxViews / 2)}</span>
                <span>0</span>
            </div>

            {/* Chart */}
            <div className="ml-12 h-full flex items-end gap-1 pb-6">
                {data.map((day, index) => {
                    const heightPercent = maxViews > 0 ? (day.views / maxViews) * 100 : 0;

                    return (
                        <div
                            key={day.date}
                            className="flex-1 group relative"
                        >
                            <div
                                className="w-full bg-violet-500 rounded-t hover:bg-violet-600 transition-colors cursor-pointer"
                                style={{ height: `${(heightPercent / 100) * (chartHeight - 24)}px` }}
                            />

                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                                <div className="bg-neutral-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                                    {day.views} views
                                    <div className="text-neutral-400">{day.date}</div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* X-axis labels */}
            <div className="absolute left-12 right-0 bottom-0 flex justify-between text-xs text-neutral-400 px-1">
                {data.length <= 7
                    ? data.map(d => <span key={d.date}>{new Date(d.date).toLocaleDateString('en', { weekday: 'short' })}</span>)
                    : (
                        <>
                            <span>{data[0]?.date}</span>
                            <span>{data[data.length - 1]?.date}</span>
                        </>
                    )
                }
            </div>
        </div>
    );
}
