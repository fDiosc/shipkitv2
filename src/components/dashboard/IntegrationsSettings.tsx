"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { updateProfile } from "@/app/actions/profile";
import { Calendar } from "lucide-react";

export function IntegrationsSettings({
    initialCalComUsername
}: {
    initialCalComUsername?: string | null
}) {
    const [calComUsername, setCalComUsername] = useState(initialCalComUsername || "");
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        setLoading(true);
        try {
            const res = await updateProfile({ calComUsername });
            if (res.success) {
                toast.success("Global integrations updated successfully!");
            } else {
                toast.error(res.error || "Failed to update integrations");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="shadow-sm border-neutral-100">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-50 rounded-lg">
                        <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                        <CardTitle>Global Integrations</CardTitle>
                        <CardDescription>Configure default settings for all your landing pages.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="calcom">Cal.com Default Link</Label>
                        <div className="flex gap-2">
                            <div className="flex items-center px-3 border border-r-0 border-neutral-200 rounded-l-md bg-neutral-50 text-neutral-500 text-sm">
                                cal.com/
                            </div>
                            <Input
                                id="calcom"
                                placeholder="username/event"
                                value={calComUsername}
                                onChange={(e) => setCalComUsername(e.target.value)}
                                className="rounded-l-none"
                            />
                        </div>
                        <p className="text-xs text-neutral-500">
                            This link will be used as the default for all "Cal.com Scheduler" blocks in your landings.
                        </p>
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button
                        onClick={handleSave}
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 font-bold"
                    >
                        {loading ? "Saving..." : "Save Integrations"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
