"use client";

import { useState } from "react";
import { HelpCircle, Sparkles, Wand2, Palette, Settings, BarChart3, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Wizard, WizardStep } from "./Wizard";

export function ContextualHelp() {
    const [activeWizard, setActiveWizard] = useState<string | null>(null);

    const wizards: Record<string, { label: string; icon: any; steps: WizardStep[] }> = {
        dashboardWelcome: {
            label: "Dashboard Tour",
            icon: Sparkles,
            steps: [
                {
                    title: "Welcome to ShipKit Dashboard! 🏠",
                    description: "You're all set! This is your command center. From here you can manage your landing pages, track leads, and see how your projects are growing.",
                },
            ],
        },
        firstLanding: {
            label: "AI Generation Guide",
            icon: Wand2,
            steps: [
                {
                    title: "Let's build your first page! 🚀",
                    description: "ShipKit uses advanced AI to generate high-converting landing pages. Follow these tips to get the best results.",
                },
                {
                    title: "Detail is your superpower ✍️",
                    description: "The more detail you provide, the better. Describe your product's value proposition, key features, and even pricing if you wish. The AI will weave this into a professional narrative.",
                },
            ],
        },
        editorTour: {
            label: "Editor Masterclass",
            icon: Palette,
            steps: [
                {
                    title: "Welcome to the Editor! 🎨",
                    description: "This is where the magic happens. Here you can customize every detail of your landing page.",
                },
                {
                    title: "Visual Editing 🖱️",
                    description: "Click on any element in the center area to select it. Once selected, its specific properties will appear in the right sidebar.",
                },
            ],
        },
        settingsTour: {
            label: "Integrations Hub",
            icon: Settings,
            steps: [
                {
                    title: "Global Integrations 🔌",
                    description: "Connect your favorite tools once, and they'll work across all your landing pages automatically.",
                },
            ],
        },
        analyticsTour: {
            label: "Growth Insights",
            icon: BarChart3,
            steps: [
                {
                    title: "Growth Insights 📊",
                    description: "Welcome to your performance hub. Here you can track how your landing pages are converting visitors into leads.",
                },
            ],
        },
    };

    return (
        <>
            <div className="fixed bottom-6 right-6 z-[60]">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            className="w-12 h-12 rounded-full shadow-2xl bg-white hover:bg-neutral-50 border border-neutral-200 text-blue-600 group transition-all duration-300 hover:scale-110"
                        >
                            <HelpCircle className="h-6 w-6" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 mb-2 rounded-2xl p-2 shadow-2xl border-neutral-100">
                        <DropdownMenuLabel className="flex items-center gap-2 text-neutral-500 font-medium">
                            <Sparkles className="h-4 w-4 text-blue-500" /> Need help?
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-neutral-50" />
                        {Object.entries(wizards).map(([key, wizard]) => (
                            <DropdownMenuItem
                                key={key}
                                onClick={() => setActiveWizard(key)}
                                className="gap-3 p-3 rounded-xl cursor-pointer hover:bg-blue-50 hover:text-blue-700 transition-colors"
                            >
                                <wizard.icon className="h-4 w-4" />
                                {wizard.label}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {
                activeWizard && (
                    <Wizard
                        wizardKey={activeWizard}
                        isOpen={true}
                        steps={wizards[activeWizard].steps}
                        onClose={() => setActiveWizard(null)}
                        showSkip={false} // Don't show skip when manually re-triggering
                    />
                )
            }
        </>
    );
}
