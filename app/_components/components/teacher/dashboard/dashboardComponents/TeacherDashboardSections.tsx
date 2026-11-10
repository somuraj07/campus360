"use client";

import {
  ArrowRight,
  Bell,
  BookOpen,
  Calendar,
  MessageCircle,
  Users,
} from "lucide-react";
import { KpiCard, KpiGrid } from "../../../common/ui";
import { formatNumber } from "../../../../utils/format";
import { TeacherDashboardData } from "./types";
import CircularNoticeCard from "../../../common/CircularNoticeCard";
import TeacherDashboardSideColumn from "./TeacherDashboardSideColumn";

const STATUS_COLORS = ["bg-red-500", "bg-yellow-400", "bg-blue-500"];

function formatEventDate(value?: string | null) {
  if (!value) return "TBD";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "TBD";
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatEventTime(value?: string | null) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

interface DashboardContentProps {
  data: TeacherDashboardData;
  onManageClasses: () => void;
  onOpenChat: () => void;
}

export function TeacherDashboardContent({
  data,
  onManageClasses,
  onOpenChat,
}: DashboardContentProps) {
  const stats = data.stats;
  return (
    <>
      <KpiGrid>
        <KpiCard
          label="Total Classes"
          value={stats.totalClasses}
          icon={Users}
          hint={`${formatNumber(stats.totalStudents)} total students`}
        />
        <KpiCard label="Total Students" value={formatNumber(stats.totalStudents)} icon={BookOpen} tone="sky" hint="Across all classes" />
        <KpiCard label="Pending Chats" value={stats.pendingChats} icon={MessageCircle} tone="gold" hint="Parent messages" />
        <KpiCard label="Unread Alerts" value={stats.unreadAlerts} icon={Bell} tone="red" hint="Important updates" />
      </KpiGrid>

      <section className="space-y-4">
        <div className="flex items-start gap-3">
          <span className="w-1.5 h-6 bg-primary rounded-full" />
          <div>
            <h3 className="text-xl font-bold text-fg flex items-center gap-2">Circulars & Notices</h3>
            <p className="text-sm text-fg-muted mt-1">Create and manage school-wide circulars</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          {data.circulars.map((c, index) => (
            <CircularNoticeCard
              key={c.id}
              referenceNumber={c.referenceNumber}
              subject={c.subject}
              content={c.content}
              publishStatus={c.publishStatus}
              date={c.date}
              issuedBy={c.issuedBy}
              issuedByPhoto={c.issuedByPhoto}
              attachments={c.attachments}
              accentClassName={STATUS_COLORS[index % STATUS_COLORS.length]}
            />
          ))}

          {data.circulars.length === 0 && (
            <div className="rounded-2xl border border-line bg-elev-1 p-6 text-fg-muted">
              No circulars available.
            </div>
          )}
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-4">
          <div className="min-h-[500px] background-blur-2xl border border-line bg-transparent rounded-2xl overflow-hidden border border-line-subtle flex flex-col justify-center 
          items-center p-8 sm:p-10 text-center group hover:border-primary/30 transition-all">
            <div className="p-6 rounded-full bg-elev-1 group-hover:bg-primary/10 transition-colors mb-4">
              <Users size={22} className="lucide lucide-users w-10 h-10 text-fg-muted group-hover:text-primary transition-colors" />
            </div>
            <h3 className="font-bold text-fg text-2xl mb-2">Classes Handling</h3>
            <p className="text-fg-muted text-sm max-w-md mx-auto mb-6">
              You are currently handling{" "}
              <span className="text-primary font-bold">{stats.totalClasses} classes</span>. Manage your
              schedule, students, and subjects from the detailed view.
            </p>
            <button
              type="button"
              onClick={onManageClasses}
              className="px-8 py-3 bg-primary text-on-primary font-bold rounded-xl hover:bg-primary-hover 
              transition-all flex items-center gap-2"
            >
              Manage Classes
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="min-h-[500px] rounded-2xl border border-line bg-elev-1 p-6 rounded-2xl overflow-hidden border border-line-subtle flex flex-col overflow-y-auto no-scrollbar scrollbar-thumb-white/10">
            <h3 className="text-xl font-semibold text-fg">Upcoming Events</h3>
            <p className="text-sm text-fg-muted mt-1">Meetings, workshops & deadlines</p>

            <div className="mt-4 space-y-3 divide-y divide-line-subtle">
              {data.events.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between rounded-xl px-4 py-3 hover:bg-elev-2 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-elev-1 rounded-xl text-fg-muted group-hover:bg-primary/10
                     group-hover:text-primary transition-all border border-line-subtle">
                      <Calendar size={18} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-fg text-sm group-hover:text-fg">{event.title}</h3>
                      <p className="text-xs text-fg-muted">
                        {formatEventDate(event.eventDate)}
                        {formatEventTime(event.eventDate) ? (
                          <span className="mx-2 text-fg-subtle">•</span>
                        ) : null}
                        {formatEventTime(event.eventDate)}
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-elev-1 text-fg-muted text-[10px] font-bold uppercase tracking-wider rounded-lg border border-line
                   group-hover:border-primary/20 group-hover:text-primary transition-colors">
                    {event.type}
                  </span>
                </div>
              ))}
              {data.events.length === 0 && (
                <div className="text-sm text-fg-muted">No upcoming events.</div>
              )}
            </div>
          </div>
        </div>

        <TeacherDashboardSideColumn
          notifications={data.notifications ?? []}
          recentChats={data.recentChats ?? []}
          onOpenChat={onOpenChat}
        />
      </section>
    </>
  );
}
