import { User, Phone } from "lucide-react";
import type { StudentProfile } from "./parentProfileTypes";

export function StudentDetailsSection({
  student,
  userMobile,
}: {
  student: StudentProfile["student"];
  userMobile: string | null | undefined;
}) {
  const s = student;
  return (
    <section className="rounded-xl sm:rounded-2xl md:rounded-2xl bg-elev-1 border border-line p-3 sm:p-4 md:p-6 lg:p-8 transition-all duration-200 hover:border-line-strong">
      <h2 className="text-base sm:text-xl md:text-2xl font-bold text-fg mb-4 flex items-center gap-2">
        <User className="w-6 h-6 text-primary" />
        Student details
      </h2>

      {/* General information */}
      <h3 className="text-sm sm:text-base font-semibold text-fg mb-2">General Information</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        {[
          { label: "Full name", value: s.name || "—" },
          { label: "Student ID", value: s.admissionNumber },
          { label: "Gender", value: (s as { gender?: string }).gender ?? "—" },
          { label: "Age", value: s.age !== null ? String(s.age) : "—" },
          { label: "Date of birth", value: s.dob || "—" },
          { label: "Previous school", value: (s as { previousSchool?: string }).previousSchool || "—" },
          { label: "Class", value: s.class?.displayName ?? "—" },
          { label: "Section", value: s.class?.section || "—" },
          { label: "Status", value: (s as { status?: string }).status || "Active" },
        ].map(({ label, value }) => (
          <div key={label} className="group">
            <p className="text-fg-subtle text-xs sm:text-sm mb-1 uppercase tracking-wide">{label}</p>
            <p className="text-fg font-medium rounded-lg sm:rounded-xl bg-elev-1 border border-line px-3 py-2 sm:px-4 sm:py-3 transition-colors group-hover:border-line-strong text-sm sm:text-base break-words">
              {value || "—"}
            </p>
          </div>
        ))}
      </div>

      {/* Parent / guardian info */}
      <h3 className="text-sm sm:text-base font-semibold text-fg mt-8 mb-2">Parent Information</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
        <div className="rounded-lg sm:rounded-xl bg-elev-1 border border-line px-3 py-2.5 sm:px-4 sm:py-3 flex items-center gap-2 sm:gap-3 transition-colors hover:border-line-strong min-w-0">
          <User className="w-5 h-5 text-primary shrink-0" />
          <div>
            <p className="text-fg-subtle text-xs">Guardian name</p>
            <p className="text-fg font-medium">{s.fatherName || "—"}</p>
          </div>
        </div>
        <div className="rounded-lg sm:rounded-xl bg-elev-1 border border-line px-3 py-2.5 sm:px-4 sm:py-3 flex items-center gap-2 sm:gap-3 transition-colors hover:border-line-strong min-w-0">
          <Phone className="w-5 h-5 text-primary shrink-0" />
          <div>
            <p className="text-fg-subtle text-xs">Contact</p>
            <p className="text-fg font-medium">{s.phone || userMobile || "—"}</p>
          </div>
        </div>
      </div>

    </section>
  );
}
