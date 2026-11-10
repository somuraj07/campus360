import { ChevronDown, ChevronUp } from "lucide-react";
import { GradeIndicator } from "./GradeIndicator";
import type { ReportCardData } from "./reportCardTypes";

export function ReportCardMarksTable({
  reportData,
  selectedExamType,
  expandedSubject,
  onExpandedSubjectChange,
}: {
  reportData: ReportCardData;
  selectedExamType: string;
  expandedSubject: string | null;
  onExpandedSubjectChange: (id: string | null) => void;
}) {
  return (
    <div className="rounded-2xl border border-line bg-elev-1 overflow-hidden">
      <div className="p-4 border-b border-line bg-elev-1 flex items-center justify-between">
        <h3 className="font-bold text-fg text-sm">
          Subject-wise Performance
        </h3>
        <span className="text-xs text-primary font-medium">
          {selectedExamType === "ALL" ? "All Exams" : selectedExamType}
        </span>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-fg-subtle uppercase tracking-wider border-b border-line-subtle">
              <th className="text-left px-5 py-3">Subject</th>
              <th className="text-center px-3 py-3">Obtained</th>
              <th className="text-center px-3 py-3">Total</th>
              <th className="text-center px-3 py-3">Percentage</th>
              <th className="text-center px-3 py-3">Grade</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line-subtle">
            {reportData.marks.map((m, idx) => (
              <tr
                key={`${m.subject}-${m.examType}-${idx}`}
                className="hover:bg-elev-2 transition"
              >
                <td className="px-5 py-3">
                  <div className="font-medium text-fg">
                    {m.subject}
                  </div>
                  {m.examType && (
                    <div className="text-[11px] text-fg-faint">
                      {m.examType}
                    </div>
                  )}
                </td>
                <td className="text-center px-3 py-3 font-semibold text-fg">
                  {m.marks}
                </td>
                <td className="text-center px-3 py-3 text-fg-muted">
                  {m.totalMarks}
                </td>
                <td className="text-center px-3 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-16 h-1.5 rounded-full bg-elev-2 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{
                          width: `${Math.min(100, m.percentage)}%`,
                        }}
                      />
                    </div>
                    <span className="text-fg font-medium text-xs w-12">
                      {m.percentage}%
                    </span>
                  </div>
                </td>
                <td className="text-center px-3 py-3">
                  <GradeIndicator grade={m.grade} />
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-line bg-elev-1">
              <td className="px-5 py-3 font-bold text-fg uppercase text-xs">
                Total
              </td>
              <td className="text-center px-3 py-3 font-bold text-fg">
                {reportData.summary.totalObtained}
              </td>
              <td className="text-center px-3 py-3 font-bold text-fg-muted">
                {reportData.summary.totalMax}
              </td>
              <td className="text-center px-3 py-3 font-bold text-primary">
                {reportData.summary.overallPercentage}%
              </td>
              <td className="text-center px-3 py-3">
                <GradeIndicator
                  grade={reportData.summary.overallGrade}
                />
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden p-4 space-y-3">
        {reportData.marks.map((m, idx) => (
          <button
            key={`${m.subject}-${m.examType}-${idx}`}
            onClick={() =>
              onExpandedSubjectChange(
                expandedSubject === `${m.subject}-${idx}`
                  ? null
                  : `${m.subject}-${idx}`
              )
            }
            className="w-full text-left rounded-xl border border-line bg-elev-1 p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-fg text-sm">
                  {m.subject}
                </p>
                {m.examType && (
                  <p className="text-[11px] text-fg-faint">
                    {m.examType}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <GradeIndicator grade={m.grade} />
                {expandedSubject === `${m.subject}-${idx}` ? (
                  <ChevronUp size={14} className="text-fg-faint" />
                ) : (
                  <ChevronDown size={14} className="text-fg-faint" />
                )}
              </div>
            </div>
            {expandedSubject === `${m.subject}-${idx}` && (
              <div className="mt-3 pt-3 border-t border-line-subtle grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-[10px] text-fg-subtle uppercase">
                    Obtained
                  </p>
                  <p className="font-bold text-fg">{m.marks}</p>
                </div>
                <div>
                  <p className="text-[10px] text-fg-subtle uppercase">
                    Total
                  </p>
                  <p className="font-bold text-fg-muted">
                    {m.totalMarks}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-fg-subtle uppercase">
                    Percentage
                  </p>
                  <p className="font-bold text-primary">
                    {m.percentage}%
                  </p>
                </div>
              </div>
            )}
          </button>
        ))}

        {/* Mobile Total */}
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
          <div className="flex items-center justify-between">
            <span className="font-bold text-fg text-sm uppercase">
              Total
            </span>
            <GradeIndicator
              grade={reportData.summary.overallGrade}
            />
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-[10px] text-fg-subtle uppercase">
                Obtained
              </p>
              <p className="font-bold text-fg">
                {reportData.summary.totalObtained}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-fg-subtle uppercase">
                Total
              </p>
              <p className="font-bold text-fg-muted">
                {reportData.summary.totalMax}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-fg-subtle uppercase">
                Percentage
              </p>
              <p className="font-bold text-primary">
                {reportData.summary.overallPercentage}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
