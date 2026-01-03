import { LandingProvider, useLanding } from '../LandingContext';

import { useNode } from "@craftjs/core";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";
import { Calendar } from "lucide-react";

export const CalCom = ({
    calLink,
    title,
    subtitle
}: {
    calLink?: string;
    title?: string;
    subtitle?: string;
}) => {
    const { connectors: { connect, drag }, selected } = useNode((state) => ({
        selected: state.events.selected,
    }));

    const { integrations } = useLanding();

    useEffect(() => {
        (async function () {
            const cal = await getCalApi();
            cal("ui", { theme: "light", styles: { branding: { brandColor: "#000000" } }, hideEventTypeDetails: false, layout: "month_view" });
        })();
    }, []);

    // Priority: 
    // 1. Specifically set in this block (calLink prop)
    // 2. Global/Project-level integration
    const link = calLink || integrations?.calCom;

    return (
        <div
            ref={(ref: any) => connect(drag(ref))}
            className={`py-20 px-6 transition-all ${selected ? "ring-2 ring-primary" : ""}`}
        >
            <div className="max-w-4xl mx-auto text-center mb-12 space-y-4">
                <h2 className="text-3xl md:text-5xl font-black text-neutral-900 tracking-tight">
                    {title || "Book a Demo"}
                </h2>
                <p className="text-neutral-500 text-lg max-w-xl mx-auto">
                    {subtitle || "See how our platform can help you grow your business. Pick a time that works for you."}
                </p>
            </div>

            <div className="max-w-4xl mx-auto rounded-[2.5rem] overflow-hidden border border-neutral-100 premium-shadow bg-white min-h-[400px] flex items-center justify-center">
                {link ? (
                    <Cal
                        calLink={link}
                        style={{ width: "100%", height: "100%", minHeight: "600px" }}
                        config={{ layout: "month_view" }}
                    />
                ) : (
                    <div className="text-center p-12 space-y-6">
                        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
                            <Calendar className="w-8 h-8" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold text-neutral-900">Cal.com Link Required</h3>
                            <p className="text-neutral-500 max-w-sm mx-auto">
                                To enable the booking calendar, please provide a link. You can set a global link in
                                <span className="font-bold text-neutral-900"> Project Settings</span> or configure
                                this specific block in the <span className="font-bold text-neutral-900">Sidebar</span>.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const CalComSettings = () => {
    const { actions: { setProp }, calLink, title, subtitle } = useNode((node) => ({
        calLink: node.data.props.calLink,
        title: node.data.props.title,
        subtitle: node.data.props.subtitle,
    }));

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label>Cal.com Link (e.g., username/meeting)</Label>
                <Input
                    value={calLink}
                    placeholder="username/meeting-type"
                    onChange={(e) => setProp((props: any) => props.calLink = e.target.value)}
                />
                <p className="text-[10px] text-neutral-400 italic">
                    Overrides Project Settings for this block only.
                </p>
            </div>
            <div className="space-y-2">
                <Label>Section Title</Label>
                <Input
                    value={title}
                    onChange={(e) => setProp((props: any) => props.title = e.target.value)}
                />
            </div>
            <div className="space-y-2">
                <Label>Subtitle</Label>
                <Input
                    value={subtitle}
                    onChange={(e) => setProp((props: any) => props.subtitle = e.target.value)}
                />
            </div>
        </div>
    );
};

CalCom.craft = {
    displayName: "Cal.com Scheduler",
    props: {
        calLink: "",
        title: "Ready to get started?",
        subtitle: "Schedule a quick call with our team to explore the possibilities.",
    },
    related: {
        settings: CalComSettings,
    },
};
