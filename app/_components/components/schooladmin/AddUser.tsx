"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Pencil, Trash2, Users } from "lucide-react";
import { useDebounce } from "@/app/_components/hooks/useDebounce";
import PageTabs from "../schooladmin/schooladmincomponents/PageHeaderTabs";
import UserForm from "./schooladmincomponents/UserForm";
import DeleteConfirmation from "../common/DeleteConfirmation";
import RoleBadge from "./schooladmincomponents/RoleBadge";
import UsersMobileList from "./schooladmincomponents/UsersMobileList";
import InlinePagination from "./schooladmincomponents/InlinePagination";
import { SaPage, SaPageHeader, Panel, SearchBox, ColumnsTable, TablePager, InitialsAvatar, Badge, btnClass } from "../common/ui";
import { IUser, TableColumn } from "@/app/_components/constants/addUserTable";
import { deleteUser } from "@/lib/api/user";
import {
  fetchUserListPage,
  invalidateAddUserPageCache,
  listCacheKey,
  peekUserListPage,
  warmAddUserPage,
} from "@/lib/school/fetchAddUserPage";

export {
  validateUserForm,
  type UserFormErrors,
} from "./schooladmincomponents/userFormValidation";

const PAGE_SIZE = 10;
const LIST_ROLE = "TEACHER";

