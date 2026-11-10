import { Award, CheckCircle, Download, Loader2, UserPlus } from "lucide-react";
import PayButton from "../../../../common/PayButton";

type EnrolledStudent = {
  id: string;
  registrationId: string;
  name: string | null;
  email: string | null;
  class: string | null;
  paymentStatus: string;
};

export function EventDetailsSidebar({
  instructorImage,
  teacherName,
  teacherEmail,
  showEnrolledStudents,
  enrolledStudents,
  maxSeats,
  enrolledCount,
  eventAmount,
  showEnrollAction,
  workshopCertificate,
  enrollError,
  isRegistered,
  needsPayment,
  registrationId,
  onEnrollSuccess,
  isFull,
  enrollLoading,
  onEnroll,
}: {
  instructorImage: string;
  teacherName: string | null | undefined;
  teacherEmail: string | null | undefined;
  showEnrolledStudents: boolean;
  enrolledStudents: EnrolledStudent[];
  maxSeats: number | null;
  enrolledCount: number;
  eventAmount: number;
  showEnrollAction: boolean;
  workshopCertificate?: { id: string; title: string; certificateUrl: string | null; issuedDate: string } | null;
  enrollError: string | null;
  isRegistered: boolean;
  needsPayment: boolean;
  registrationId?: string;
  onEnrollSuccess?: () => void;
  isFull: boolean;
  enrollLoading: boolean;
  onEnroll: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-line bg-elev-1 px-4 py-3 sm:px-5 sm:py-4">
        <div className="text-xs uppercase tracking-wide text-fg-subtle">
          Instructor
        </div>
      <div className="mt-3 flex items-center gap-3">
          <img
            src={instructorImage}
            alt={teacherName || "Instructor"}
            className="h-12 w-12 rounded-full border border-line object-cover"
          />
          <div>
            <div className="text-sm font-semibold text-fg">
              {teacherName || "Not assigned"}
            </div>
            <div className="text-xs text-primary">
              {teacherEmail || "Instructor"}
            </div>
          </div>
        </div>
      </div>

      {showEnrolledStudents && enrolledStudents.length > 0 && (
        <div className="rounded-2xl border border-line bg-elev-1 px-4 py-3 sm:px-5 sm:py-4">
          <div className="text-xs uppercase tracking-wide text-fg-subtle mb-3">
            Enrolled Students ({enrolledStudents.length})
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {enrolledStudents.map((s) => {
              const paid = s.paymentStatus === "PAID" || s.paymentStatus === "SUCCESS";
              return (
                <div
                  key={s.registrationId}
                  className="flex justify-between items-center py-2 border-b border-line-subtle last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium text-fg">
                      {s.name || "—"}
                    </p>
                    <p className="text-xs text-fg-muted">
                      {s.class || s.email || "—"}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      paid
                        ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                        : "bg-amber-500/20 text-amber-700 dark:text-amber-400"
                    }`}
                  >
                    {paid ? "Paid" : "Pending"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-line bg-elev-1 px-4 py-3 sm:px-5 sm:py-4">
        <div className="text-xs uppercase tracking-wide text-fg-subtle">
          Event Stats
        </div>
        <div className="mt-3 space-y-3 text-sm text-fg-muted">
          <div className="flex items-center justify-between">
            <span>Total Seats</span>
            <span className="text-fg">
              {maxSeats != null ? maxSeats : "Unlimited"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Enrolled</span>
            <span className="text-primary">{enrolledCount}</span>
          </div>
          {maxSeats != null && maxSeats > 0 && (
            <div className="h-2 rounded-full bg-elev-2 overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{
                  width: `${Math.min(100, (enrolledCount / maxSeats) * 100)}%`,
                }}
              />
            </div>
          )}
          <div className="flex items-center justify-between pt-1">
            <span>Fee</span>
            <span className="text-fg">
              {eventAmount > 0 ? `₹${eventAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}` : "Free"}
            </span>
          </div>
        </div>
      </div>

      {showEnrollAction && workshopCertificate && (
        <div className="rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 sm:px-5 sm:py-4">
          <div className="flex items-center gap-2 text-primary font-semibold mb-2">
            <Award size={18} />
            Your Certificate
          </div>
          <p className="text-sm text-fg-muted mb-3">{workshopCertificate.title}</p>
          {workshopCertificate.certificateUrl ? (
            <a
              href={workshopCertificate.certificateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary hover:bg-primary-hover transition"
            >
              <Download size={16} />
              Download Certificate
            </a>
          ) : (
            <span className="text-sm text-fg-subtle">Certificate is being prepared</span>
          )}
        </div>
      )}

      {showEnrollAction && (
        <div className="rounded-2xl border border-line bg-elev-1 px-4 py-3 sm:px-5 sm:py-4">
          {enrollError && (
            <div className="mb-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-700 dark:text-red-300">
              {enrollError}
            </div>
          )}
          {isRegistered ? (
            needsPayment ? (
              <div className="space-y-3">
                <p className="text-sm text-fg-muted">Complete payment to confirm enrollment</p>
                <PayButton
                  amount={eventAmount}
                  returnPath="/parent?tab=workshops"
                  eventRegistrationId={registrationId}
                  onSuccess={onEnrollSuccess}
                />
              </div>
            ) : (
              <div className="flex items-center gap-2 text-primary">
                <CheckCircle size={18} />
                <span className="text-sm font-medium">You are enrolled</span>
              </div>
            )
          ) : isFull ? (
            <div className="text-sm text-fg-muted">Workshop is full</div>
          ) : (
            <button
              type="button"
              onClick={onEnroll}
              disabled={enrollLoading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-on-primary hover:bg-primary-hover transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {enrollLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Enrolling...
                </>
              ) : (
                <>
                  <UserPlus size={18} />
                  Enroll in Workshop
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
