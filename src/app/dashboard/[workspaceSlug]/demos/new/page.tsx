"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useWorkspace } from "@/hooks/useWorkspace";
import { createDemo } from "@/app/actions/demos";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2, Play, Sparkles } from "lucide-react";
import Link from "next/link";

export default function NewDemoPage() {
    const router = useRouter();
    const { workspace } = useWorkspace();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!workspace) {
            setError("No workspace selected");
            return;
        }

        if (!name.trim()) {
            setError("Name is required");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const result = await createDemo(workspace.id, name.trim(), description.trim() || undefined);

            if (result.success && result.demo) {
                router.push(`/dashboard/${workspace.slug}/demos/${result.demo.id}`);
            } else {
                setError("Failed to create demo");
            }
        } catch (err) {
            console.error("Error creating demo:", err);
            setError("An error occurred while creating the demo");
        } finally {
            setIsLoading(false);
        }
    };

    if (!workspace) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            {/* Back Link */}
            <Link
                href={`/dashboard/${workspace.slug}/demos`}
                className="inline-flex items-center text-sm text-neutral-500 hover:text-neutral-900"
            >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Demos
            </Link>

            {/* Header */}
            <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
                    <Play className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-neutral-900">Create New Demo</h1>
                <p className="text-neutral-500 mt-2">
                    Give your demo a name and description to get started
                </p>
            </div>

            {/* Form */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Demo Details</CardTitle>
                    <CardDescription>
                        You can change these settings later
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name *</Label>
                            <Input
                                id="name"
                                placeholder="e.g., Product Onboarding Tour"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={isLoading}
                                autoFocus
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description (optional)</Label>
                            <Textarea
                                id="description"
                                placeholder="Briefly describe what this demo shows..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                disabled={isLoading}
                                rows={3}
                            />
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm bg-red-50 border border-red-100 rounded-lg px-4 py-3">
                                {error}
                            </div>
                        )}

                        <div className="flex gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}
                                disabled={isLoading}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isLoading || !name.trim()}
                                className="flex-1 gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="h-4 w-4" />
                                        Create Demo
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Tips */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                <h3 className="font-semibold text-blue-900 mb-3">💡 Quick Tips</h3>
                <ul className="space-y-2 text-sm text-blue-800">
                    <li>• Upload screenshots of your product to create screens</li>
                    <li>• Add hotspots to make areas clickable</li>
                    <li>• Create a guided tour with step-by-step tooltips</li>
                    <li>• Publish and share with a unique URL or embed code</li>
                </ul>
            </div>
        </div>
    );
}
