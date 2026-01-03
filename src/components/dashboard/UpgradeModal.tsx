"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Rocket, Sparkles, Zap } from "lucide-react";

interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description: string;
    type: "ai" | "landings";
}

export function UpgradeModal({ isOpen, onClose, title, description, type }: UpgradeModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] p-0 border-none overflow-hidden bg-white shadow-2xl rounded-3xl">
                <div className="relative p-8 pt-12 text-center">
                    {/* Background decorative element */}
                    <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-50 to-white -z-10" />

                    <div className="mx-auto w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 mb-6 rotate-3">
                        {type === "ai" ? (
                            <Sparkles className="h-8 w-8 text-white animate-pulse" />
                        ) : (
                            <Rocket className="h-8 w-8 text-white" />
                        )}
                    </div>

                    <DialogHeader className="space-y-4">
                        <DialogTitle className="text-3xl font-black text-neutral-900 tracking-tight">
                            {title}
                        </DialogTitle>
                        <DialogDescription className="text-lg text-neutral-500 font-medium leading-relaxed">
                            {description}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="mt-10 space-y-4 text-left bg-neutral-50 p-6 rounded-2xl border border-neutral-100">
                        <p className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-2">Pro Tier Benefits:</p>
                        <div className="grid grid-cols-1 gap-3">
                            <Benefit item="Unlimited landing pages" />
                            <Benefit item="Unlimited AI generations" />
                            <Benefit item="Custom domains" />
                            <Benefit item="Remove ShipKit branding" />
                        </div>
                    </div>

                    <DialogFooter className="mt-10 flex-col sm:flex-col gap-3">
                        <Button
                            className="w-full h-14 text-lg font-black bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-100 rounded-2xl transition-all active:scale-95"
                            onClick={() => window.location.href = "/dashboard/settings"} // Or Stripe checkout
                        >
                            Upgrade to Pro - $15/mo
                        </Button>
                        <Button
                            variant="ghost"
                            className="w-full text-neutral-400 font-bold hover:text-neutral-900"
                            onClick={onClose}
                        >
                            Maybe later
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function Benefit({ item }: { item: string }) {
    return (
        <div className="flex items-center gap-3">
            <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center">
                <Check className="h-3 w-3 text-blue-600" />
            </div>
            <span className="text-sm font-bold text-neutral-700">{item}</span>
        </div>
    );
}
