"use client";

import { useRouter } from "next/navigation";
import { useEditor } from "@craftjs/core";
import { Button } from "@/components/ui/button";
import {
    Save,
    ChevronLeft,
    Play,
    Monitor,
    Smartphone,
    Tablet,
    Check,
    Loader2
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { saveLanding, publishLanding } from "@/app/dashboard/landings/actions";
import { ProjectSettingsModal } from "./ProjectSettingsModal";

export function Topbar({ landingId, landingName }: { landingId: string; landingName: string }) {
    const router = useRouter();
    const { query, actions } = useEditor();
    const [saving, setSaving] = useState(false);
    const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");

    const handleSave = async () => {
        setSaving(true);
        try {
            // Craft.js serialize returns an object that we can store directly in JSONB
            const designJson = JSON.parse(query.serialize());
            const result = await saveLanding(landingId, designJson);

            if (result.success) {
                toast.success("Design saved successfully!");
            } else {
                toast.error(result.error || "Failed to save");
            }
        } finally {
            setSaving(false);
        }
    };

    const handlePublish = async () => {
        setSaving(true);
        try {
            // First save, then publish
            const designJson = JSON.parse(query.serialize());
            await saveLanding(landingId, designJson);
            const result = await publishLanding(landingId);

            if (result.success) {
                toast.success("Landing page published successfully! 🚀");
            } else {
                toast.error(result.error || "Failed to publish");
            }
        } catch (error) {
            toast.error("Error publishing");
        } finally {
            setSaving(false);
        }
    };

    return (
        <header className="h-14 border-b border-neutral-200 bg-white flex items-center justify-between px-4 z-50">
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push("/dashboard/landings")}
                    className="text-neutral-500 hover:text-neutral-900"
                >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Back
                </Button>
                <div className="h-6 w-[1px] bg-neutral-200" />
                <h2 className="text-sm font-semibold text-neutral-900 truncate max-w-[200px]">
                    {landingName}
                </h2>
            </div>

            {/* Device Toggle */}
            <div className="hidden md:flex items-center bg-neutral-100 p-1 rounded-lg gap-1">
                <DeviceButton
                    active={device === "desktop"}
                    onClick={() => setDevice("desktop")}
                    icon={<Monitor className="h-4 w-4" />}
                />
                <DeviceButton
                    active={device === "tablet"}
                    onClick={() => setDevice("tablet")}
                    icon={<Tablet className="h-4 w-4" />}
                />
                <DeviceButton
                    active={device === "mobile"}
                    onClick={() => setDevice("mobile")}
                    icon={<Smartphone className="h-4 w-4" />}
                />
            </div>

            <div className="flex items-center gap-2">
                <ProjectSettingsModal landingId={landingId} />
                <Button variant="outline" size="sm" className="gap-2">
                    <Play className="h-4 w-4" />
                    Preview
                </Button>
                <Button
                    onClick={handleSave}
                    disabled={saving}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 gap-2"
                >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save Draft
                </Button>
                <Button
                    onClick={handlePublish}
                    disabled={saving}
                    size="sm"
                    variant="secondary"
                    className="bg-green-600 hover:bg-green-700 text-white gap-2"
                >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                    Publish
                </Button>
            </div>
        </header>
    );
}

const DeviceButton = ({ active, onClick, icon }: { active: boolean; onClick: () => void; icon: React.ReactNode }) => (
    <button
        onClick={onClick}
        className={`p-1.5 rounded-md transition-all ${active
            ? "bg-white text-blue-600 shadow-sm"
            : "text-neutral-400 hover:text-neutral-600"
            }`}
    >
        {icon}
    </button>
);
