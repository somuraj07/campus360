"use client";

import { AttendanceCard } from "./components/AttendanceCard";
import { BirthdayCard } from "@/app/_components/components/common/BirthdayCard";
import { SidebarList } from "./components/SidebarList";
import { DayCollectionByHeadCard } from "./components/DayCollectionByHeadCard";
import { SchoolDashboardLoader } from "./components/SchoolDashboardLoader";
import { ROUTES } from "@/app/_components/constants/routes";
import { useSchoolDashboardState } from "./shared";
import { DashboardStatsHeader } from "./shared";
import { DashboardNewsSection } from "./shared";
import { CollectionStatCard } from "./components/CollectionStatCard";
import { Alert, btnClass } from "@/app/_components/components/common/ui";

export default function Dashboard() {
  const {
    data,
    error,
    router,
    userName,
    selectedCollectionFrom,
    selectedCollectionTo,
    collectionLoading,
    headsLoading,
    handleCollectionDateRangeChange,
    collectionCash,
    collectionOnline,
    isInitialLoading,
    retry,
  } = useSchoolDashboardState();

  return (
    <div className="mx-auto w-full max-w-[1400px] space-y-5 pb-10 sm:space-y-6">
      <DashboardStatsHeader userName={userName} data={data} isInitialLoading={isInitialLoading} />

      {error && (
        <Alert tone="error">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span>
              <span className="font-semibold">Error loading dashboard.</span> {error}
            </span>
            <button type="button" onClick={retry} className={btnClass("dangerSoft", "sm")}>
              Retry
            </button>
          </div>
        </Alert>
      )}

      {isInitialLoading ? (
        <SchoolDashboardLoader />
      ) : data ? (
        <>
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <AttendanceCard
                present={data.attendance.present}
                absent={data.attendance.absent}
                late={data.attendance.late}
                total={data.attendance.total}
                overallRate={data.attendance.overallRate}
                presentPct={data.attendance.presentPct}
                absentPct={data.attendance.absentPct}
                latePct={data.attendance.latePct}
              />
            </div>
            <CollectionStatCard
              selectedDate={selectedCollectionTo}
              onDateChange={(dateYmd) => handleCollectionDateRangeChange({ from: dateYmd, to: dateYmd })}
              totalFormatted={data.stats.todayCollectionTotal ?? "₹0"}
              cash={collectionCash}
              online={collectionOnline}
              loading={collectionLoading}
            />
          </div>

          <DayCollectionByHeadCard
            fromDate={selectedCollectionFrom}
            toDate={selectedCollectionTo}
            onDateRangeChange={handleCollectionDateRangeChange}
            rows={data.todayCollectionByHead?.rows ?? []}
            formattedTotal={data.todayCollectionByHead?.formattedTotal ?? "0"}
            loading={headsLoading}
          />

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
            <SidebarList
              title="Teachers on Leave"
              subtitle="Current leave requests"
              items={data.teachersOnLeave.map((t) => ({
                title: t.name,
                subtitle: `${t.subject} • ${t.leaveType.replace("_", " ")}`,
                meta: `${t.days} day${t.days > 1 ? "s" : ""}`,
                status: t.status === "APPROVED" ? "Approved" : "Pending",
                type: "teacher" as const,
              }))}
              onViewAllClick={() => router.push(ROUTES.SCHOOLADMIN_TEACHER_LEAVE_TAB)}
            />
            <SidebarList
              title="Recent Activities"
              subtitle="Latest updates and actions"
              showViewAll={false}
              items={data.recentActivities.map((a) => ({
                title: a.title,
                subtitle: a.subtitle,
                meta: a.meta,
                type: "activity" as const,
                activityType: (a.type?.includes("Leave")
                  ? "leave"
                  : a.type?.includes("Fee")
                    ? "fee"
                    : a.type?.includes("News")
                      ? "news"
                      : "certificate") as "leave" | "fee" | "news" | "certificate",
              }))}
            />
            <div className="lg:col-span-2 xl:col-span-1">
              <BirthdayCard />
            </div>
          </div>
        </>
      ) : null}

      <DashboardNewsSection
        latestNews={data?.latestNews}
        onViewAll={() => router.push(ROUTES.SCHOOLADMIN_NEWSFEED_TAB)}
      />
    </div>
  );
}
