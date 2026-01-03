"use client";

import { useState } from "react";
import { Trash2, Loader2, AlertTriangle } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { deleteLanding } from "@/app/dashboard/landings/actions";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function DeleteLandingAction({ id, name }: { id: string, name: string }) {
    const [loading, setLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
        try {
            const res = await deleteLanding(id);
            if (res.success) {
                toast.success(`Landing "${name}" deleted successfully`);
            } else {
                toast.error(res.error || "Failed to delete landing");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
            setShowConfirm(false);
        }
    };

    return (
        <>
            <DropdownMenuItem
                onSelect={(e) => {
                    e.preventDefault();
                    setShowConfirm(true);
                }}
                className="flex items-center gap-2 text-red-600 focus:text-red-700"
            >
                <Trash2 className="h-4 w-4" /> Delete
            </DropdownMenuItem>

            <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <div className="flex items-center gap-2 text-red-600 mb-2">
                            <AlertTriangle className="h-5 w-5" />
                            <DialogTitle>Delete Landing Page</DialogTitle>
                        </div>
                        <DialogDescription className="text-neutral-500">
                            Are you sure you want to delete <span className="font-bold text-neutral-900">"{name}"</span>?
                            This action cannot be undone and all associated data will be permanently removed.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-3 mt-6">
                        <Button
                            variant="outline"
                            onClick={() => setShowConfirm(false)}
                            disabled={loading}
                            className="px-6"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={loading}
                            className="bg-red-600 hover:bg-red-700 px-6 font-bold"
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
                            Delete Project
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
