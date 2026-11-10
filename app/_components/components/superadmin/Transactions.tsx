"use client";

import { useEffect, useMemo, useState } from "react";
import { IndianRupee, Receipt, School, TrendingUp } from "lucide-react";
import { formatAmount } from "../../utils/format";
import { fetchSuperadminSchools } from "@/lib/api/superadminSchools";
import { useDebounce } from "@/app/_components/hooks/useDebounce";
import {
  SaPage,
  SaPageHeader,
  KpiGrid,
  KpiCard,
  Panel,
  SearchBox,
  DataTable,
  Th,
  Td,
  TablePager,
  InitialsAvatar,
  ShareBar,
  EmptyState,
  LoadingBlock,
  Alert,
} from "./shared/ui";

interface SchoolTurnover {
  slNo: number;
  id: string;
  name: string;
  turnover: number;
  studentCount: number;
}

const PAGE_SIZE = 10;

export default function Transactions() {
  const [schools, setSchools] = useState<SchoolTurnover[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalTransactionCount, setTotalTransactionCount] = useState(0);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);
  const [page, setPage] = useState(1);

  useEffect(() => {
    let cancelled = false;
    fetchSuperadminSchools(new URLSearchParams())
      .then(({ ok, data }) => {
        if (!ok) throw new Error("Failed to load");
        return data;
      })
      .then((data) => {
        if (cancelled) return;
        const rawSchools = (data.schools ?? []) as Array<{
          slNo: number;
          id: string;
          name: string;
          turnover: number;
          studentCount: number;
        }>;
        const list = rawSchools.map((s, i) => ({
          slNo: i + 1,
          id: s.id,
          name: s.name,
          turnover: s.turnover ?? 0,
          studentCount: s.studentCount ?? 0,
        }));
        setSchools(list);
        setTotalTransactionCount((data as { totalTransactionCount?: number }).totalTransactionCount ?? 0);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Error");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const ranked = useMemo(() => [...schools].sort((a, b) => b.turnover - a.turnover), [schools]);
  const filteredSchools = useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase();
    if (!term) return ranked;
    return ranked.filter((s) => s.name.toLowerCase().includes(term));
  }, [ranked, debouncedSearch]);
  const totalPages = Math.max(1, Math.ceil(filteredSchools.length / PAGE_SIZE));
  const paginatedSchools = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredSchools.slice(start, start + PAGE_SIZE);
  }, [filteredSchools, page]);

  const totalTurnover = filteredSchools.reduce((s, r) => s + r.turnover, 0);
  const grandTotal = ranked.reduce((s, r) => s + r.turnover, 0);
  const topTurnover = ranked[0]?.turnover ?? 0;
  const top = ranked[0];

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  return (
    <SaPage>
      <SaPageHeader eyebrow="Finance" title="Fees Transactions" description="Turnover (total amount) per school" />

      {error && <Alert tone="error">{error}</Alert>}

      {!loading && (
        <KpiGrid>
          <KpiCard label="Total amount" value={formatAmount(grandTotal, true)} icon={IndianRupee} tone="green" hint="All fees collected" />
          <KpiCard label="Total transactions" value={totalTransactionCount.toLocaleString("en-IN")} icon={Receipt} hint="Successful payments" />
          <KpiCard
            label="Avg. per school"
            value={formatAmount(schools.length ? Math.round(grandTotal / schools.length) : 0, true)}
            icon={School}
            tone="sky"
            hint={`${schools.length} schools`}
          />
          <KpiCard
            label="Top school"
            value={top ? formatAmount(top.turnover, true) : "—"}
            icon={TrendingUp}
            tone="gold"
            hint={top ? top.name : "No data yet"}
          />
        </KpiGrid>
      )}

      <Panel
        title="Turnover by school"
        description="Ranked by total fees collected"
        actions={<SearchBox value={search} onChange={setSearch} placeholder="Search school" className="w-full sm:w-72" />}
        bodyClassName="p-0"
      >
        {loading ? (
          <LoadingBlock label="Loading transactions…" />
        ) : paginatedSchools.length === 0 ? (
          <EmptyState icon={Receipt} title="No schools found" />
        ) : (
          <>
            <DataTable
              minWidth={680}
              head={
                <tr>
                  <Th className="w-16">Rank</Th>
                  <Th>School</Th>
                  <Th align="right">Students</Th>
                  <Th className="w-[28%]">Share of turnover</Th>
                  <Th align="right">Turnover</Th>
                </tr>
              }
            >
              {paginatedSchools.map((s, index) => {
                const rank = ranked.indexOf(s) + 1;
                const share = grandTotal > 0 ? (s.turnover / grandTotal) * 100 : 0;
                return (
                  <tr key={s.id} className="hover:bg-elev-2">
                    <Td className="text-fg-subtle tabular-nums">
                      <span
                        className={`inline-flex h-7 w-7 items-center justify-center rounded-lg text-xs font-semibold ${
                          rank <= 3 ? "bg-accent/15 text-accent-fg" : "bg-elev-2 text-fg-subtle"
                        }`}
                      >
                        {rank || (page - 1) * PAGE_SIZE + index + 1}
                      </span>
                    </Td>
                    <Td>
                      <div className="flex items-center gap-3">
                        <InitialsAvatar name={s.name} size="sm" />
                        <span className="truncate font-semibold text-fg">{s.name}</span>
                      </div>
                    </Td>
                    <Td align="right" className="text-fg-muted tabular-nums">
                      {s.studentCount.toLocaleString("en-IN")}
                    </Td>
                    <Td>
                      <div className="flex items-center gap-3">
                        <ShareBar value={s.turnover} max={topTurnover} tone={rank <= 3 ? "gold" : "navy"} />
                        <span className="w-12 shrink-0 text-right text-xs text-fg-subtle tabular-nums">{share.toFixed(1)}%</span>
                      </div>
                    </Td>
                    <Td align="right" className="font-semibold text-fg tabular-nums">
                      {formatAmount(s.turnover)}
                    </Td>
                  </tr>
                );
              })}
              <tr className="bg-well">
                <Td />
                <Td className="font-semibold text-fg">{search ? "Total (filtered)" : "Total"}</Td>
                <Td />
                <Td className="text-xs text-fg-subtle">
                  Total transactions: <span className="font-semibold text-fg">{totalTransactionCount.toLocaleString("en-IN")}</span>
                </Td>
                <Td align="right" className="font-semibold text-fg tabular-nums">
                  {formatAmount(totalTurnover)}
                </Td>
              </tr>
            </DataTable>
            <TablePager page={page} totalPages={totalPages} total={filteredSchools.length} pageSize={PAGE_SIZE} onChange={setPage} />
          </>
        )}
      </Panel>
    </SaPage>
  );
}
