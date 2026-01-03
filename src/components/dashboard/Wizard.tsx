"use client";

import { useState, useEffect } from "react";
import { X, ChevronRight, ChevronLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { updateOnboardingStatus } from "@/app/actions/onboarding";

export interface WizardStep {
    title: string;
    description: string;
    content?: React.ReactNode;
}

interface WizardProps {
    wizardKey: string;
    steps: WizardStep[];
    isOpen: boolean;
    onClose: () => void;
    showSkip?: boolean;
}

export function Wizard({ wizardKey, steps, isOpen, onClose, showSkip = true }: WizardProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [open, setOpen] = useState(isOpen);

    useEffect(() => {
        setOpen(isOpen);
        if (isOpen) setCurrentStep(0);
    }, [isOpen]);

    const isLastStep = currentStep === steps.length - 1;

    const handleNext = () => {
        if (isLastStep) {
            handleComplete();
        } else {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        setCurrentStep(prev => prev - 1);
    };

    const handleComplete = async () => {
        setOpen(false);
        onClose();
        // Persist progress
        await updateOnboardingStatus(wizardKey);
    };

    const handleSkip = async () => {
        setOpen(false);
        onClose();
        await updateOnboardingStatus(wizardKey);
    };

    return (
        <Dialog open={open} onOpenChange={(v) => {
            if (!v) handleSkip();
        }}>
            <DialogContent showCloseButton={false} className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl rounded-3xl">
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-8 text-white relative">
                    <button
                        onClick={handleSkip}
                        className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-white/20">
                        <span className="text-xl font-bold font-mono">
                            {currentStep + 1}
                        </span>
                    </div>

                    <h2 className="text-2xl font-black tracking-tight mb-2">
                        {steps[currentStep].title}
                    </h2>
                    <p className="text-blue-100 text-lg leading-relaxed">
                        {steps[currentStep].description}
                    </p>
                </div>

                <div className="p-8 bg-white space-y-8">
                    {steps[currentStep].content && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                            {steps[currentStep].content}
                        </div>
                    )}

                    {/* Progress Bar */}
                    <div className="flex gap-1.5 h-1 w-full bg-neutral-100 rounded-full overflow-hidden">
                        {steps.map((_, i) => (
                            <div
                                key={i}
                                className={`flex-1 transition-all duration-500 ${i <= currentStep ? "bg-blue-600" : "bg-neutral-100"
                                    }`}
                            />
                        ))}
                    </div>

                    <div className="flex items-center justify-between">
                        {showSkip && (
                            <Button
                                variant="ghost"
                                onClick={handleSkip}
                                className="text-neutral-400 hover:text-neutral-900 px-0"
                            >
                                Skip Guide
                            </Button>
                        )}
                        <div className="flex gap-3 ml-auto">
                            {currentStep > 0 && (
                                <Button
                                    variant="outline"
                                    onClick={handleBack}
                                    className="rounded-2xl border-neutral-200"
                                >
                                    <ChevronLeft className="h-4 w-4 mr-1" /> Back
                                </Button>
                            )}
                            <Button
                                onClick={handleNext}
                                className="bg-blue-600 hover:bg-blue-700 rounded-2xl min-w-[120px] shadow-lg shadow-blue-200 group transition-all"
                            >
                                {isLastStep ? (
                                    <>Got it! <Check className="h-4 w-4 ml-2" /></>
                                ) : (
                                    <>Next <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" /></>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
