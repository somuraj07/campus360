"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { SaPage, SaPageHeader, KpiGrid, KpiCard, btnClass } from "../common/ui";

import CircularFilters from "./circularTab/CircularFilters";
import CircularList from "./circularTab/CircularList";
import CircularForm from "./circularTab/CircularForm";
import { CircularRow } from "./circularTab/types";
import { AlertTriangle, Plus, Scroll, Users, X } from "lucide-react";
import TimellyLoader from "../common/TimellyLoader";
import {
  invalidateCirculars,
  loadCirculars,
  peekCirculars,
} from "@/lib/school/loadSchoolAdminFastTabs";

export default function SchoolAdminCircularsTab() {
  const [circulars, setCirculars] = useState<CircularRow[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [importance, setImportance] = useState("All Importance");
  const [recipient, setRecipient] = useState("all");
  const [classId, setClassId] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchCirculars = useCallback(async (revalidate = false) => {
    if (!revalidate) {
      const cached = peekCirculars(recipient, classId);
      if (cached) {
        setCirculars(cached as CircularRow[]);
        setLoading(false);
        void fetchCirculars(true);
        return;
      }
    }

    try {
      setLoading(circulars.length === 0);
      const rows = await loadCirculars(recipient, classId, { revalidate });
      setCirculars(rows as CircularRow[]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [circulars.length, recipient, classId]);

  useEffect(() => {
    fetchCirculars();
  }, [fetchCirculars]);

  const filteredCirculars = useMemo(() => {
    return circulars.filter((c) => {
      if (search && !c.subject.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      if (importance !== "All Importance" && c.importanceLevel !== importance) {
        return false;
      }
      return true;
    });
  }, [circulars, search, importance]);

  const urgentCount = circulars.filter((c) => /high|urgent|critical/i.test(String(c.importanceLevel ?? ""))).length;

  return (
    <SaPage>
      <SaPageHeader
        eyebrow="Communication"
        title="Circulars & Notices"
        description="Create and manage school-wide circulars"
        actions={
          <button
            type="button"
            onClick={() => setShowForm((prev) => !prev)}
            aria-expanded={showForm}
            className={btnClass(showForm ? "secondary" : "primary")}
          >
            {showForm ? <X size={16} /> : <Plus size={16} />}
            {showForm ? "Cancel" : "Create Circular"}
          </button>
        }
      />

      {showForm && (
        <CircularForm
          onClose={() => setShowForm(false)}
          onSuccess={async () => {
            setShowForm(false);
            invalidateCirculars();
            await fetchCirculars(true);
          }}
        />
      )}

      <KpiGrid>
        <KpiCard label="Total Circulars" value={circulars.length} icon={Scroll} hint="For the selected audience" />
        <KpiCard label="Showing" value={filteredCirculars.length} icon={Users} tone="sky" hint="After filters" />
        <KpiCard label="High Importance" value={urgentCount} icon={AlertTriangle} tone="red" hint="Marked high or urgent" />
        <KpiCard
          label="Audience"
          value={recipient === "all" ? "All" : recipient.charAt(0).toUpperCase() + recipient.slice(1).toLowerCase()}
          icon={Users}
          tone="gold"
          hint={classId ? "Single class" : "All classes"}
        />
      </KpiGrid>

      <CircularFilters
        search={search}
        onSearch={setSearch}
        importance={importance}
        onImportance={setImportance}
        recipient={recipient}
        onRecipient={setRecipient}
        classId={classId}
        onClassId={setClassId}
      />

      {loading && circulars.length === 0 ? (
        <TimellyLoader compact title="Loading circulars" steps={["Notices", "Recipients", "Attachments"]} />
      ) : (
        <>
          {loading && <p className="text-xs text-fg-subtle">Refreshing circulars...</p>}
          <CircularList circulars={filteredCirculars} />
        </>
      )}
    </SaPage>
  );
}
