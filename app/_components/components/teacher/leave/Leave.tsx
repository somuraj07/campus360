"use client";

import React, { useState } from "react";
import { Briefcase, GraduationCap } from "lucide-react";
import StudentLeave from "./leavefolder/studentLeave";
import TeacherLeave from "./leavefolder/TeacherLeave";
import { Segmented } from "../../common/ui";

type LeaveView = "student" | "applications";

export default function TeacherLeavesTab() {
  const [activeTab, setActiveTab] = useState<LeaveView>("student");

  return (
    <div className="mx-auto w-full max-w-[1400px] space-y-5 text-fg">
      <Segmented
        value={activeTab}
        onChange={setActiveTab}
        options={[
          {
            value: "student",
            label: (
              <span className="inline-flex items-center gap-1.5">
                <GraduationCap size={14} /> Student Requests
              </span>
            ),
          },
          {
            value: "applications",
            label: (
              <span className="inline-flex items-center gap-1.5">
                <Briefcase size={14} /> My Applications
              </span>
            ),
          },
        ]}
      />
      {activeTab === "student" ? <StudentLeave /> : <TeacherLeave />}
    </div>
  );
}
