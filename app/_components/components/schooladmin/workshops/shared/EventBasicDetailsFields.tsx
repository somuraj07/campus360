import { GraduationCap, Users } from "lucide-react";
import SearchInput from "../../../common/SearchInput";
import EventSelectField from "../EventSelectField";
import { difficultyOptions, eventTypeOptions } from "./createEventFormOptions";

export function EventBasicDetailsFields({
  title,
  setTitle,
  classId,
  setClassId,
  classes,
  classStudents,
  studentIds,
  setStudentIds,
  type,
  setType,
  difficulty,
  setDifficulty,
  description,
  setDescription,
  additionalInfo,
  setAdditionalInfo,
}: {
  title: string;
  setTitle: (v: string) => void;
  classId: string;
  setClassId: (v: string) => void;
  classes: { id: string; name: string; section: string | null }[];
  classStudents: { id: string; user?: { name?: string | null } }[];
  studentIds: string[];
  setStudentIds: (updater: (prev: string[]) => string[]) => void;
  type: string;
  setType: (v: string) => void;
  difficulty: string;
  setDifficulty: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
  additionalInfo: string;
  setAdditionalInfo: (v: string) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="text-xs font-bold text-fg-subtle uppercase tracking-wider">
        Basic Details
      </div>

      <SearchInput
        label="Event Title"
        placeholder="e.g. Science Fair 2026"
        value={title}
        onChange={setTitle}
        variant="glass"
      />

      <div className="text-xs font-bold text-fg-subtle uppercase tracking-wider mt-4">
        Target Audience
      </div>
      <div>
        <label className="block text-xs sm:text-sm mb-1 text-fg-muted flex items-center gap-1.5">
          <GraduationCap size={14} /> Target Class (optional)
        </label>
        <p className="text-xs text-fg-subtle mb-2">Restrict to a class, or select specific students below.</p>
        <select
          value={classId}
          onChange={(e) => setClassId(e.target.value)}
          className="w-full rounded-xl bg-well border border-line-strong text-sm text-fg px-4 py-3 focus:outline-none focus:border-primary/60"
        >
          <option value="" className="text-on-primary">All classes (open to all)</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id} className="text-on-primary">
              {c.name}{c.section ? ` - ${c.section}` : ""}
            </option>
          ))}
        </select>
      </div>
      {classStudents.length > 0 && (
        <div>
          <label className="block text-xs sm:text-sm mb-1 text-fg-muted flex items-center gap-1.5">
            <Users size={14} /> Pre-register students (optional)
          </label>
          <p className="text-xs text-fg-subtle mb-2">Select specific students to pre-register for this event.</p>
          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 rounded-xl bg-well border border-line">
            {classStudents.map((s) => {
              const sel = studentIds.includes(s.id);
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() =>
                    setStudentIds((prev) =>
                      sel ? prev.filter((id) => id !== s.id) : [...prev, s.id]
                    )
                  }
                  className={`px-3 py-1.5 rounded-lg text-xs border transition-all ${
                    sel ? "bg-primary/20 text-primary border-primary/50" : "bg-elev-1 text-fg-muted border-line"
                  }`}
                >
                  {s.user?.name ?? "Student"}
                </button>
              );
            })}
          </div>
          {studentIds.length > 0 && (
            <p className="text-xs text-primary mt-1">{studentIds.length} student(s) selected</p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <EventSelectField
          label="Type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          options={eventTypeOptions}
          placeholder="Select type"
        />
        <EventSelectField
          label="Difficulty Level"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          options={difficultyOptions}
          placeholder="Select level"
        />
      </div>

      <div>
        <label className="block text-xs sm:text-sm mb-1 text-fg-muted">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief description of the event..."
          rows={4}
          className="w-full rounded-xl bg-well border border-line-strong text-sm text-fg placeholder:text-fg-faint px-4 py-3 focus:outline-none focus:ring-0 focus:border-primary/60 no-scrollbar"
        />
      </div>

      <div>
        <label className="block text-xs sm:text-sm mb-1 text-fg-muted">
          Additional Info / Certificates
        </label>
        <textarea
          value={additionalInfo}
          onChange={(e) => setAdditionalInfo(e.target.value)}
          placeholder="Details about certificates, prerequisites, or special instructions..."
          rows={4}
          className="w-full rounded-xl bg-well border border-line-strong text-sm text-fg placeholder:text-fg-faint px-4 py-3 focus:outline-none focus:ring-0 focus:border-primary/60 no-scrollbar"
        />
      </div>
    </div>
  );
}
