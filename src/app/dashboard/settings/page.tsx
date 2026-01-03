import { db } from "@/db";
import { profiles } from "@/db/schema";
import { auth, currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { IntegrationsSettings } from "@/components/dashboard/IntegrationsSettings";

export default async function SettingsPage() {
    const { userId } = await auth();
    if (!userId) redirect("/sign-in");

    const profile = await db.query.profiles.findFirst({
        where: eq(profiles.id, userId),
    });

    const user = await currentUser();

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Settings</h1>
                <p className="text-neutral-500">Manage your account and platform preferences.</p>
            </div>

            <div className="grid gap-6">
                <Card className="shadow-sm border-neutral-100">
                    <CardHeader>
                        <CardTitle>Profile Information</CardTitle>
                        <CardDescription>Update your personal details.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" disabled value={user?.emailAddresses[0]?.emailAddress || ""} />
                        </div>
                        <Separator />
                        <div className="flex justify-end">
                            <Button disabled className="bg-neutral-200 text-neutral-500">Save Changes</Button>
                        </div>
                    </CardContent>
                </Card>

                <IntegrationsSettings
                    initialCalComUsername={profile?.calComUsername}
                    onboardingStatus={profile?.onboardingStatus as any}
                />

                <Card className="shadow-sm border-red-100 bg-red-50/30">
                    <CardHeader>
                        <CardTitle className="text-red-900">Danger Zone</CardTitle>
                        <CardDescription className="text-red-700">Irreversible actions for your account.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="destructive" className="bg-red-600 hover:bg-red-700">Delete Account</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
