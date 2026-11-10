import { CalendarRange, GraduationCap } from "lucide-react";
import AnalysisSectionNav from "../../AnalysisSectionNav";
import { SaPageHeader, SelectInput } from "../../../common/ui";

export function AnalysisFilterHeader({
  classId,
  onClassIdChange,
  classes,
  year,
  onYearChange,
  availableYears,
}: {
  classId: string;
  onClassIdChange: (v: string) => void;
  classes: { id: string; name: string; section: string | null }[];
  year: number;
  onYearChange: (v: number) => void;
  availableYears: number[];
}) {
  return (
    <div className="mb-5 space-y-5 sm:mb-6">
      <SaPageHeader
        eyebrow="Insights"
        title="Analysis & Reports"
        description="Comprehensive insights into school performance"
        actions={
          <>
            <SelectInput
              icon={GraduationCap}
              aria-label="Class"
              value={classId}
              onChange={(e) => onClassIdChange(e.target.value)}
              className="h-10 min-w-[160px]"
            >
              <option value="">All Classes</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                  {c.section ? ` ${c.section}` : ""}
                </option>
              ))}
            </SelectInput>
            <SelectInput
              icon={CalendarRange}
              aria-label="Academic year"
              value={year !== 0 ? year : availableYears.length > 0 ? availableYears[0] : ""}
              onChange={(e) => onYearChange(Number(e.target.value))}
              className="h-10 min-w-[150px]"
            >
              {availableYears.map((y) => (
                <option key={y} value={y}>
                  {y}-{y + 1}
                </option>
              ))}
            </SelectInput>
          </>
        }
      />
      <AnalysisSectionNav embedded />
    </div>
  );
}
