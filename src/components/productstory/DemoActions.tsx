"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    MoreHorizontal,
    Edit,
    Trash2,
    Link as LinkIcon,
    Globe,
    Loader2,
    Code,
    Copy,
    Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";
import { deleteDemo } from "@/app/actions/demos";

interface DemoActionsProps {
    demoId: string;
    publicId: string;
    workspaceSlug: string;
    isPublished: boolean;
}

export function DemoActions({ demoId, publicId, workspaceSlug, isPublished }: DemoActionsProps) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [isEmbedCopied, setIsEmbedCopied] = useState(false);

    const baseUrl = typeof window !== "undefined" ? `${window.location.protocol}//${window.location.host}` : "";
    const publicUrl = `${baseUrl}/productstory/d/${publicId}`;
    const embedUrl = `${baseUrl}/productstory/embed/${publicId}`;

    const iframeCode = `<iframe 
  src="${embedUrl}" 
  width="100%" 
  height="600px" 
  frameborder="0" 
  allowfullscreen
></iframe>`;

    const handleCopyLink = () => {
        navigator.clipboard.writeText(publicUrl);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const handleCopyEmbed = () => {
        navigator.clipboard.writeText(iframeCode);
        setIsEmbedCopied(true);
        setTimeout(() => setIsEmbedCopied(false), 2000);
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this demo?")) return;

        setIsDeleting(true);
        try {
            const result = await deleteDemo(demoId);
            if (result.success) {
                router.refresh();
            }
        } catch (error) {
            console.error("Error deleting demo:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2" disabled={isDeleting}>
                    {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                    <Link href={`/dashboard/${workspaceSlug}/demos/${demoId}`}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Demo
                    </Link>
                </DropdownMenuItem>

                {isPublished && (
                    <>
                        <DropdownMenuItem asChild>
                            <a href={publicUrl} target="_blank" rel="noopener noreferrer">
                                <Globe className="h-4 w-4 mr-2" />
                                View Public
                            </a>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleCopyLink}>
                            {isCopied ? <Check className="h-4 w-4 mr-2 text-green-500" /> : <LinkIcon className="h-4 w-4 mr-2" />}
                            {isCopied ? "Copied!" : "Copy Link"}
                        </DropdownMenuItem>

                        <Dialog>
                            <DialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                    <Code className="h-4 w-4 mr-2" />
                                    Embed
                                </DropdownMenuItem>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle>Embed Story</DialogTitle>
                                    <DialogDescription>
                                        Copy this code and paste it into your website.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 pt-4">
                                    <div className="relative">
                                        <pre className="p-4 bg-neutral-900 text-neutral-50 rounded-lg overflow-x-auto text-[13px] leading-relaxed">
                                            {iframeCode}
                                        </pre>
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            className="absolute top-2 right-2 h-8"
                                            onClick={handleCopyEmbed}
                                        >
                                            {isEmbedCopied ? (
                                                <Check className="h-4 w-4 mr-2 text-green-500" />
                                            ) : (
                                                <Copy className="h-4 w-4 mr-2" />
                                            )}
                                            {isEmbedCopied ? "Copied!" : "Copy"}
                                        </Button>
                                    </div>
                                    <p className="text-xs text-neutral-500 italic">
                                        💡 The embed is responsive and will adjust to your container's width.
                                    </p>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </>
                )}

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    className="text-red-600 focus:text-red-600"
                    onClick={handleDelete}
                    disabled={isDeleting}
                >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
