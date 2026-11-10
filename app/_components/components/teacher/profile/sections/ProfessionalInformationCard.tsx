"use client";

import { BriefcaseBusiness } from "lucide-react";
import type { ReactNode } from "react";
import { TeacherProfileData } from "../types";

interface ProfessionalInformationCardProps {
  profile: TeacherProfileData;
}

export default function ProfessionalInformationCard({
  profile,
}: ProfessionalInformationCardProps) {
  const isInactive = profile.status === "Inactive";

  return (
    <section className="overflow-hidden rounded-2xl border border-line bg-elev-1 ">
      <div className="flex items-center gap-3 p-5 sm:px-8">
        <BriefcaseBusiness size={22} className="text-primary" />
        <h3 className="text-lg font-bold text-fg">Professional Information</h3>
      </div>
      <div className="h-px bg-elev-2" />

      <div className="grid grid-cols-1 gap-5 px-5 py-5 sm:grid-cols-2 sm:px-8 sm:py-6">
        <InfoItem label="Teacher Name" value={profile.name} />
        <InfoItem label="Teacher ID" value={profile.teacherId} />
        <InfoItem label="Subject" value={profile.subject} />
        <InfoItem label="Assigned Classes" value={profile.assignedClasses} />
        <InfoItem label="Qualification" value={profile.qualification} />
        <InfoItem label="Experience" value={profile.experience} />
        <InfoItem label="Joining Date" value={profile.joiningDate} />
        <InfoItem
          label="Status"
          value={
            <span
              className={`inline-flex rounded-xl px-3 py-1 text-[10px] font-bold uppercase ${
                isInactive
                  ? "border border-red-400/40 bg-red-400/10 text-red-700 dark:text-red-400"
                  : "border border-primary/40 bg-primary/10 text-primary"
              }`}
            >
              {profile.status}
            </span>
          }
        />
      </div>
    </section>
  );
}

function InfoItem({ label, value }: { label: string; value: ReactNode }) {
  const display =
    value === null || value === undefined || value === "" ? "—" : value;
  return (
    <div className="space-y-2">
      <p className="text-[10px] sm:text-[11px] uppercase tracking-wider text-fg-subtle">{label}</p>
      <div className="text-[13px] sm:text-[14px] font-semibold text-fg">{display}</div>
    </div>
  );
}
