"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, Users } from "lucide-react";
import { useSession } from "next-auth/react";
import PayButton from "@/app/_components/components/common/PayButton";

interface StudentFee {
  id: string;
  totalFee: number;
  discountPercent: number;
  finalFee: number;
  amountPaid: number;
  remainingFee: number;
}

interface FeeWithStudent extends StudentFee {
  student: {
    id: string;
    user: { id: string; name: string | null; email: string | null };
    class: { id: string; name: string; section: string | null } | null;
  };
}

interface FeeStats {
  totalStudents: number;
  paid: number;
  pending: number;
  totalFee?: number;
  totalDiscount?: number;
  totalCollected: number;
  totalDue: number;
}

export default function Page() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const verifiedRef = useRef(false);
  const [fee, setFee] = useState<StudentFee | null>(null);
  const [loading, setLoading] = useState(true);
  const [adminFees, setAdminFees] = useState<FeeWithStudent[]>([]);
  const [stats, setStats] = useState<FeeStats | null>(null);
  const [selectedFee, setSelectedFee] = useState<FeeWithStudent | null>(null);
  const [totalFeeInput, setTotalFeeInput] = useState<number | "">("");
  const [feesInput, setFeesInput] = useState<number | "">("");
  const [saving, setSaving] = useState(false);

  const fetchFee = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/fees/mine");
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Failed to fetch fee details");
        return;
      }
      setFee(data.fee);
    } catch (err) {
      console.error("Fetch fee error:", err);
      alert("Something went wrong while fetching fee details");
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminSummary = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/fees/summary");
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Failed to fetch fees");
        return;
      }
      setAdminFees(data.fees || []);
      setStats(data.stats || null);
      if (data.fees?.length) {
        const first = data.fees[0];
        setSelectedFee(first);
        setTotalFeeInput(first.totalFee);
        setFeesInput(first.finalFee);
      } else {
        setSelectedFee(null);
      }
    } catch (err) {
      console.error("Fetch admin fees error:", err);
      alert("Something went wrong while fetching fee details");
    } finally {
      setLoading(false);
    }
  };

  // Handle HyperPG return: verify from URL params (if PG adds them) or from cookie (return_url has no query params)
  useEffect(() => {
    if (status !== "authenticated" || !session?.user || verifiedRef.current) return;
    const success = searchParams.get("success");
    const amount = searchParams.get("amount");
    const orderId = searchParams.get("order_id");
    let orderIdToVerify = orderId;
    let amountToVerify = amount ? parseFloat(amount) : NaN;
    if ((success !== "1" || !orderIdToVerify || !amount) && typeof document !== "undefined") {
      const match = document.cookie.match(/hyperpg_pending=([^;]+)/);
      if (match) {
        try {
          const [oid, amt] = decodeURIComponent(match[1]).split("|");
          if (oid && amt) {
            orderIdToVerify = oid;
            amountToVerify = parseFloat(amt);
            document.cookie = "hyperpg_pending=; path=/; max-age=0";
          }
        } catch {}
      }
    }
    if (orderIdToVerify && !isNaN(amountToVerify) && amountToVerify > 0) {
      verifiedRef.current = true;
      fetch("/api/payment/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gateway: "HYPERPG",
          order_id: orderIdToVerify,
          amount: amountToVerify,
        }),
      })
        .then(async (res) => {
          const data = await res.json();
          if (data.fee) setFee(data.fee);
          if (session?.user?.role === "STUDENT") fetchFee();
          if (!res.ok && data.message) alert(data.message);
          window.history.replaceState({}, "", "/payments");
        })
        .catch((e) => {
          console.error(e);
          alert("Verification failed. Your payment may still have gone through; check fee status.");
        });
    }
  }, [status, session?.user, searchParams]);

  useEffect(() => {
    if (status !== "authenticated") return;
    const role = session?.user?.role;
    if (role === "STUDENT") {
      fetchFee();
    } else if (role === "SCHOOLADMIN" || role === "SUPERADMIN") {
      fetchAdminSummary();
    } else {
      setLoading(false);
    }
  }, [status, session?.user?.role]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#808080] mx-auto mb-4"></div>
          <p className="text-fg font-medium">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="relative overflow-hidden bg-gradient-to-br from-elev-2 via-elev-2 to-elev-2 rounded-2xl shadow-card p-8 border border-line">
          <p className="text-red-700 dark:text-red-400 font-semibold">
            Please sign in to view payments.
          </p>
        </div>
      </div>
    );
  }

  const role = session.user.role;

  if (role === "STUDENT" && !fee) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="relative overflow-hidden bg-gradient-to-br from-elev-2 via-elev-2 to-elev-2 rounded-2xl shadow-card p-8 border border-line">
          <p className="text-red-700 dark:text-red-400 font-semibold">
            Fee details not configured for your profile. Please contact admin.
          </p>
        </div>
      </div>
    );
  }

  if (role !== "STUDENT" && role !== "SCHOOLADMIN" && role !== "SUPERADMIN") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="relative overflow-hidden bg-gradient-to-br from-elev-2 via-elev-2 to-elev-2 rounded-2xl shadow-card p-8 border border-line">
          <p className="text-red-700 dark:text-red-400 font-semibold">
            Payments are available for students and school admins.
          </p>
        </div>
      </div>
    );
  }

  if (role === "STUDENT" && fee) {
    const remainingAmount = fee.remainingFee;
    const payable = remainingAmount;
    const progress =
      fee.finalFee > 0 ? Math.min((fee.amountPaid / fee.finalFee) * 100, 100) : 0;

    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden w-full max-w-md bg-gradient-to-br from-elev-2 via-elev-2 to-elev-2 rounded-2xl shadow-card p-8 border border-line space-y-6"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#404040]/10 via-transparent to-[#404040]/10"></div>
          <div className="relative">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-elev-2 to-[#404040] rounded-xl flex items-center justify-center border border-line shadow-card mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-fg" />
              </div>
              <h2 className="text-2xl font-bold text-fg">
                Complete Your Payment
              </h2>
              <p className="text-fg-subtle">
                Total Fee: <span className="font-semibold text-fg">₹{fee.totalFee}</span>
              </p>
              <p className="text-fg-subtle text-sm">
                Fees:{" "}
                <span className="font-semibold text-fg">₹{fee.finalFee}</span>
              </p>
              <p className="text-fg-subtle text-sm">
                Paid: <span className="font-semibold text-fg">₹{fee.amountPaid}</span> &nbsp; | &nbsp;
                Remaining: <span className="font-semibold text-fg">₹{fee.remainingFee}</span>
              </p>
            </div>

            {/* Payment Summary */}
            <div className="bg-elev-2 border border-line rounded-xl p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-fg-subtle">Pay now (full remaining)</span>
                <span className="font-bold text-green-700 dark:text-green-400">
                  ₹{payable.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            {fee.finalFee > 0 && (
              <div>
                <div className="flex justify-between text-xs mb-1 text-fg-subtle">
                  <span>Payment Progress</span>
                  <span>
                    ₹{fee.amountPaid.toFixed(2)} / ₹{fee.finalFee.toFixed(2)}
                  </span>
                </div>
                <div className="w-full bg-elev-2 rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-2 bg-gradient-to-r from-green-500 to-green-600 rounded-full"
                  />
                </div>
              </div>
            )}

            {/* Pay Button */}
            {remainingAmount <= 0 ? (
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="flex items-center justify-center gap-2 text-green-700 dark:text-green-400 bg-green-500/20 border border-green-500/30 rounded-xl p-4"
              >
                <CheckCircle />
                <span className="font-semibold">All fees paid. Thank you!</span>
              </motion.div>
            ) : (
              <PayButton amount={payable} onSuccess={fetchFee} />
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  // Admin view
  return (
    <div className="min-h-screen bg-black p-4 md:p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="md:col-span-1 relative overflow-hidden bg-gradient-to-br from-elev-2 via-elev-2 to-elev-2 rounded-2xl shadow-card p-6 border border-line space-y-4"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#404040]/10 via-transparent to-[#404040]/10"></div>
          <div className="relative">
            {stats && (
              <div className="grid grid-cols-2 gap-3 mb-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="p-4 bg-green-500/20 rounded-lg border border-green-500/30"
                >
                  <p className="text-fg-subtle text-xs mb-1">Paid</p>
                  <p className="text-xl font-bold text-green-700 dark:text-green-400">{stats.paid}</p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="p-4 bg-yellow-500/20 rounded-lg border border-yellow-500/30"
                >
                  <p className="text-fg-subtle text-xs mb-1">Pending</p>
                  <p className="text-xl font-bold text-yellow-700 dark:text-yellow-400">{stats.pending}</p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="p-4 bg-emerald-500/20 rounded-lg border border-emerald-500/30 col-span-2"
                >
                  <p className="text-fg-subtle text-xs mb-1">Collected</p>
                  <p className="text-xl font-bold text-emerald-700 dark:text-emerald-400">₹{stats.totalCollected}</p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="p-4 bg-red-500/20 rounded-lg border border-red-500/30 col-span-2"
                >
                  <p className="text-fg-subtle text-xs mb-1">Due</p>
                  <p className="text-xl font-bold text-red-700 dark:text-red-400">₹{stats.totalDue}</p>
                </motion.div>
              </div>
            )}
            <h2 className="text-lg font-bold text-fg mb-3 flex items-center gap-2">
              <Users className="w-5 h-5 text-fg-subtle" />
              Students
            </h2>
            <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
              {adminFees.map((feeItem, index) => (
                <motion.button
                  key={feeItem.student.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02, x: 4 }}
                  onClick={() => {
                    setSelectedFee(feeItem);
                    setTotalFeeInput(feeItem.totalFee);
                    setFeesInput(feeItem.finalFee);
                  }}
                  className={`w-full text-left p-3 rounded-xl border transition-all duration-300 ${
                    selectedFee?.student.id === feeItem.student.id
                      ? "bg-gradient-to-r from-green-500/20 to-green-600/20 border-green-500/50 text-white shadow-card"
                      : "bg-elev-2 border-line text-fg-subtle hover:border-[#808080] hover:text-fg hover:bg-elev-3"
                  }`}
                >
                  <div className="font-semibold text-fg">
                    {feeItem.student.user.name || "Unnamed"}
                  </div>
                  <div className="text-xs text-fg-subtle">
                    {feeItem.student.user.email || "No email"}
                  </div>
                  {feeItem.student.class && (
                    <div className="text-xs text-fg-subtle mt-1">
                      {feeItem.student.class.name}
                      {feeItem.student.class.section ? ` - ${feeItem.student.class.section}` : ""}
                    </div>
                  )}
                </motion.button>
              ))}
              {adminFees.length === 0 && (
                <p className="text-sm text-fg-subtle">No students found.</p>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="md:col-span-2 relative overflow-hidden bg-gradient-to-br from-elev-2 via-elev-2 to-elev-2 rounded-2xl shadow-card p-6 border border-line"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#404040]/10 via-transparent to-[#404040]/10"></div>
          <div className="relative">
            {selectedFee ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm text-fg-subtle mb-1">Selected Student</p>
                    <h3 className="text-2xl font-bold text-fg flex items-center gap-2">
                      <Users className="w-6 h-6 text-fg-subtle" />
                      {selectedFee.student.user.name || "Student"}
                    </h3>
                    <p className="text-sm text-fg-subtle mt-1">{selectedFee.student.user.email}</p>
                  </div>
                </div>

                {selectedFee ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="p-5 rounded-xl bg-green-500/20 border border-green-500/30"
                      >
                        <p className="text-sm text-fg-subtle mb-2">Total Fee</p>
                        <p className="text-3xl font-bold text-green-700 dark:text-green-400">₹{selectedFee.totalFee}</p>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="p-5 rounded-xl bg-blue-500/20 border border-blue-500/30"
                      >
                        <p className="text-sm text-fg-subtle mb-2">Fees</p>
                        <p className="text-3xl font-bold text-blue-700 dark:text-blue-400">
                          Rs. {selectedFee.finalFee}
                        </p>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="p-5 rounded-xl bg-yellow-500/20 border border-yellow-500/30"
                      >
                        <p className="text-sm text-fg-subtle mb-2">Remaining</p>
                        <p className="text-3xl font-bold text-yellow-700 dark:text-yellow-400">
                          Rs. {selectedFee.remainingFee}
                        </p>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="p-5 rounded-xl bg-emerald-500/20 border border-emerald-500/30"
                      >
                        <p className="text-sm text-fg-subtle mb-2">Paid</p>
                        <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-400">
                          ₹{selectedFee.amountPaid}
                        </p>
                      </motion.div>
                    </div>
                    <div className="p-5 rounded-xl bg-elev-2 border border-line">
                      <div className="flex justify-between text-sm text-fg-subtle mb-3">
                        <span>Remaining</span>
                        <span className="font-semibold text-green-700 dark:text-green-400">₹{selectedFee.remainingFee}</span>
                      </div>
                      <div className="h-3 bg-elev-2 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${Math.min(
                              (selectedFee.amountPaid / selectedFee.finalFee) * 100,
                              100
                            ).toFixed(1)}%`,
                          }}
                          className="h-3 bg-gradient-to-r from-green-500 to-green-600 rounded-full"
                        />
                      </div>
                    </div>
                    <div className="p-5 rounded-xl bg-elev-2 border border-line space-y-4">
                      <h4 className="font-semibold text-fg text-sm flex items-center gap-2">
                        💰 Update Fees
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                          <label className="text-fg-subtle block">Total Fee</label>
                          <input
                            type="number"
                            value={totalFeeInput}
                            onChange={(e) => setTotalFeeInput(e.target.value === "" ? "" : Number(e.target.value))}
                            className="w-full bg-surface border border-line text-fg rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#808080] focus:border-transparent hover:border-[#808080] transition placeholder-[#6b6b6b]"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-fg-subtle block">Fees</label>
                          <input
                            type="number"
                            min="0"
                            value={feesInput}
                            onChange={(e) =>
                              setFeesInput(e.target.value === "" ? "" : Number(e.target.value))
                            }
                            className="w-full bg-surface border border-line text-fg rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#808080] focus:border-transparent hover:border-[#808080] transition placeholder-[#6b6b6b]"
                          />
                        </div>
                      </div>
                      <motion.button
                        disabled={saving}
                        whileHover={{ scale: saving ? 1 : 1.02 }}
                        whileTap={{ scale: saving ? 1 : 0.98 }}
                        onClick={async () => {
                          if (!selectedFee) return;
                          const nextTotalFee =
                            totalFeeInput === "" ? selectedFee.totalFee : Number(totalFeeInput);
                          const nextFees =
                            feesInput === "" ? selectedFee.finalFee : Number(feesInput);

                          if (nextTotalFee <= 0) {
                            alert("Total Fee must be a positive number.");
                            return;
                          }

                          if (nextFees < 0 || nextFees > nextTotalFee) {
                            alert("Fees must be between 0 and the Total Fee.");
                            return;
                          }

                          const derivedDiscountPercent =
                            nextTotalFee > 0
                              ? Number((((nextTotalFee - nextFees) / nextTotalFee) * 100).toFixed(2))
                              : 0;

                          setSaving(true);
                          try {
                            const res = await fetch(`/api/fees/student/${selectedFee.student.id}`, {
                              method: "PATCH",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                totalFee: nextTotalFee,
                                discountPercent: derivedDiscountPercent,
                              }),
                            });
                            const data = await res.json();
                            if (!res.ok) {
                              alert(data.message || "Failed to update fee");
                              return;
                            }
                            const updatedFee = data.fee as StudentFee;
                            const merged: FeeWithStudent = { ...updatedFee, student: selectedFee.student };
                            setSelectedFee(merged);
                            setAdminFees((prev) =>
                              prev.map((f) =>
                                f.student.id === selectedFee.student.id ? merged : f
                              )
                            );
                            fetchAdminSummary();
                          } finally {
                            setSaving(false);
                          }
                        }}
                        className="w-full bg-gradient-to-r from-[#404040] to-[#6b6b6b] hover:from-[#6b6b6b] hover:to-[#404040] text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 border border-line hover:border-[#808080] shadow-card disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {saving ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary inline-block mr-2"></div>
                            Saving...
                          </>
                        ) : (
                          "Save changes"
                        )}
                      </motion.button>
                    </div>
                  </div>
                ) : (
                  <p className="text-fg-subtle">No fee record for this student.</p>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <Users size={48} className="mx-auto text-fg-subtle mb-4" />
                <p className="text-fg-subtle">Select a student to view payment details.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
    
  );
}

