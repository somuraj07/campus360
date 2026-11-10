"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, ChevronRight } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getRecentLogins, type RecentLogin } from "../../utils/recentLogins";

type Props = {
  open: boolean;
  onClose: () => void;
  currentEmail?: string;
};

const LOGIN_URL = "/admin/login";

export default function SwitchAccountsModal({ open, onClose, currentEmail }: Props) {
  const router = useRouter();
  const [accounts, setAccounts] = useState<RecentLogin[]>([]);

  useEffect(() => {
    if (open) {
      setAccounts(getRecentLogins());
    }
  }, [open]);

  const handleSwitch = (account: RecentLogin) => {
    onClose();
    signOut({ redirect: false }).then(() => {
      router.push(`${LOGIN_URL}?email=${encodeURIComponent(account.email)}`);
    });
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-overlay z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-surface rounded-2xl shadow-pop max-w-md w-full border border-line overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-line">
            <h3 className="text-lg font-semibold text-fg">Switch Account</h3>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-elev-3 text-fg-muted hover:text-fg"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-4 max-h-[320px] overflow-y-auto">
            {accounts.length === 0 ? (
              <p className="text-fg-subtle text-sm py-6 text-center">
                No previous logins found. Logout and sign in to add accounts here.
              </p>
            ) : (
              <div className="space-y-2">
                {accounts.map((account) => {
                  const isCurrent = account.email === currentEmail;
                  return (
                    <button
                      key={account.email}
                      onClick={() => !isCurrent && handleSwitch(account)}
                      disabled={isCurrent}
                      className={`
                        w-full flex items-center gap-3 px-4 py-3 rounded-xl
                        transition-all text-left
                        ${isCurrent
                          ? "bg-elev-1 border border-line cursor-default opacity-70"
                          : "hover:bg-elev-3 border border-transparent hover:border-line"
                        }
                      `}
                    >
                      <div className="w-10 h-10 rounded-full bg-elev-2 flex items-center justify-center shrink-0">
                        <User size={20} className="text-fg-muted" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-fg truncate">
                          {account.name || account.email}
                        </p>
                        <p className="text-xs text-fg-subtle truncate">{account.email}</p>
                      </div>
                      {!isCurrent && (
                        <ChevronRight size={18} className="text-fg-subtle shrink-0" />
                      )}
                      {isCurrent && (
                        <span className="text-xs text-primary font-medium shrink-0">
                          Current
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <p className="px-5 py-3 text-xs text-fg-subtle border-t border-line-subtle">
            You will need to enter the password for the selected account.
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
