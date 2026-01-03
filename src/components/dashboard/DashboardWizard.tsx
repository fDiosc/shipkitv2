"use client";

import { useState, useEffect } from "react";
import { Wizard, WizardStep } from "./Wizard";
import { getProfile } from "@/app/actions/profile";

export function DashboardWizard() {
    const [showWizard, setShowWizard] = useState(false);

    useEffect(() => {
        getProfile().then(profile => {
            const status = (profile?.onboardingStatus as any) || {};
            // If they just finished onboarding but haven't seen the welcome guide
            if (!status.dashboardWelcome) {
                setShowWizard(true);
            }
        });
    }, []);

    const welcomeSteps: WizardStep[] = [
        {
            title: "Welcome to ShipKit Dashboard! 🏠",
            description: "You're all set! This is your command center. From here you can manage your landing pages, track leads, and see how your projects are growing.",
        },
        {
            title: "Ready for Launch? 🚀",
            description: "The best way to start is by creating your first project. Click the 'New Landing' button in the top right to let our AI build something amazing for you.",
        },
        {
            title: "Need help? 💡",
            description: "If you ever get stuck, just click the help button in the bottom right corner to restart any of our guided tours.",
        },
    ];

    return (
        <Wizard
            wizardKey="dashboardWelcome"
            isOpen={showWizard}
            steps={welcomeSteps}
            onClose={() => setShowWizard(false)}
        />
    );
}
