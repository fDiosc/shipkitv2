"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Settings2, Calendar, Loader2 } from "lucide-react";
import { saveIntegrations } from "@/app/dashboard/landings/actions";
import { toast } from "sonner";
import { useLanding } from "./LandingContext";

export function ProjectSettingsModal({ landingId }: { landingId: string }) {
    const { integrations } = useLanding();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [calCom, setCalCom] = useState(integrations?.calCom || "");

    const handleSave = async () => {
        setLoading(true);
        try {
            const res = await saveIntegrations(landingId, { ...integrations, calCom });
            if (res.success) {
                toast.success("Project settings updated!");
                setOpen(false);
                // We might need a way to refresh the context here, 
                // but since it's a server action with revalidatePath, 
                // a page refresh or router.refresh() might be needed if not automatic.
                window.location.reload();
            } else {
                toast.error(res.error || "Failed to save settings");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <Settings2 className="h-4 w-4" />
                    Project Settings
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Project Settings</DialogTitle>
                    <DialogDescription>
                        Configure integrations specifically for this landing page.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm font-bold text-neutral-900 border-b pb-2">
                            <Calendar className="h-4 w-4 text-blue-600" />
                            Cal.com Integration
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="project-calcom">Override Cal.com Link</Label>
                            <div className="flex gap-2">
                                <div className="flex items-center px-3 border border-r-0 border-neutral-200 rounded-l-md bg-neutral-50 text-neutral-500 text-xs">
                                    cal.com/
                                </div>
                                <Input
                                    id="project-calcom"
                                    placeholder="username/event"
                                    value={calCom}
                                    onChange={(e) => setCalCom(e.target.value)}
                                    className="rounded-l-none text-sm"
                                />
                            </div>
                            <p className="text-[10px] text-neutral-500 italic">
                                Leave empty to use your global default from Dashboard Settings.
                            </p>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        onClick={handleSave}
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 w-full font-bold"
                    >
                        {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        Save Settings
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
