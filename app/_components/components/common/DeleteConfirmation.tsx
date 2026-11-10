"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Trash } from "lucide-react";
import { useState } from "react";

interface DeleteConfirmationProps {
    isOpen: boolean;
    userName?: string;
    onConfirm: () => Promise<void>;
    onCancel: () => void;
    title?: string;
    message?: string;
    confirmLabel?: string;
    cancelLabel?: string;
}

export default function DeleteConfirmation({
    isOpen,
    userName,
    onConfirm,
    onCancel,
    title = "Delete User",
    message,
    confirmLabel = "Delete User",
    cancelLabel = "Cancel",
}: DeleteConfirmationProps) {
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleConfirm = async () => {
        setDeleting(true);
        setError(null);
        try {
            await onConfirm();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to delete user");
            setDeleting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onCancel}
                        className="fixed inset-0 bg-overlay z-40"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed inset-0 flex items-center justify-center z-50 p-4"
                    >
                        <div className="bg-surface rounded-2xl shadow-pop max-w-md w-full border
                            border-line p-6 animate-scaleIn">

                            {/* Header */}


                            <div className="w-12 h-12 rounded-full bg-red-400/10 flex items-center justify-center mb-4 mx-auto">
                                <Trash size={20} className="text-red-700 dark:text-red-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-fg text-center">{title}</h3>


                            {/* Content */}
                            <div className="px-6 py-4 space-y-4">
                                <p className="text-fg-muted text-center text-sm mb-2">
                                    {message ?? (
                                        <>
                                            Do you really want to delete{" "}
                                            <span className="text-fg font-semibold">{userName ?? "this item"}</span>?
                                        </>
                                    )}
                                </p>
                                <p className="text-sm text-amber-700 dark:text-amber-400 text-center font-medium">
                                    This action cannot be undone.
                                </p>
                                {!message && (
                                    <p className="text-sm text-fg-muted text-center">
                                        All associated data will be removed from the system.
                                    </p>
                                )}

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/20 border border-red-500/30"
                                    >
                                        <AlertCircle size={16} className="text-red-700 dark:text-red-400 flex-shrink-0" />
                                        <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
                                    </motion.div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 px-6 py-4 border-t border-line">
                                <motion.button
                                    whileHover={{ x: -4 }}
                                    onClick={onCancel}
                                    disabled={deleting}
                                    className="flex-1 py-2.5 bg-elev-1 hover:bg-elev-3 text-fg-muted
                                      font-medium rounded-xl transition-all border border-line"
                                >
                                    {cancelLabel}
                                </motion.button>
                                <motion.button
                                    whileHover={{ x: 4 }}
                                    onClick={handleConfirm}
                                    disabled={deleting}
                                    className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white
                                     font-bold rounded-xl shadow-card shadow-red-500/20 transition-all"
                                >
                                    {deleting ? (
                                        <>
                                            Working...
                                        </>
                                    ) : (
                                        confirmLabel
                                    )}
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
