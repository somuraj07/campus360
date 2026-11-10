import { IndianRupee, Users, Star, Award } from "lucide-react";
import type { AnalysisResponse } from "./types";

export function buildAnalysisStatsAndCharts(data: AnalysisResponse) {
  const statsSource = data.stats ?? {
    feesCollected: 0,
    totalEnrollment: 0,
    avgTeacherRating: 0,
    avgExamScore: 0,
  };

  const stats = [
    {
      title: "Fees Collected",
      value: statsSource.feesCollected >= 100000
        ? `₹${(statsSource.feesCollected / 100000).toFixed(1)}L`
        : `₹${statsSource.feesCollected.toLocaleString()}`,
      change: "vs last month",
      icon: IndianRupee,
      iconColor: "text-primary",
      iconBorder: "border-primary/30",
      iconBg: "bg-primary/10",
      changeColor: "text-primary",
    },
    {
      title: "Total Enrollment",
      value: statsSource.totalEnrollment.toLocaleString(),
      change: "New admissions",
      icon: Users,
      iconColor: "text-sky-700 dark:text-sky-400",
      iconBorder: "border-sky-400/30",
      iconBg: "bg-sky-400/10",
      changeColor: "text-sky-700 dark:text-sky-400",
    },
    {
      title: "Avg Teacher Rating",
      value:
        statsSource.avgTeacherRating > 0
          ? `${statsSource.avgTeacherRating} / 5`
          : "—",
      change: "Based on student feedback",
      icon: Star,
      iconColor: "text-purple-700 dark:text-purple-300",
      iconBorder: "border-purple-300/30",
      iconBg: "bg-purple-300/10",
      changeColor: "text-purple-700 dark:text-purple-300",
    },
    {
      title: "Avg Exam Score",
      value: `${statsSource.avgExamScore}%`,
      change: "vs last year",
      icon: Award,
      iconColor: "text-yellow-700 dark:text-yellow-400",
      iconBorder: "border-yellow-400/30",
      iconBg: "bg-yellow-400/10",
      changeColor: "text-yellow-700 dark:text-yellow-400",
    },
  ];
  const axisStyle = {
    stroke: "var(--fg-subtle)",
    fontSize: 11,
  };

  const feesData = (data.charts?.monthlyFeesCollection ?? []).map((f) => ({
    month: f.month,
    value: f.amount,
  }));

  const enrollmentData = (data.charts?.enrollmentGrowth ?? []).map((e) => ({
    year: e.year.toString(),
    students: e.count,
  }));

  const attendance = data.charts?.attendance ?? { students: 0, teachers: 0 };
  const attendanceData = [
    {
      day: "Avg",
      students: attendance.students,
      teachers: attendance.teachers,
    },
  ];

  const subjectData = (data.charts?.subjectPerformance ?? []).map((s) => ({
    subject: s.subject,
    score: s.percentage,
  }));

  // All teachers sorted best to least (API returns already sorted)
  const topTeachers = data.topTeachers ?? [];

  return { stats, axisStyle, feesData, enrollmentData, attendanceData, subjectData, topTeachers };
}
