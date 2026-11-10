"use client";

import type { StudentCredentialRow } from "./types";
import { passwordUnavailableLabel } from "./passwordStateLabel";
import { ResetOneButton, type ResetOneProps } from "./ResetOneButton";

function PasswordCell({ row, reset }: { row: StudentCredentialRow; reset: ResetOneProps }) {
  if (row.passwordVerified) {
    return (
      <span className="font-mono text-sm text-primary">{row.password}</span>
    );
  }
  return (
    <div>
      <span className="text-sm text-amber-700 dark:text-amber-300">{passwordUnavailableLabel(row)}</span>
      {row.passwordState !== "NO_DOB" && row.passwordState !== "PENDING" ? <ResetOneButton row={row} {...reset} /> : null}
    </div>
  );
}

type Props = {
  rows: StudentCredentialRow[];
  reset: ResetOneProps;
};

/** Card layout for phone & tablet — easier to read than a wide table. */
export default function StudentCredentialsMobileList({ rows, reset }: Props) {
  if (rows.length === 0) {
    return (
      <p className="rounded-xl border border-line bg-well py-10 text-center text-sm text-fg-subtle lg:hidden">
        No students found for this filter.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-3 lg:hidden">
      {rows.map((row) => (
        <li
          key={row.studentId}
          className="rounded-xl border border-line bg-well p-3.5 shadow-sm sm:p-4"
        >
          <div className="mb-2 flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate font-semibold text-fg">{row.name}</p>
              <p className="mt-0.5 truncate font-mono text-xs text-sky-800 dark:text-sky-200">{row.email}</p>
            </div>
            <span className="shrink-0 rounded-lg border border-line bg-elev-1 px-2 py-0.5 text-[10px] font-medium text-fg-muted">
              {row.className || "—"}
              {row.section ? ` · ${row.section}` : ""}
            </span>
          </div>
          <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs sm:grid-cols-3">
            <div>
              <dt className="text-fg-subtle">DOB</dt>
              <dd className="mt-0.5 tabular-nums text-fg">{row.dob || "—"}</dd>
            </div>
            <div>
              <dt className="text-fg-subtle">Password</dt>
              <dd className="mt-0.5">
                <PasswordCell row={row} reset={reset} />
              </dd>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <dt className="text-fg-subtle">Admission no.</dt>
              <dd className="mt-0.5 font-mono text-fg">{row.admissionNumber}</dd>
            </div>
          </dl>
        </li>
      ))}
    </ul>
  );
}
