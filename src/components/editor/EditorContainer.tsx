"use client";

import { Editor, Frame, Element } from "@craftjs/core";
import { Toolbox } from "./Toolbox";
import { SettingsPanel } from "./SettingsPanel";
import { Topbar } from "./EditorTopbar";
import { RenderNode } from "./RenderNode";
// Import building blocks
import { Container } from "./selectors/Container";
import { Text } from "./selectors/Text";
import { Button } from "./selectors/Button";
import { Hero } from "./selectors/Hero";
import { LeadForm } from "./selectors/LeadForm";
import { PricingTable } from "./selectors/PricingTable";
import { FeatureCards } from "./selectors/FeatureCards";
import { CalCom } from "./selectors/CalCom";
import { FAQ } from "./selectors/FAQ";
import { LogoCloud } from "./selectors/LogoCloud";
import { Header } from "./selectors/Header";
import { Footer } from "./selectors/Footer";

import { LandingProvider } from "./LandingContext";

export function EditorContainer({
    landingId,
    landingName,
    initialData,
    integrations
}: {
    landingId: string;
    landingName: string;
    initialData?: string | null;
    integrations?: {
        calCom?: string | null;
    };
}) {
    return (
        <Editor
            resolver={{
                Container,
                Text,
                Button,
                Hero,
                LeadForm,
                PricingTable,
                FeatureCards,
                CalCom,
                FAQ,
                LogoCloud,
                Header,
                Footer
            }}
            onRender={RenderNode}
        >
            <LandingProvider landingId={landingId} integrations={integrations}>
                <div className="flex flex-col h-screen bg-neutral-100">
                    <Topbar landingId={landingId} landingName={landingName} />
                    <div className="flex flex-1 overflow-hidden">
                        {/* Toolbox - Left Sidebar */}
                        <Toolbox />

                        {/* Canvas - Center Area */}
                        <main className="flex-1 overflow-y-auto p-8">
                            <div className="mx-auto bg-white shadow-xl min-h-screen max-w-5xl rounded-lg overflow-hidden">
                                <Frame data={initialData || undefined}>
                                    <Element is={Container} padding={20} canvas>
                                        {/* Default initial content if none provided */}
                                        {!initialData && (
                                            <Hero title="Your New Project" subtitle="Edit this page to start validating your idea." />
                                        )}
                                    </Element>
                                </Frame>
                            </div>
                        </main>

                        {/* Settings Panel - Right Sidebar */}
                        <SettingsPanel />
                    </div>
                </div>
            </LandingProvider>
        </Editor>
    );
}
