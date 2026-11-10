"use client";

import { useMemo, useState } from "react";
import { CreditCard, Pencil, School, ShieldCheck, ShieldOff, Users, Wallet } from "lucide-react";
import { useSubscriptionsState, SubscriptionMobileCard, EditSubscriptionModal, ModeBadge, StatusPill } from "./shared/subscriptions";
import {
  SaPage,
  SaPageHeader,
  KpiGrid,
  KpiCard,
  Panel,
  SearchBox,
  Segmented,
  DataTable,
  Th,
  Td,
  InitialsAvatar,
  EmptyState,
  LoadingBlock,
  Alert,
  btnClass,
} from "./shared/ui";

export type BillingMode = "PARENT_SUBSCRIPTION" | "SCHOOL_PAID";

export interface SubscriptionRow {
  id: string;
  name: string;
  location: string;
  createdAt: string;
  billingMode: BillingMode;
  parentSubscriptionAmount: number | null;
  parentSubscriptionTrialDays: number;
  isActive: boolean;
}

type StatusFilter = "all" | "active" | "inactive";

export default function Subscriptions() {
  const { rows, loading, error, search, setSearch, savingId, editing, setEditing, handleModalSave } =
    useSubscriptionsState();
  const [status, setStatus] = useState<StatusFilter>("all");

  const counts = useMemo(
    () => ({
      active: rows.filter((r) => r.isActive).length,
      inactive: rows.filter((r) => !r.isActive).length,
      parent: rows.filter((r) => r.billingMode === "PARENT_SUBSCRIPTION").length,
      school: rows.filter((r) => r.billingMode === "SCHOOL_PAID").length,
    }),
    [rows]
  );

  const visible = useMemo(
    () => rows.filter((r) => (status === "all" ? true : status === "active" ? r.isActive : !r.isActive)),
    [rows, status]
  );

  return (
    <SaPage>
      <SaPageHeader eyebrow="Billing" title="Subscriptions" description="SaaS mode, pricing, and activation per school" />

      {!loading && (
        <KpiGrid>
          <KpiCard label="Active schools" value={counts.active} icon={ShieldCheck} tone="green" hint="Full portal access" />
          <KpiCard label="Deactivated" value={counts.inactive} icon={ShieldOff} tone="red" hint="Access locked" />
          <KpiCard label="Parent subscription" value={counts.parent} icon={Users} tone="sky" hint="Parents pay yearly" />
          <KpiCard label="School paid" value={counts.school} icon={Wallet} tone="gold" hint="Billed to the school" />
        </KpiGrid>
      )}

      {error && <Alert tone="error">{error}</Alert>}

      <Panel
        title="Schools"
        description={loading ? undefined : `${visible.length} shown`}
        actions={
          <>
            <Segmented<StatusFilter>
              value={status}
              onChange={setStatus}
              options={[
                { value: "all", label: "All" },
                { value: "active", label: "Active" },
                { value: "inactive", label: "Deactivated" },
              ]}
            />
            <SearchBox value={search} onChange={setSearch} placeholder="Search by school name…" className="w-full sm:w-64" />
          </>
        }
        bodyClassName="p-0"
      >
        {loading ? (
          <LoadingBlock label="Loading subscriptions…" />
        ) : visible.length === 0 ? (
          <EmptyState icon={School} title="No schools match your search." />
        ) : (
          <>
            <div className="hidden lg:block">
              <DataTable
                minWidth={940}
                head={
                  <tr>
                    <Th>School</Th>
                    <Th>Mode</Th>
                    <Th align="right">Amount (₹ / year)</Th>
                    <Th align="right">Trial</Th>
                    <Th>Created</Th>
                    <Th>Status</Th>
                    <Th align="right">
                      <span className="sr-only">Actions</span>
                    </Th>
                  </tr>
                }
              >
                {visible.map((r) => (
                  <tr key={r.id} className="hover:bg-elev-2">
                    <Td>
                      <div className="flex items-center gap-3">
                        <InitialsAvatar name={r.name} size="sm" />
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-fg">{r.name}</p>
                          <p className="truncate text-xs text-fg-subtle">{r.location || "—"}</p>
                        </div>
                      </div>
                    </Td>
                    <Td>
                      <ModeBadge mode={r.billingMode} />
                    </Td>
                    <Td align="right" className="font-medium text-fg tabular-nums">
                      {r.billingMode === "PARENT_SUBSCRIPTION" ? (
                        typeof r.parentSubscriptionAmount === "number" ? (
                          `₹${r.parentSubscriptionAmount.toLocaleString("en-IN")}`
                        ) : (
                          <span className="text-fg-faint">—</span>
                        )
                      ) : (
                        <span className="text-xs font-normal text-fg-subtle">Included</span>
                      )}
                    </Td>
                    <Td align="right" className="text-fg-muted tabular-nums">
                      {r.billingMode === "PARENT_SUBSCRIPTION" ? `${r.parentSubscriptionTrialDays ?? 0}d` : "—"}
                    </Td>
                    <Td className="text-fg-muted">{new Date(r.createdAt).toLocaleDateString("en-IN")}</Td>
                    <Td>
                      <StatusPill active={r.isActive} />
                    </Td>
                    <Td align="right">
                      <button type="button" onClick={() => setEditing(r)} className={btnClass("secondary", "sm")}>
                        <Pencil size={13} />
                        Edit
                      </button>
                    </Td>
                  </tr>
                ))}
              </DataTable>
            </div>
            <div className="space-y-3 p-4 lg:hidden">
              {visible.map((r) => (
                <SubscriptionMobileCard key={r.id} row={r} onEdit={setEditing} />
              ))}
            </div>
          </>
        )}
      </Panel>

      <Alert tone="info">
        <span className="flex items-start gap-2">
          <CreditCard size={16} className="mt-0.5 shrink-0" />
          Deactivating a school locks access for its admins, teachers, and parents. They will see a RS Solutions notice
          to contact support when trying to use the portal.
        </span>
      </Alert>

      {editing && (
        <EditSubscriptionModal
          editing={editing}
          setEditing={setEditing}
          savingId={savingId}
          onCancel={() => setEditing(null)}
          onSave={() => void handleModalSave()}
        />
      )}
    </SaPage>
  );
}
