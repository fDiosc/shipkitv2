"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Globe,
    BarChart3,
    Settings,
    Rocket,
    ChevronLeft,
    ChevronRight,
    PlusCircle,
    Users
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "../brand/Logo";

const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Landings", href: "/dashboard/landings", icon: Globe },
    { name: "Leads", href: "/dashboard/leads", icon: Users },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <aside
            className={cn(
                "relative flex flex-col border-r border-neutral-100 bg-white transition-all duration-300 ease-in-out",
                isCollapsed ? "w-[70px]" : "w-[260px]"
            )}
        >
            {/* Header / Logo */}
            <div className="flex h-16 items-center px-4">
                <Logo
                    iconOnly={isCollapsed}
                    className="!gap-2"
                />
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 px-2 py-4">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-blue-50 text-blue-600"
                                    : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
                            )}
                        >
                            <item.icon className={cn(
                                "h-5 w-5 shrink-0 transition-colors",
                                isActive ? "text-blue-600" : "text-neutral-400 group-hover:text-neutral-600"
                            )} />
                            {!isCollapsed && (
                                <span className="ml-3 truncate animate-in fade-in duration-500">{item.name}</span>
                            )}
                            {isActive && !isCollapsed && (
                                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-600" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Quick Action */}
            {!isCollapsed && (
                <div className="px-4 pb-4">
                    <Button className="w-full justify-start gap-2 bg-blue-600 hover:bg-blue-700">
                        <PlusCircle className="h-4 w-4" />
                        <span>New Landing</span>
                    </Button>
                </div>
            )}

            {/* Collapse Toggle */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-neutral-100 bg-white text-neutral-400 shadow-sm hover:text-neutral-900 transition-transform active:scale-95"
            >
                {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>

            {/* Bottom context / Branding */}
            {!isCollapsed && (
                <div className="border-t border-neutral-100 p-4">
                    <div className="rounded-lg bg-neutral-50 p-3">
                        <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Plan</p>
                        <p className="text-sm font-bold text-neutral-900">Free Tier</p>
                        <Link href="/dashboard/billing" className="mt-2 block text-xs font-medium text-blue-600 hover:underline">
                            Upgrade to Pro
                        </Link>
                    </div>
                </div>
            )}
        </aside>
    );
}
