"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LeadFormField {
    id: string;
    type: 'email' | 'text' | 'select';
    label: string;
    placeholder?: string;
    required: boolean;
    options?: string[];
}

interface LeadFormConfig {
    title: string;
    subtitle?: string;
    buttonText: string;
    fields: LeadFormField[];
    backgroundColor?: string;
    textColor?: string;
    buttonColor?: string;
}

interface LeadFormModalProps {
    config: LeadFormConfig;
    onSubmit: (data: Record<string, string>) => Promise<void>;
    onSkip?: () => void;
    onClose?: () => void;
    branding?: boolean;
}

export function LeadFormModal({
    config,
    onSubmit,
    onSkip,
    onClose,
    branding = true,
}: LeadFormModalProps) {
    const [formData, setFormData] = useState<Record<string, string>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate
        const newErrors: Record<string, string> = {};

        for (const field of config.fields) {
            const value = formData[field.id] || '';

            if (field.required && !value) {
                newErrors[field.id] = 'This field is required';
            } else if (field.type === 'email' && value && !validateEmail(value)) {
                newErrors[field.id] = 'Please enter a valid email';
            }
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsSubmitting(true);
        try {
            await onSubmit(formData);
        } catch (error) {
            console.error('Lead form submission error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (fieldId: string, value: string) => {
        setFormData(prev => ({ ...prev, [fieldId]: value }));
        if (errors[fieldId]) {
            setErrors(prev => {
                const next = { ...prev };
                delete next[fieldId];
                return next;
            });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            {/* Modal */}
            <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Close button */}
                {onClose && (
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-lg hover:bg-neutral-100 text-neutral-400 transition-colors z-10"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Header */}
                    <div
                        className="p-6 text-center"
                        style={{
                            backgroundColor: config.backgroundColor,
                            color: config.textColor,
                        }}
                    >
                        <h2 className="text-xl font-bold mb-1">
                            {config.title}
                        </h2>
                        {config.subtitle && (
                            <p className="text-sm opacity-80">
                                {config.subtitle}
                            </p>
                        )}
                    </div>

                    {/* Form Fields */}
                    <div className="p-6 space-y-4">
                        {config.fields.map((field) => (
                            <div key={field.id} className="space-y-1.5">
                                <Label className="text-sm font-medium text-neutral-700">
                                    {field.label}
                                    {field.required && (
                                        <span className="text-red-500 ml-0.5">*</span>
                                    )}
                                </Label>

                                {field.type === 'select' ? (
                                    <select
                                        value={formData[field.id] || ''}
                                        onChange={(e) => handleChange(field.id, e.target.value)}
                                        className="w-full h-10 px-3 border border-neutral-200 rounded-lg bg-white focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-shadow"
                                    >
                                        <option value="">Select...</option>
                                        {field.options?.map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <Input
                                        type={field.type}
                                        value={formData[field.id] || ''}
                                        onChange={(e) => handleChange(field.id, e.target.value)}
                                        placeholder={field.placeholder}
                                        className="h-10"
                                    />
                                )}

                                {errors[field.id] && (
                                    <p className="text-xs text-red-500">
                                        {errors[field.id]}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="px-6 pb-6 space-y-3">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3 text-sm font-semibold rounded-lg bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-50 transition-colors"
                            style={{
                                backgroundColor: config.buttonColor || undefined,
                            }}
                        >
                            {isSubmitting ? 'Submitting...' : config.buttonText}
                        </button>

                        {onSkip && (
                            <button
                                type="button"
                                onClick={onSkip}
                                className="w-full py-2 text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
                            >
                                Skip for now
                            </button>
                        )}
                    </div>

                    {/* Branding */}
                    {branding && (
                        <div className="px-6 pb-4 text-center">
                            <a
                                href="https://shipkit.app/productstory"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-neutral-400 hover:text-neutral-500 transition-colors"
                            >
                                Powered by ProductStory
                            </a>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}

/**
 * Default lead form configuration
 */
export const defaultLeadFormConfig: LeadFormConfig = {
    title: "Get a personalized demo",
    subtitle: "Fill out the form to continue watching",
    buttonText: "Continue",
    fields: [
        {
            id: 'email',
            type: 'email',
            label: 'Work Email',
            placeholder: 'you@company.com',
            required: true,
        },
        {
            id: 'firstName',
            type: 'text',
            label: 'First Name',
            placeholder: 'John',
            required: true,
        },
        {
            id: 'lastName',
            type: 'text',
            label: 'Last Name',
            placeholder: 'Doe',
            required: false,
        },
        {
            id: 'company',
            type: 'text',
            label: 'Company',
            placeholder: 'Acme Inc',
            required: false,
        },
    ],
};
