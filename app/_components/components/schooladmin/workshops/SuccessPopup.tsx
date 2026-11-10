"use client";

import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type SuccessPopupProps = {
  open: boolean;
  title: string;
  description: string;
  onClose: () => void;
  portalTargetId?: string;
};

export default function SuccessPopup({
  open,
  title,
  description,
  onClose,
  portalTargetId,
}: SuccessPopupProps) {
  const [mounted, setMounted] = useState(false);
  const [targetEl, setTargetEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !portalTargetId) return;
    setTargetEl(document.getElementById(portalTargetId));
  }, [mounted, portalTargetId]);

  if (!open || !mounted) return null;
  if (portalTargetId && !targetEl) return null;

  const wrapperClassName = portalTargetId
    ? "absolute inset-0 z-50 flex items-center justify-center bg-overlay "
    : "fixed inset-0 z-50 flex items-center justify-center bg-overlay ";

  const popup = (
    <div
      className={wrapperClassName}
      onClick={onClose}
    >
      <div
        className="max-w-[360px] rounded-2xl bg-surface border border-line px-5 py-4 text-left shadow-pop "
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center text-primary">
            <Check size={18} />
          </div>
          <div>
            <div className="text-fg font-semibold text-sm">{title}</div>
            <div className="text-fg-muted text-xs mt-0.5">{description}</div>
          </div>
        </div>
      </div>
    </div>
  );
  if (portalTargetId && targetEl) {
    return createPortal(popup, targetEl);
  }
  return createPortal(popup, document.body);
}
