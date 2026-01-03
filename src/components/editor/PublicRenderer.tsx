"use client";

import React from 'react';
import { Editor, Frame } from "@craftjs/core";
import { Container } from './selectors/Container';
import { Text } from './selectors/Text';
import { Button } from './selectors/Button';
import { Hero } from './selectors/Hero';
import { LeadForm } from './selectors/LeadForm';
import { PricingTable } from './selectors/PricingTable';
import { FeatureCards } from './selectors/FeatureCards';
import { CalCom } from './selectors/CalCom';
import { FAQ } from './selectors/FAQ';
import { LogoCloud } from './selectors/LogoCloud';
import { Header } from "./selectors/Header";
import { Footer } from "./selectors/Footer";

// Map of component names to their actual implementations.
const publicResolvers = {
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
};

import { LandingProvider } from './LandingContext';

interface PublicRendererProps {
    data: string | any;
    landingId: string;
    integrations?: {
        calCom?: string | null;
    };
}

/**
 * PublicRenderer uses Craft.js in read-only mode (enabled={false}).
 * This provides the necessary context for selectors like Container and Hero
 * while ensuring the page is not interactive/editable.
 */
export const PublicRenderer: React.FC<PublicRendererProps> = ({ data, landingId, integrations }) => {
    if (!data) {
        return (
            <div className="flex items-center justify-center p-20 text-neutral-400 italic">
                No content to display.
            </div>
        );
    }

    // Ensure data is string if it's an object (sometimes DB returns parsed JSON)
    const jsonString = typeof data === 'string' ? data : JSON.stringify(data);

    return (
        <LandingProvider landingId={landingId} integrations={integrations}>
            <Editor enabled={false} resolver={publicResolvers}>
                <div className="public-render-root">
                    <Frame data={jsonString} />
                </div>
            </Editor>
        </LandingProvider>
    );
};
