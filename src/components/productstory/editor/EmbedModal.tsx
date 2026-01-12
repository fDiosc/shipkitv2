"use client";

import { useState, useEffect } from "react";
import { X, Copy, Check, Code, Link as LinkIcon, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface EmbedModalProps {
    demoId: string;
    publicId: string;
    isOpen: boolean;
    onClose: () => void;
}

type EmbedType = 'iframe' | 'script' | 'link';

export function EmbedModal({ demoId, publicId, isOpen, onClose }: EmbedModalProps) {
    const [embedType, setEmbedType] = useState<EmbedType>('iframe');
    const [width, setWidth] = useState('100%');
    const [height, setHeight] = useState('600px');
    const [autoplay, setAutoplay] = useState(false);
    const [copied, setCopied] = useState(false);

    const baseUrl = typeof window !== 'undefined'
        ? window.location.origin
        : process.env.NEXT_PUBLIC_APP_URL || 'https://shipkit.app';

    const embedUrl = `${baseUrl}/productstory/d/${publicId}`;
    const embedUrlWithParams = autoplay ? `${embedUrl}?autoplay=true` : embedUrl;

    const iframeCode = `<iframe
  src="${embedUrlWithParams}"
  width="${width}"
  height="${height}"
  frameborder="0"
  allowfullscreen
  allow="clipboard-write"
></iframe>`;

    const scriptCode = `<!-- ProductStory Embed -->
<div id="productstory-${publicId}"></div>
<script src="${baseUrl}/embed.js"></script>
<script>
  ProductStory.init({
    container: '#productstory-${publicId}',
    demoId: '${publicId}',
    width: '${width}',
    height: '${height}',
    autoplay: ${autoplay}
  });
</script>`;

    const directLink = embedUrl;

    const getEmbedCode = () => {
        switch (embedType) {
            case 'iframe': return iframeCode;
            case 'script': return scriptCode;
            case 'link': return directLink;
        }
    };

    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(getEmbedCode());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl w-full max-w-2xl mx-4 shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-neutral-900">Embed Demo</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-500"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Embed Type Tabs */}
                    <div className="flex gap-2">
                        {([
                            { type: 'iframe' as EmbedType, label: 'iFrame', icon: Code },
                            { type: 'script' as EmbedType, label: 'JavaScript', icon: Code },
                            { type: 'link' as EmbedType, label: 'Direct Link', icon: LinkIcon },
                        ]).map(({ type, label, icon: Icon }) => (
                            <button
                                key={type}
                                onClick={() => setEmbedType(type)}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                                    embedType === type
                                        ? "bg-violet-100 text-violet-700"
                                        : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                                )}
                            >
                                <Icon className="w-4 h-4" />
                                {label}
                            </button>
                        ))}
                    </div>

                    {/* Settings */}
                    {embedType !== 'link' && (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-neutral-700">Width</Label>
                                <Input
                                    value={width}
                                    onChange={(e) => setWidth(e.target.value)}
                                    placeholder="100% or 800px"
                                    className="h-10"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-neutral-700">Height</Label>
                                <Input
                                    value={height}
                                    onChange={(e) => setHeight(e.target.value)}
                                    placeholder="600px"
                                    className="h-10"
                                />
                            </div>
                        </div>
                    )}

                    {/* Autoplay Toggle */}
                    <div className="flex items-center justify-between py-2">
                        <div>
                            <Label className="text-sm font-medium text-neutral-900">Auto-play demo</Label>
                            <p className="text-xs text-neutral-500">Start playing automatically when loaded</p>
                        </div>
                        <Switch
                            checked={autoplay}
                            onCheckedChange={setAutoplay}
                        />
                    </div>

                    {/* Code Block */}
                    <div className="relative">
                        <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto text-sm font-mono">
                            {getEmbedCode()}
                        </pre>
                        <button
                            onClick={copyToClipboard}
                            className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded text-white text-xs font-medium transition-colors"
                        >
                            {copied ? (
                                <>
                                    <Check className="w-3.5 h-3.5" />
                                    Copied!
                                </>
                            ) : (
                                <>
                                    <Copy className="w-3.5 h-3.5" />
                                    Copy
                                </>
                            )}
                        </button>
                    </div>

                    {/* Preview Link */}
                    <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                        <div>
                            <p className="text-sm font-medium text-neutral-900">Preview your demo</p>
                            <p className="text-xs text-neutral-500 truncate max-w-md">{directLink}</p>
                        </div>
                        <a
                            href={directLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5"
                        >
                            <Button variant="outline" size="sm" className="gap-1.5">
                                <ExternalLink className="w-3.5 h-3.5" />
                                Open
                            </Button>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
