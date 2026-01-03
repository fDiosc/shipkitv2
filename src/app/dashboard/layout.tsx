import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { ContextualHelp } from "@/components/dashboard/ContextualHelp";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-white overflow-hidden">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Topbar */}
                <Topbar />

                {/* Dynamic Content */}
                <main className="flex-1 overflow-y-auto bg-neutral-50/50 p-6">
                    <div className="mx-auto max-w-7xl">
                        {children}
                    </div>
                </main>
            </div>
            <ContextualHelp />
        </div>
    );
}
