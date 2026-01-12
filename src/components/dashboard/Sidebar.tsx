"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Globe,
    BarChart3,
    Settings,
    ChevronLeft,
    ChevronRight,
    PlusCircle,
    Users,
    Play,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "../brand/Logo";
import { WorkspaceSwitcher } from "./WorkspaceSwitcher";
import { useWorkspace } from "@/hooks/useWorkspace";

export function Sidebar() {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { workspace } = useWorkspace();

    // Build nav items with workspace slug
    const workspaceSlug = workspace?.slug || "";
    const basePath = workspaceSlug ? `/dashboard/${workspaceSlug}` : "/dashboard";

    const navItems = [
        { name: "Dashboard", href: basePath, icon: LayoutDashboard },
        { name: "Demos", href: `${basePath}/demos`, icon: Play },
        { name: "Landings", href: `${basePath}/landings`, icon: Globe },
        { name: "Leads", href: `${basePath}/leads`, icon: Users },
        { name: "Analytics", href: `${basePath}/analytics`, icon: BarChart3 },
        { name: "Settings", href: `${basePath}/settings`, icon: Settings },
    ];

    // Check if current path matches (exact for dashboard, startsWith for others)
    const isActive = (href: string) => {
        if (href === basePath) {
            return pathname === href;
        }
        return pathname?.startsWith(href);
    };

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
                    const active = isActive(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                active
                                    ? "bg-blue-50 text-blue-600"
                                    : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
                            )}
                        >
                            <item.icon className={cn(
                                "h-5 w-5 shrink-0 transition-colors",
                                active ? "text-blue-600" : "text-neutral-400 group-hover:text-neutral-600"
                            )} />
                            {!isCollapsed && (
                                <span className="ml-3 truncate animate-in fade-in duration-500">{item.name}</span>
                            )}
                        </Link>
                    );
                })}
            </nav>


            {/* Collapse Toggle */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-neutral-100 bg-white text-neutral-400 shadow-sm hover:text-neutral-900 transition-transform active:scale-95"
            >
                {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>

            {/* Bottom context / Branding */}
            {!isCollapsed && (
                <div className="mt-auto border-t border-neutral-100 p-4">
                    <div className="flex items-center justify-between group/plan">
                        <div>
                            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Plan</p>
                            <p className="text-sm font-semibold text-neutral-900 capitalize">
                                {workspace?.plan || "Free"}
                            </p>
                        </div>
                        {workspace?.plan !== "pro" && (
                            <Link
                                href={`${basePath}/settings/billing`}
                                className="text-[11px] font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-2 py-1 rounded-md transition-colors"
                            >
                                Upgrade
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </aside>
    );
}

