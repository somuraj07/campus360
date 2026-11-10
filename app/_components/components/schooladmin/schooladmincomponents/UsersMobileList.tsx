"use client";

import { Pencil, Trash2 } from "lucide-react";
import RoleBadge from "./RoleBadge";
import StatusBadge from "./StatusBadge";
import { IUser } from "@/app/_components/constants/addUserTable";
import { AVATAR_URL } from "@/app/_components/constants/images";

type Props = {
  users: IUser[];
  loading?: boolean;
  onEdit: (user: IUser) => void;
  onDelete: (user: IUser) => void;
  getLastActive: (user: IUser) => string;
};

export default function UsersMobileList({
  users,
  loading = false,
  onEdit,
  onDelete,
  getLastActive,
}: Props) {
  return (
    <div className="md:hidden space-y-3">
      {loading && (
        <div className="rounded-2xl border border-line bg-elev-1 px-4 py-8 text-center text-fg-muted text-sm">
          Loading users...
        </div>
      )}

      {!loading && users.length === 0 && (
        <div className="rounded-2xl border border-line bg-elev-1 px-4 py-8 text-center text-fg-muted text-sm">
          No users found.
        </div>
      )}

      {!loading &&
        users.map((row) => (
          <div
            key={row.id}
            className="rounded-2xl border border-line bg-elev-1 p-4"
          >
            <div className="flex items-center gap-3">
              <img
                src={row.photoUrl || AVATAR_URL}
                alt={row.name}
                className="h-11 w-11 rounded-full object-cover border border-line"
              />
              <div className="min-w-0">
                <div className="text-sm font-semibold text-fg truncate">{row.name}</div>
                <div className="text-xs text-fg-subtle truncate">{row.email}</div>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <RoleBadge role={row.role} />
              <StatusBadge status="active" />
            </div>

            <div className="mt-3 text-xs text-fg-muted">
              Last active: <span className="text-fg-muted">{getLastActive(row)}</span>
            </div>

            <div className="mt-3 flex items-center justify-end gap-2">
              {row.role !== "SCHOOLADMIN" && (
                <button
                  type="button"
                  onClick={() => row.role === "TEACHER" && onEdit(row)}
                  disabled={row.role !== "TEACHER"}
                  className={`p-2 rounded-lg transition-colors ${
                    row.role === "TEACHER"
                      ? "text-fg-muted hover:text-fg hover:bg-elev-3"
                      : "text-fg-faint cursor-not-allowed"
                  }`}
                  title={
                    row.role === "TEACHER"
                      ? "Edit user"
                      : "Editing is available for teachers only"
                  }
                >
                  <Pencil size={16} />
                </button>
              )}
              <button
                type="button"
                onClick={() => onDelete(row)}
                className="p-2 rounded-lg text-fg-muted hover:text-red-700 dark:hover:text-red-400 hover:bg-elev-3 transition-colors"
                title="Delete user"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
    </div>
  );
}