/** User create/edit UI lives in `UserForm`; field rules are in `userFormValidation.ts`. */
export default function AddUser() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();
  const schoolId = session?.user?.schoolId ?? null;

  const parentTab = searchParams.get("tab");
  const activeTab =
    searchParams.get("view") ?? (parentTab === "add-user" ? "add" : "all");
  const editingUserId = searchParams.get("userId");

  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [revalidating, setRevalidating] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    userId: string;
    userName: string;
  }>({
    isOpen: false,
    userId: "",
    userName: "",
  });

  const listKey = schoolId
    ? listCacheKey(schoolId, page, PAGE_SIZE, debouncedSearch, LIST_ROLE)
    : "";

  const editingUserFromList = useMemo(
    () => users.find((u) => u.id === editingUserId) ?? null,
    [users, editingUserId]
  );

  useEffect(() => {
    if (schoolId) warmAddUserPage(schoolId);
  }, [schoolId]);

  useEffect(() => {
    if (activeTab !== "all") return;
    setPage(1);
  }, [debouncedSearch, activeTab]);

  useEffect(() => {
    if (activeTab !== "all" || !schoolId) return;

    const cached = peekUserListPage(listKey);
    if (cached) {
      setUsers(cached.users);
      setTotalCount(cached.total);
      const tp = Math.max(1, Math.ceil(cached.total / PAGE_SIZE));
      setTotalPages(tp);
      setPage((prev) => Math.min(prev, tp));
      setLoading(false);
    } else {
      setLoading(true);
    }

    const controller = new AbortController();
    setRevalidating(Boolean(cached));

    void fetchUserListPage(schoolId, {
      page,
      pageSize: PAGE_SIZE,
      search: debouncedSearch,
      role: LIST_ROLE,
      revalidate: !cached,
      signal: controller.signal,
    })
      .then((data) => {
        setUsers(data.users);
        setTotalCount(data.total);
        const tp = Math.max(1, Math.ceil(data.total / PAGE_SIZE));
        setTotalPages(tp);
        setPage((prev) => Math.min(prev, tp));
      })
      .catch((err) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        console.error("Failed to fetch users:", err);
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
          setRevalidating(false);
        }
      });

    return () => controller.abort();
  }, [page, debouncedSearch, activeTab, schoolId, listKey]);

  const handleEdit = (user: IUser) => {
    router.push(`?tab=add-user&view=add&userId=${user.id}`);
  };

  const handleDeleteClick = (user: IUser) => {
    setDeleteModal({
      isOpen: true,
      userId: user.id,
      userName: user.name,
    });
  };

  const handleDeleteConfirm = async () => {
    const deletedId = deleteModal.userId;
    const prevUsers = users;
    setUsers((rows) => rows.filter((u) => u.id !== deletedId));
    setTotalCount((n) => Math.max(0, n - 1));

    try {
      const { ok, data } = await deleteUser(deletedId);

      if (!ok) {
        throw new Error(data.message || "Failed to delete user");
      }

      if (schoolId) invalidateAddUserPageCache(schoolId);
      setDeleteModal({ isOpen: false, userId: "", userName: "" });
    } catch (error) {
      setUsers(prevUsers);
      setTotalCount((n) => n + 1);
      throw error;
    }
  };

  const handleFormSuccess = useCallback(() => {
    if (schoolId) invalidateAddUserPageCache(schoolId);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", "add-user");
    params.set("view", "all");
    params.delete("userId");
    router.push(`?${params.toString()}`);
  }, [router, schoolId, searchParams]);

  const getLastActive = (row: IUser) => {
    if (!row.createdAt) return "N/A";
    const date = new Date(row.createdAt);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Now";
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return date.toLocaleDateString();
  };

  const tableColumns: TableColumn[] = [
    {
      header: "User",
      render: (row: IUser) => (
        <div className="flex min-w-0 items-center gap-3">
          <InitialsAvatar name={row.name || row.email || "User"} src={row.photoUrl || null} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-fg">{row.name}</p>
            <p className="truncate text-xs text-fg-subtle">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Role",
      render: (row: IUser) => <RoleBadge role={row.role} />,
    },
    {
      header: "Status",
      render: () => (
        <Badge tone="green" dot>
          Active
        </Badge>
      ),
    },
    {
      header: "Added",
      render: (row: IUser) => <span className="whitespace-nowrap text-sm text-fg-muted">{getLastActive(row)}</span>,
    },
    {
      header: "Actions",
      align: "right" as const,
      render: (row: IUser) => (
        <div className="flex justify-end gap-1.5">
          {row.role !== "SCHOOLADMIN" && (
            <button
              type="button"
              disabled={row.role !== "TEACHER"}
              onClick={() => row.role === "TEACHER" && handleEdit(row)}
              className={btnClass("secondary", "sm")}
              title={row.role === "TEACHER" ? "Edit user" : "Editing is currently available for teachers only"}
            >
              <Pencil size={14} />
              Edit
            </button>
          )}
          <button
            type="button"
            onClick={() => handleDeleteClick(row)}
            className={btnClass("dangerSoft", "sm")}
            title="Delete user"
            aria-label={`Delete ${row.name}`}
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <SaPage>
      <SaPageHeader
        eyebrow="Accounts"
        title="User Management"
        description="Create new users, manage access, and view user directory."
        actions={
          <PageTabs
            tabs={[
              { label: "All Users", value: "all" },
              { label: "Add User", value: "add" },
            ]}
            queryKey="view"
            defaultWhenMissing="add"
          />
        }
      />

      {activeTab === "all" && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
          <Panel
            icon={Users}
            title="All Users"
            description={
              <span className="inline-flex flex-wrap items-center gap-2">
                Showing teachers only
                {totalCount > 0 ? (
                  <>
                    <span aria-hidden>·</span>
                    <span className="font-medium text-fg">{totalCount} total</span>
                  </>
                ) : null}
                {revalidating ? <span className="text-sky-700 dark:text-sky-300">· Updating…</span> : null}
              </span>
            }
            actions={<SearchBox value={search} onChange={setSearch} placeholder="Search users by name or email..." className="w-full sm:w-80" />}
            bodyClassName="p-0"
          >
            <div className="space-y-3 p-4 md:hidden">
              <UsersMobileList
                users={users}
                loading={loading && users.length === 0}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
                getLastActive={getLastActive}
              />
              <InlinePagination page={page} totalPages={totalPages} onChange={setPage} />
            </div>
            <div className="hidden md:block">
              <ColumnsTable
                columns={tableColumns}
                data={users}
                loading={loading && users.length === 0}
                rowKey={(u) => u.id}
                emptyText="No users found"
                minWidth={760}
              />
              <TablePager page={page} totalPages={totalPages} total={totalCount} pageSize={PAGE_SIZE} onChange={setPage} />
            </div>
          </Panel>
        </motion.div>
      )}

      {activeTab === "add" && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
          <UserForm
            mode={editingUserId ? "edit" : "create"}
            schoolId={schoolId}
            listShellUser={editingUserFromList}
            onSuccess={handleFormSuccess}
          />
        </motion.div>
      )}

      <DeleteConfirmation
        isOpen={deleteModal.isOpen}
        userName={deleteModal.userName}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModal({ isOpen: false, userId: "", userName: "" })}
      />
    </SaPage>
  );
}
