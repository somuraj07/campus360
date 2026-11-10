"use client";

import { useEffect, useState, useMemo } from "react";
import { BookOpen, Calendar, CheckCircle2 } from "lucide-react";
import { Badge, KpiCard } from "../../common/ui";
import { CalendarClock, Hourglass } from "lucide-react";
import PageHeader from "../../common/PageHeader";
import ParentTimellyLoader from "../ParentTimellyLoader";
import { fetchExamTerms } from "@/lib/api/examTerms";

// Interfaces to match your API structure
interface SyllabusUnit {
  id: string;
  unitName: string;
  completedPercent: number;
  order: number;
}

interface SyllabusTracking {
  id: string;
  subject: string;
  completedPercent: number;
  units: SyllabusUnit[];
}

interface ExamSchedule {
  id: string;
  subject: string;
  examDate: string;
  startTime: string;
  durationMin: number;
}

interface TermData {
  id: string;
  name: string;
  status: "COMPLETED" | "UPCOMING" | "ONGOING";
  class: {
    teacher: { name: string | null } | null; name: string; section: string
  };
  teacher?: { name: string };
  schedules: ExamSchedule[];
  syllabus: SyllabusTracking[];
}

export default function ParentExamsTab() {
  const [rawData, setRawData] = useState<TermData[]>([]);
  const [selectedTermName, setSelectedTermName] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [showAllSchedules, setShowAllSchedules] = useState(false);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const { data: result } = await fetchExamTerms();
        const data: TermData[] = Array.isArray(result)
          ? result
          : (result as { terms?: TermData[] })?.terms || [];
        setRawData(data);

        if (data.length > 0) {
          const firstUpcoming = data.find((t) => t.status === "UPCOMING");
          setSelectedTermName(firstUpcoming ? firstUpcoming.name : data[0].name);
        }
      } catch (e) {
        console.error("Fetch failed", e);
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  const uniqueTerms = useMemo(() => {
    const map = new Map<string, { name: string; status: string }>();
    rawData.forEach((t) => {
      if (!map.has(t.name)) {
        map.set(t.name, { name: t.name, status: t.status });
      }
    });
    return Array.from(map.values());
  }, [rawData]);

  const activeTermData = useMemo(() => {
    return rawData.filter((t) => t.name === selectedTermName);
  }, [rawData, selectedTermName]);

  const isTermCompleted = activeTermData.every((t) => t.status === "COMPLETED");

  const activeSchedules = useMemo(() => {
    return activeTermData.flatMap((t) => t.schedules).sort((a, b) =>
      new Date(a.examDate).getTime() - new Date(b.examDate).getTime()
    );
  }, [activeTermData]);

  const activeSubjects = useMemo(() => {
    return Array.from(new Set(activeTermData.flatMap((t) => t.syllabus.map((s) => s.subject))));
  }, [activeTermData]);

  const nextExamDate = activeSchedules[0] ? new Date(activeSchedules[0].examDate) : null;
  const daysLeft = nextExamDate
    ? Math.max(0, Math.ceil((nextExamDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  if (loading) {
    return (
      <div className="p-10 flex justify-center">
        <ParentTimellyLoader preset="exams" className="w-full max-w-2xl" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1400px] pb-10 text-fg">
      <PageHeader
        eyebrow="Your child"
        title="Exams & Syllabus"
        subtitle={selectedTermName ? `Viewing details for ${selectedTermName}` : "Exam schedule and syllabus progress"}
        rightSlot={<Badge tone={isTermCompleted ? "navy" : "green"} dot>{isTermCompleted ? "Term completed" : "Active term"}</Badge>}
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <KpiCard
          label="Next Exam"
          value={nextExamDate ? nextExamDate.toLocaleDateString("en-IN", { month: "short", day: "numeric" }) : "--"}
          icon={CalendarClock}
          hint={selectedTermName || "No term selected"}
        />
        <KpiCard label="Days Left" value={daysLeft} icon={Hourglass} tone="gold" hint="Until the next exam" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-3 space-y-4">
          <div className="flex flex-col gap-3">
            {uniqueTerms.map((term) => (
              <button
                key={term.name}
                onClick={() => {
                  setSelectedTermName(term.name);
                  setSelectedSubject("all");
                  setShowAllSchedules(false);
                }}
                className={`p-2 pl-4 rounded-2xl text-left transition-all border ${selectedTermName === term.name
                  ? " border-primary/50 bg-elev-2 ring-1 ring-primary/20"
                  : "border-line-subtle bg-elev-1 hover:bg-elev-3"
                  }`}
              >
                <p className="font-bold text-[12px] capitalize">{term.name} Examination</p>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${term.status === 'UPCOMING' ? 'text-primary' : 'text-fg-subtle'
                  }`}>
                  {term.status}
                </span>
              </button>
            ))}
          </div>

          <div className="somu rounded-2xl p-5 border-none">
            <h3 className="font-bold mb-4 flex items-center gap-2 text-fg">
              <Calendar size={16} className="text-primary" /> Schedule
            </h3>
            <div className="space-y-3">
              {(showAllSchedules ? activeSchedules : activeSchedules.slice(0, 2)).map((exam) => (
                <div key={exam.id} className="bg-elev-1 p-4 rounded-2xl flex items-center gap-4 border border-line-subtle">
                  <div className="text-center border-r border-line pr-3">
                    <p className="text-lg font-bold leading-tight">{new Date(exam.examDate).getDate()}</p>
                    <p className="text-[9px] text-fg-subtle uppercase">
                      {new Date(exam.examDate).toLocaleString('default', { month: 'short' })}
                    </p>
                  </div>
                  <div>
                    <p className="font-bold capitalize text-sm">{exam.subject}</p>
                    <p className="text-[10px] text-fg-subtle">{exam.startTime}</p>
                  </div>
                </div>
              ))}
              {activeSchedules.length > 2 && (
                <button
                  onClick={() => setShowAllSchedules(!showAllSchedules)}
                  className="w-full text-center text-primary text-xs font-bold pt-1 hover:underline transition-all"
                >
                  {showAllSchedules ? "Show less" : "View all"}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-9 space-y-6">
          {isTermCompleted ? (
            <div className="somu rounded-2xl p-12 border-none flex flex-col items-center justify-center text-center">
              <div className="bg-elev-1 p-6 rounded-full mb-4">
                <CheckCircle2 size={48} className="text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Examination Completed</h2>
              <p className="text-fg-subtle max-w-xs">All syllabus and exams for {selectedTermName} have been concluded.</p>
            </div>
          ) : (
            <>
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                <button
                  onClick={() => setSelectedSubject("all")}
                  className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${selectedSubject === "all" ? "bg-primary text-on-primary" : "somu border-none"
                    }`}
                >
                  All Subjects
                </button>
                {activeSubjects.map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setSelectedSubject(sub)}
                    className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all capitalize ${selectedSubject === sub ? "bg-primary text-on-primary" : "somu border-none"
                      }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>

              {(selectedSubject === "all" ? activeSubjects : [selectedSubject]).map((subName) => {
                const syllabusItem = activeTermData.flatMap(t => t.syllabus).find(s => s.subject === subName);
                if (!syllabusItem) return null;

                // FIX: Calculate progress based on units if API completedPercent is 0
                const unitCount = syllabusItem.units.length;
                const calculatedProgress = unitCount > 0
                  ? Math.round(syllabusItem.units.reduce((acc, u) => acc + u.completedPercent, 0) / unitCount)
                  : syllabusItem.completedPercent;

                return (
                  <div key={subName} className="somu rounded-2xl p-6 md:p-8 border-none mb-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                      <div className="flex items-center gap-4">
                        <div className="bg-elev-2 p-3 rounded-2xl">
                          <BookOpen className="text-primary" size={24} />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold capitalize">{subName}</h2>
                          {activeTermData[0]?.class?.teacher?.name ? (
                            <div className="flex items-center gap-2 text-fg-subtle text-xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-elev-3"></span>
                              <span>{activeTermData[0].class.teacher.name}</span>
                            </div>
                          ) : null}
                        </div>
                      </div>

                      <div className="w-full md:w-auto">
                        <div className="flex justify-between md:justify-end items-center gap-3 mb-2">
                          <span className="text-[10px] text-fg-subtle uppercase font-bold tracking-widest">Completion</span>
                          <span className="text-lg font-bold">{calculatedProgress}%</span>
                        </div>
                        <div className="w-full md:w-40 h-1.5 bg-elev-2 rounded-full overflow-hidden">
                          <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: `${calculatedProgress}%` }} />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {syllabusItem.units.map((unit) => (
                        <div key={unit.id} className="bg-elev-1 p-4 rounded-2xl flex justify-between items-center border border-line-subtle">
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${unit.completedPercent === 100 ? 'bg-primary' : 'bg-blue-400'}`} />
                            <span className="text-sm font-medium text-fg">{unit.unitName}</span>
                          </div>
                          {unit.completedPercent === 100 ? (
                            <div className="flex items-center gap-1.5 bg-primary/10 px-3 py-1 rounded-lg border border-primary/20">
                              <CheckCircle2 size={12} className="text-primary" />
                              <span className="text-[10px] font-bold text-primary uppercase">Done</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] font-bold text-fg-faint uppercase">{unit.completedPercent}%</span>
                              <div className="w-10 h-1 bg-elev-2 rounded-full overflow-hidden">
                                <div className="bg-blue-400 h-full" style={{ width: `${unit.completedPercent}%` }} />
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
