"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { WorkspaceSwitcher } from "./WorkspaceSwitcher";

export function Topbar() {
    const { user } = useUser();

    return (
        <header className="flex h-16 items-center justify-between border-b border-neutral-100 bg-white px-6">
            <div className="flex w-full max-w-md items-center gap-2">
                <div className="relative w-full">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-400" />
                    <Input
                        placeholder="Search..."
                        className="w-full h-9 bg-neutral-50 pl-9 border-none focus-visible:ring-1 focus-visible:ring-neutral-200 transition-all"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2">
                <WorkspaceSwitcher />

                <div className="h-4 w-[1px] bg-neutral-100 mx-2" />

                <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                        elements: {
                            userButtonAvatarBox: "h-8 w-8 border border-neutral-200 shadow-sm"
                        }
                    }}
                />
            </div>
        </header>
    );
}
