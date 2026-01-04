"use client";

import { useEditor, Element } from "@craftjs/core";
import {
    Type,
    Square,
    MousePointer2,
    Layout,
    Zap,
    CreditCard,
    HelpCircle,
    Users,
    Calendar,
    LayoutIcon,
    PanelsTopLeft,
    Plus
} from "lucide-react";
import { Text } from "./selectors/Text";
import { Button as ButtonSelector } from "./selectors/Button";
import { Container } from "./selectors/Container";
import { Hero } from "./selectors/Hero";
import { LeadForm } from "./selectors/LeadForm";
import { PricingTable } from "./selectors/PricingTable";
import { FeatureCards } from "./selectors/FeatureCards";
import { CalCom } from "./selectors/CalCom";
import { FAQ } from "./selectors/FAQ";
import { LogoCloud } from "./selectors/LogoCloud";
import { Header } from "./selectors/Header";
import { Footer } from "./selectors/Footer";

export const Toolbox = () => {
    const { connectors } = useEditor();

    return (
        <aside className="w-64 bg-white border-r border-neutral-200 flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b border-neutral-200 bg-neutral-50/50">
                <h3 className="text-xs font-black text-neutral-400 uppercase tracking-widest text-center">Toolbox</h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-8">
                {/* Structure Section */}
                <div className="space-y-3">
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider px-1">Structure</p>
                    <div className="grid grid-cols-2 gap-2">
                        <ToolboxItem
                            label="Header"
                            icon={<LayoutIcon size={18} />}
                            move={(ref: HTMLElement) => connectors.create(ref, <Header />)}
                        />
                        <ToolboxItem
                            label="Section"
                            icon={<Layout size={18} />}
                            move={(ref: HTMLElement) => connectors.create(ref, <Element is={Container} padding={20} canvas />)}
                        />
                        <ToolboxItem
                            label="Footer"
                            icon={<PanelsTopLeft size={18} />}
                            move={(ref: HTMLElement) => connectors.create(ref, <Footer />)}
                        />
                    </div>
                </div>

                {/* Elements Section */}
                <div className="space-y-3">
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider px-1">Elements</p>
                    <div className="grid grid-cols-2 gap-2">
                        <ToolboxItem
                            label="Text"
                            icon={<Type size={18} />}
                            move={(ref: HTMLElement) => connectors.create(ref, <Text text="Click to edit" />)}
                        />
                        <ToolboxItem
                            label="Button"
                            icon={<MousePointer2 size={18} />}
                            move={(ref: HTMLElement) => connectors.create(ref, <ButtonSelector text="Click me" />)}
                        />
                    </div>
                </div>

                {/* Modules Section */}
                <div className="space-y-3">
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider px-1">Modules</p>
                    <div className="grid grid-cols-2 gap-2">
                        <ToolboxItem
                            label="Hero"
                            icon={<Square size={18} />}
                            move={(ref: HTMLElement) => connectors.create(ref, <Hero title="Hero Title" subtitle="Subtitle here" />)}
                        />
                        <ToolboxItem
                            label="Waitlist"
                            icon={<Users size={18} />}
                            move={(ref: HTMLElement) => connectors.create(ref, <LeadForm />)}
                        />
                        <ToolboxItem
                            label="Features"
                            icon={<Zap size={18} />}
                            move={(ref: HTMLElement) => connectors.create(ref, <FeatureCards />)}
                        />
                        <ToolboxItem
                            label="Pricing"
                            icon={<CreditCard size={18} />}
                            move={(ref: HTMLElement) => connectors.create(ref, <PricingTable />)}
                        />
                        <ToolboxItem
                            label="FAQ"
                            icon={<HelpCircle size={18} />}
                            move={(ref: HTMLElement) => connectors.create(ref, <FAQ />)}
                        />
                        <ToolboxItem
                            label="Social"
                            icon={<Users size={18} />}
                            move={(ref: HTMLElement) => connectors.create(ref, <LogoCloud />)}
                        />
                        <ToolboxItem
                            label="Cal.com"
                            icon={<Calendar size={18} />}
                            move={(ref: HTMLElement) => connectors.create(ref, <CalCom />)}
                        />
                    </div>
                </div>

                {/* Templates Section */}
                <div className="pt-4 border-t border-neutral-100">
                    <button className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-dashed border-neutral-300 rounded-xl text-xs font-bold text-neutral-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50 transition-all group">
                        <Plus size={14} className="group-hover:rotate-90 transition-transform" />
                        Add Template
                    </button>
                </div>
            </div>
        </aside>
    );
};

const ToolboxItem = ({ label, icon, move }: { label: string; icon: React.ReactNode; move: any }) => {
    return (
        <div
            ref={move}
            className="flex flex-col items-center justify-center aspect-square gap-2 p-3 rounded-2xl border border-neutral-100 bg-white hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5 cursor-grab active:cursor-grabbing transition-all group"
        >
            <div className="p-2.5 rounded-xl bg-neutral-50 group-hover:bg-blue-50 text-neutral-400 group-hover:text-blue-600 transition-colors">
                {icon}
            </div>
            <span className="text-[10px] font-bold text-neutral-500 group-hover:text-blue-700 tracking-tight uppercase">{label}</span>
        </div>
    );
};
