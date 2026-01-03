"use client";

import React, { createContext, useContext } from 'react';

interface LandingContextType {
    landingId: string | null;
    integrations?: {
        calCom?: string | null;
    };
}

const LandingContext = createContext<LandingContextType>({ landingId: null });

export const LandingProvider = ({
    landingId,
    integrations,
    children
}: {
    landingId: string;
    integrations?: LandingContextType['integrations'];
    children: React.ReactNode
}) => {
    return (
        <LandingContext.Provider value={{ landingId, integrations }}>
            {children}
        </LandingContext.Provider>
    );
};

export const useLanding = () => useContext(LandingContext);
