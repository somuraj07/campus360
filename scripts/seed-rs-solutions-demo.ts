/**
 * One demo school for RS Solutions: staff logins, parents, and sample rows
 * for classes, attendance, fees, marks, exams, homework, and the other portals.
 *
 * Refuses to run if this school name already exists. Does not touch other schools.
 *
 *   node --env-file=.env ./node_modules/.bin/tsx scripts/seed-rs-solutions-demo.ts
 */
import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient, type Prisma } from "@prisma/client";
import { FEATURE_IDS } from "../lib/features";
import { PRIVACY_POLICY_VERSION } from "../lib/consent";

const SCHOOL_NAME = "RS Solutions Public School";
const PASSWORDS = {
  admin: "Admin@rs2026",
  chairman: "Chairman@rs2026",
  teacher: "Teacher@rs2026",
  parent: "Parent@rs2026",
};

const TEACHER_FEATURES = [
  ...FEATURE_IDS,
  "DASHBOARD",
  "HOMEWORK",
  "TIMETABLE",
  "ATTENDANCE",
  "MARKS",
  "CHAT",
  "FEES",
  "CERTIFICATES",
  "ADMISSION",
  "CLASSES",
  "STUDENTS",
  "TEACHERS",
  "TEACHER_LEAVES",
  "WORKSHOPS",
  "NEWSFEED",
  "PAYMENTS",
  "STUDENT_DETAILS",
  "EXAMS",
  "CIRCULARS",
  "SETTINGS",
  "PROFILE",
  "LEAVES",
  "TEACHER_AUDIT",
  "STUDENT_LEAVE",
  "dashboard",
  "admission",
  "classes",
  "students",
  "student-details",
  "teachers",
  "teacher-leaves",
  "teacher-audit",
  "certificates",
  "fees",
  "homework",
  "timetable",
  "marks",
  "attendance",
  "exams",
  "workshops",
  "newsfeed",
  "chat",
  "leaves",
  "profile",
  "settings",
];

const url = process.env.DIRECT_URL || process.env.DATABASE_URL;
if (!url) throw new Error("DIRECT_URL or DATABASE_URL is required");

const prisma = new PrismaClient({ datasourceUrl: url });

function day(iso: string): Date {
  return new Date(`${iso}T00:00:00.000Z`);
}

function gradeFor(marks: number, total: number): string {
  const pct = (marks / total) * 100;
  if (pct >= 90) return "A+";
  if (pct >= 80) return "A";
  if (pct >= 70) return "B+";
  if (pct >= 60) return "B";
  if (pct >= 50) return "C";
  if (pct >= 40) return "D";
  return "F";
}

type ExtraRow = {
  id: string;
  name: string;
  amount: number;
  targetType: string;
  targetClassId: string | null;
  targetSection: string | null;
  targetStudentId: string | null;
  residencyScope: string;
};

function extraApplies(
  ef: ExtraRow,
  opts: { classId: string; section: string; studentId: string; hosteller: boolean }
): boolean {
  const applies =
    ef.targetType === "SCHOOL" ||
    (ef.targetType === "CLASS" && ef.targetClassId === opts.classId) ||
    (ef.targetType === "SECTION" && ef.targetClassId === opts.classId && ef.targetSection === opts.section) ||
    (ef.targetType === "STUDENT" && ef.targetStudentId === opts.studentId);
  if (!applies) return false;
  const name = ef.name.toLowerCase();
  if (opts.hosteller && name.includes("mess")) return false;
  if (!opts.hosteller && name.includes("hostel")) return false;
  if (ef.residencyScope === "HOSTELLER" && !opts.hosteller) return false;
  if (ef.residencyScope === "DAY_SCHOLAR" && opts.hosteller) return false;
  return true;
}

async function main() {
  const existing = await prisma.school.findFirst({
    where: { name: SCHOOL_NAME },
    select: { id: true },
  });
  if (existing) {
    throw new Error(`${SCHOOL_NAME} already exists (${existing.id}). Nothing was changed.`);
  }

  const emails = [
    "schooladmin@rssolutions.com",
    "chairman@rssolutions.com",
    "ananya.rao@rssolutions.com",
    "karthik.reddy@rssolutions.com",
    "meera.iyer@rssolutions.com",
    "suresh.kumar@rssolutions.com",
    "RS26001",
    "RS26002",
    "RS26003",
    "RS26004",
    "RS26005",
    "RS26006",
  ];
  const taken = await prisma.user.findFirst({
    where: { email: { in: emails } },
    select: { email: true },
  });
  if (taken) {
    throw new Error(`Login ${taken.email} already exists. Nothing was changed.`);
  }

  const [adminHash, chairmanHash, teacherHash, parentHash] = await Promise.all([
    bcrypt.hash(PASSWORDS.admin, 10),
    bcrypt.hash(PASSWORDS.chairman, 10),
    bcrypt.hash(PASSWORDS.teacher, 10),
    bcrypt.hash(PASSWORDS.parent, 10),
  ]);

  const consentAt = new Date("2026-11-01T04:30:00.000Z");

  await prisma.$transaction(
    async (tx) => {
      const admin = await tx.user.create({
        data: {
          name: "RS Solutions Admin",
          email: "schooladmin@rssolutions.com",
          password: adminHash,
          role: "SCHOOLADMIN",
          mobile: "9876500100",
          language: "English",
        },
      });

      const school = await tx.school.create({
        data: {
          name: SCHOOL_NAME,
          address: "12 Campus Road, Madhapur, Hyderabad, Telangana 500081",
          location: "Hyderabad",
          isActive: true,
          billingMode: "SCHOOL_PAID",
          parentSubscriptionAmount: 0,
          parentSubscriptionTrialDays: 0,
          admins: { connect: { id: admin.id } },
        },
      });

      await tx.user.update({ where: { id: admin.id }, data: { schoolId: school.id } });

      await tx.schoolSettings.create({
        data: {
          schoolId: school.id,
          admissionPrefix: "RS",
          rollNoPrefix: "",
          admissionCounter: 6,
          residencyYearMonths: 12,
          emailDomain: "rssolutions.com",
        },
      });

      const chairman = await tx.user.create({
        data: {
          name: "Rahul Sharma",
          email: "chairman@rssolutions.com",
          password: chairmanHash,
          role: "CHAIRMAN",
          schoolId: school.id,
          mobile: "9876500101",
          allowedFeatures: ["FEES", "DASHBOARD", "SETTINGS"],
          language: "English",
        },
      });

      const teacherSeed = [
        {
          name: "Ananya Rao",
          email: "ananya.rao@rssolutions.com",
          mobile: "9876500201",
          teacherId: "TCH001",
          subject: "Mathematics",
          subjects: ["Mathematics"],
          qualification: "M.Sc, B.Ed",
          experience: "8 Years",
          joiningDate: day("2018-06-04"),
          address: "Banjara Hills, Hyderabad",
          leaveAprrover: false,
        },
        {
          name: "Karthik Reddy",
          email: "karthik.reddy@rssolutions.com",
          mobile: "9876500202",
          teacherId: "TCH002",
          subject: "Science",
          subjects: ["Science"],
          qualification: "M.Sc Physics, B.Ed",
          experience: "6 Years",
          joiningDate: day("2020-06-08"),
          address: "Kukatpally, Hyderabad",
          leaveAprrover: false,
        },
        {
          name: "Meera Iyer",
          email: "meera.iyer@rssolutions.com",
          mobile: "9876500203",
          teacherId: "TCH003",
          subject: "English",
          subjects: ["English", "Hindi"],
          qualification: "M.A English, B.Ed",
          experience: "10 Years",
          joiningDate: day("2016-06-06"),
          address: "Jubilee Hills, Hyderabad",
          leaveAprrover: false,
        },
        {
          name: "Suresh Kumar",
          email: "suresh.kumar@rssolutions.com",
          mobile: "9876500204",
          teacherId: "TCH004",
          subject: "Social Studies",
          subjects: ["Social Studies"],
          qualification: "M.A History, B.Ed",
          experience: "12 Years",
          joiningDate: day("2014-06-02"),
          address: "Ameerpet, Hyderabad",
          leaveAprrover: true,
        },
      ] as const;

      const teachers = [];
      for (const t of teacherSeed) {
        teachers.push(
          await tx.user.create({
            data: {
              ...t,
              subjects: [...t.subjects],
              password: teacherHash,
              role: "TEACHER",
              schoolId: school.id,
              teacherStatus: "Active",
              language: "English",
              allowedFeatures: TEACHER_FEATURES,
              teacherSchools: { connect: { id: school.id } },
            },
          })
        );
      }
      const [ananya, karthik, meera, suresh] = teachers;

      const classSeed = [
        { name: "Grade 5", section: "A", teacherId: ananya.id, components: [{ name: "Tuition", amount: 20000 }, { name: "Laboratory", amount: 2000 }] },
        { name: "Grade 6", section: "A", teacherId: karthik.id, components: [{ name: "Tuition", amount: 24000 }, { name: "Laboratory", amount: 2500 }] },
        { name: "Grade 8", section: "A", teacherId: meera.id, components: [{ name: "Tuition", amount: 30000 }, { name: "Laboratory", amount: 4000 }, { name: "Computer", amount: 2000 }] },
      ];

      const classes = [];
      for (const c of classSeed) {
        const created = await tx.class.create({
          data: { name: c.name, section: c.section, schoolId: school.id, teacherId: c.teacherId },
        });
        await tx.classFeeStructure.create({
          data: {
            schoolId: school.id,
            classId: created.id,
            components: c.components as Prisma.InputJsonValue,
          },
        });
        classes.push({ ...created, components: c.components, base: c.components.reduce((s, x) => s + x.amount, 0) });
      }
      const [grade5, grade6, grade8] = classes;
      const classIds = classes.map((c) => c.id);

      await tx.user.update({ where: { id: ananya.id }, data: { teachingClassIds: classIds } });
      await tx.user.update({ where: { id: karthik.id }, data: { teachingClassIds: classIds } });
      await tx.user.update({ where: { id: meera.id }, data: { teachingClassIds: classIds } });
      await tx.user.update({ where: { id: suresh.id }, data: { teachingClassIds: classIds } });

      const subjects = ["English", "Mathematics", "Science", "Social Studies", "Hindi"];
      const studentSeed = [
        {
          admissionNumber: "RS26001",
          name: "Aarav Sharma",
          fatherName: "Rajesh Sharma",
          motherName: "Pooja Sharma",
          gender: "Male",
          dob: day("2015-06-14"),
          phoneNo: "9876511001",
          aadhaarNo: "910000000001",
          rollNo: "1",
          address: "Madhapur, Hyderabad",
          residencyType: "Day Scholar",
          class: grade5,
          discountPercent: 0,
          paid: 10000,
        },
        {
          admissionNumber: "RS26002",
          name: "Diya Patel",
          fatherName: "Amit Patel",
          motherName: "Neha Patel",
          gender: "Female",
          dob: day("2015-09-02"),
          phoneNo: "9876511002",
          aadhaarNo: "910000000002",
          rollNo: "2",
          address: "Gachibowli, Hyderabad",
          residencyType: "Day Scholar",
          class: grade5,
          discountPercent: 10,
          paid: 0,
        },
        {
          admissionNumber: "RS26003",
          name: "Vihaan Nair",
          fatherName: "Suresh Nair",
          motherName: "Lakshmi Nair",
          gender: "Male",
          dob: day("2014-01-20"),
          phoneNo: "9876511003",
          aadhaarNo: "910000000003",
          rollNo: "1",
          address: "Kondapur, Hyderabad",
          residencyType: "Day Scholar",
          class: grade6,
          discountPercent: 0,
          paid: 0,
        },
        {
          admissionNumber: "RS26004",
          name: "Anika Gupta",
          fatherName: "Neeraj Gupta",
          motherName: "Ritu Gupta",
          gender: "Female",
          dob: day("2014-11-08"),
          phoneNo: "9876511004",
          aadhaarNo: "910000000004",
          rollNo: "2",
          address: "Hitech City, Hyderabad",
          residencyType: "Day Scholar",
          class: grade6,
          discountPercent: 0,
          paid: 5000,
        },
        {
          admissionNumber: "RS26005",
          name: "Arjun Singh",
          fatherName: "Vikram Singh",
          motherName: "Kavita Singh",
          gender: "Male",
          dob: day("2012-03-25"),
          phoneNo: "9876511005",
          aadhaarNo: "910000000005",
          rollNo: "1",
          address: "Begumpet, Hyderabad",
          residencyType: "Hosteller",
          class: grade8,
          discountPercent: 0,
          paid: 8000,
        },
        {
          admissionNumber: "RS26006",
          name: "Sara Khan",
          fatherName: "Imran Khan",
          motherName: "Farah Khan",
          gender: "Female",
          dob: day("2012-07-19"),
          phoneNo: "9876511006",
          aadhaarNo: "910000000006",
          rollNo: "2",
          address: "Tolichowki, Hyderabad",
          residencyType: "Day Scholar",
          class: grade8,
          discountPercent: 0,
          paid: 6000,
        },
      ];

      const students = [];
      for (const s of studentSeed) {
        const user = await tx.user.create({
          data: {
            name: s.name,
            email: s.admissionNumber,
            password: parentHash,
            role: "STUDENT",
            schoolId: school.id,
            language: "English",
            privacyConsentVersion: PRIVACY_POLICY_VERSION,
            privacyConsentAt: consentAt,
          },
        });
        const student = await tx.student.create({
          data: {
            userId: user.id,
            schoolId: school.id,
            classId: s.class.id,
            admissionNumber: s.admissionNumber,
            fatherName: s.fatherName,
            motherName: s.motherName,
            occupation: "Private service",
            aadhaarNo: s.aadhaarNo,
            phoneNo: s.phoneNo,
            rollNo: s.rollNo,
            dob: s.dob,
            address: s.address,
            gender: s.gender,
            previousSchool: "Demo Primary School",
            residencyType: s.residencyType,
            status: "Active",
            subjects,
            applicationFee: 500,
            admissionFee: 5000,
          },
        });
        students.push({ ...s, id: student.id, userId: user.id });
      }
      const byAdm = Object.fromEntries(students.map((s) => [s.admissionNumber, s]));

      const extraCreates: Prisma.ExtraFeeCreateManyInput[] = [
        { schoolId: school.id, name: "Uniform Fee", amount: 2500, targetType: "SCHOOL", residencyScope: "ALL" },
        { schoolId: school.id, name: "Annual Day Fee", amount: 500, targetType: "SCHOOL", residencyScope: "ALL" },
        { schoolId: school.id, name: "Books", amount: 1500, targetType: "CLASS", targetClassId: grade5.id, residencyScope: "ALL" },
        { schoolId: school.id, name: "Sports Fee", amount: 800, targetType: "CLASS", targetClassId: grade6.id, residencyScope: "ALL" },
        { schoolId: school.id, name: "Lab Consumables", amount: 1200, targetType: "CLASS", targetClassId: grade8.id, residencyScope: "ALL" },
        {
          schoolId: school.id,
          name: "Hostel Fee (1st Installment)",
          amount: 8000,
          targetType: "STUDENT",
          targetStudentId: byAdm.RS26005.id,
          residencyScope: "HOSTELLER",
        },
        {
          schoolId: school.id,
          name: "Hostel Fee (2nd Installment)",
          amount: 8000,
          targetType: "STUDENT",
          targetStudentId: byAdm.RS26005.id,
          residencyScope: "HOSTELLER",
        },
        {
          schoolId: school.id,
          name: "Transport Fee",
          amount: 6000,
          targetType: "STUDENT",
          targetStudentId: byAdm.RS26006.id,
          residencyScope: "DAY_SCHOLAR",
        },
      ];
      await tx.extraFee.createMany({ data: extraCreates });
      const extras = await tx.extraFee.findMany({ where: { schoolId: school.id } });

      await tx.extraFeeHeadTemplate.createMany({
        data: [
          { schoolId: school.id, name: "Picnic Fee", amount: 800 },
          { schoolId: school.id, name: "ID Card", amount: 150 },
          { schoolId: school.id, name: "Exam Fee", amount: 400 },
        ],
      });

      await tx.studentResidencyPeriod.create({
        data: {
          studentId: byAdm.RS26005.id,
          schoolId: school.id,
          academicYearStartYear: 2026,
          residencyType: "Hosteller",
          startedOn: day("2026-06-01"),
          months: 12,
        },
      });

      const fees = [];
      for (const s of students) {
        const hosteller = s.residencyType.toLowerCase().includes("hostel");
        const extrasTotal = extras
          .filter((ef) =>
            extraApplies(ef, {
              classId: s.class.id,
              section: s.class.section ?? "",
              studentId: s.id,
              hosteller,
            })
          )
          .reduce((sum, ef) => sum + ef.amount, 0);
        const totalFee = s.class.base + extrasTotal;
        const finalFee = Math.round(s.class.base * (1 - s.discountPercent / 100)) + extrasTotal;
        const fee = await tx.studentFee.create({
          data: {
            studentId: s.id,
            totalFee,
            discountPercent: s.discountPercent,
            finalFee,
            amountPaid: s.paid,
            remainingFee: Math.max(0, finalFee - s.paid),
            discountFeeHeadKey: s.discountPercent ? "BASE:0" : null,
            discountFeeHeadLabel: s.discountPercent ? "Tuition" : null,
            discountRemarks: s.discountPercent ? "Sibling concession, approved by chairman" : null,
          },
        });
        fees.push({ ...s, feeId: fee.id, totalFee, finalFee });
      }
      const feeByAdm = Object.fromEntries(fees.map((f) => [f.admissionNumber, f]));

      const hostelFirst = extras.find((e) => e.name.startsWith("Hostel Fee (1st") && e.targetStudentId === byAdm.RS26005.id);
      const transport = extras.find((e) => e.name === "Transport Fee");

      const aaravPay = await tx.payment.create({
        data: {
          studentId: byAdm.RS26001.id,
          amount: 10000,
          gateway: "OFFLINE_CASH",
          status: "SUCCESS",
          purpose: "FEES",
          transactionId: "CASH-RS-1001",
          receiptNo: 1,
          clientRequestId: "demo-rs-pay-aarav",
          collectedByUserId: admin.id,
          collectedByName: admin.name,
          hyperpgStatus: "CHARGED",
        },
      });
      await tx.paymentFeeAllocation.create({
        data: {
          paymentId: aaravPay.id,
          studentId: byAdm.RS26001.id,
          headType: "BASE_COMPONENT",
          componentIndex: 0,
          componentName: "Tuition",
          allocationType: "PAYMENT",
          allocatedAmount: 10000,
        },
      });

      const anikaPay = await tx.payment.create({
        data: {
          studentId: byAdm.RS26004.id,
          amount: 5000,
          gateway: "OFFLINE_UPI",
          status: "SUCCESS",
          purpose: "FEES",
          transactionId: "UPI-RS-1002",
          receiptNo: 2,
          clientRequestId: "demo-rs-pay-anika",
          collectedByUserId: ananya.id,
          collectedByName: ananya.name,
          hyperpgStatus: "CHARGED",
        },
      });
      await tx.paymentFeeAllocation.create({
        data: {
          paymentId: anikaPay.id,
          studentId: byAdm.RS26004.id,
          headType: "BASE_COMPONENT",
          componentIndex: 0,
          componentName: "Tuition",
          allocationType: "PAYMENT",
          allocatedAmount: 5000,
        },
      });

      const arjunPay = await tx.payment.create({
        data: {
          studentId: byAdm.RS26005.id,
          amount: 8000,
          gateway: "OFFLINE_CASH",
          status: "SUCCESS",
          purpose: "FEES",
          transactionId: "CASH-RS-1003",
          receiptNo: 3,
          clientRequestId: "demo-rs-pay-arjun",
          collectedByUserId: admin.id,
          collectedByName: admin.name,
        },
      });
      if (hostelFirst) {
        await tx.paymentFeeAllocation.create({
          data: {
            paymentId: arjunPay.id,
            studentId: byAdm.RS26005.id,
            headType: "EXTRA_FEE",
            extraFeeId: hostelFirst.id,
            componentName: hostelFirst.name,
            allocationType: "PAYMENT",
            allocatedAmount: 8000,
          },
        });
      }

      const saraPay = await tx.payment.create({
        data: {
          studentId: byAdm.RS26006.id,
          amount: 6000,
          gateway: "OFFLINE_UPI",
          status: "SUCCESS",
          purpose: "FEES",
          transactionId: "UPI-RS-1004",
          receiptNo: 4,
          clientRequestId: "demo-rs-pay-sara",
          collectedByUserId: meera.id,
          collectedByName: meera.name,
        },
      });
      if (transport) {
        await tx.paymentFeeAllocation.create({
          data: {
            paymentId: saraPay.id,
            studentId: byAdm.RS26006.id,
            headType: "EXTRA_FEE",
            extraFeeId: transport.id,
            componentName: "Transport Fee",
            allocationType: "PAYMENT",
            allocatedAmount: 6000,
          },
        });
      }

      await tx.receiptCounter.create({ data: { schoolId: school.id, lastNo: 4 } });

      await tx.feeDiscountApproval.create({
        data: {
          schoolId: school.id,
          studentId: byAdm.RS26002.id,
          studentFeeId: feeByAdm.RS26002.feeId,
          requestedById: ananya.id,
          reviewedById: chairman.id,
          status: "APPROVED",
          totalFee: feeByAdm.RS26002.totalFee,
          discountPercent: 10,
          finalFee: feeByAdm.RS26002.finalFee,
          discountFeeHeadKey: "BASE:0",
          discountFeeHeadLabel: "Tuition",
          discountRemarks: "Sibling concession",
          reviewRemarks: "Approved for 2026-27",
          reviewedAt: new Date("2026-10-20T06:00:00.000Z"),
        },
      });
      await tx.feeDiscountApproval.create({
        data: {
          schoolId: school.id,
          studentId: byAdm.RS26003.id,
          studentFeeId: feeByAdm.RS26003.feeId,
          requestedById: karthik.id,
          status: "PENDING",
          totalFee: feeByAdm.RS26003.totalFee,
          discountPercent: 5,
          finalFee: Math.round(grade6.base * 0.95) + (feeByAdm.RS26003.totalFee - grade6.base),
          discountFeeHeadKey: "BASE:0",
          discountFeeHeadLabel: "Tuition",
          discountRemarks: "Merit concession requested after the unit test",
        },
      });

      await tx.pettyCashExpense.createMany({
        data: [
          {
            schoolId: school.id,
            voucherNo: 1,
            itemName: "Whiteboard markers",
            headOfAccount: "Stationery",
            paymentType: "CASH",
            amount: 640,
            expenseDate: day("2026-11-02"),
            description: "Markers for Grade 5 and Grade 6",
          },
          {
            schoolId: school.id,
            voucherNo: 2,
            itemName: "Science lab glassware",
            headOfAccount: "Laboratory",
            paymentType: "ONLINE",
            amount: 1850,
            expenseDate: day("2026-11-04"),
            description: "Replacement beakers",
          },
          {
            schoolId: school.id,
            voucherNo: 3,
            itemName: "Sports day refreshments",
            headOfAccount: "Events",
            paymentType: "CASH",
            amount: 2200,
            expenseDate: day("2026-11-06"),
          },
        ],
      });

      const uniform = extras.find((e) => e.name === "Uniform Fee");
      if (uniform) {
        await tx.feeAuditLog.create({
          data: {
            schoolId: school.id,
            entityType: "EXTRA_FEE",
            entityId: uniform.id,
            action: "CREATE",
            actorUserId: admin.id,
            actorName: admin.name,
            actorRole: "SCHOOLADMIN",
            summary: "Uniform Fee set to 2500 for the whole school",
            after: { name: "Uniform Fee", amount: 2500 },
          },
        });
      }
      await tx.paymentAuditLog.create({
        data: {
          schoolId: school.id,
          paymentId: aaravPay.id,
          studentId: byAdm.RS26001.id,
          action: "CREATE",
          actorUserId: admin.id,
          actorName: admin.name,
          actorRole: "SCHOOLADMIN",
          summary: "Cash collection of 10000 towards Tuition",
          after: { amount: 10000, status: "SUCCESS", receiptNo: 1 },
        },
      });

      const attendanceDays = ["2026-10-26", "2026-10-27", "2026-10-28", "2026-10-29", "2026-10-30", "2026-11-02", "2026-11-03", "2026-11-04", "2026-11-05", "2026-11-06"];
      const absent: Record<string, string> = { RS26001: "2026-11-03", RS26004: "2026-10-28" };
      const late: Record<string, string> = { RS26002: "2026-11-04", RS26006: "2026-11-02" };
      const attendanceRows: Prisma.AttendanceCreateManyInput[] = [];
      for (const s of students) {
        for (const iso of attendanceDays) {
          const status = absent[s.admissionNumber] === iso ? "ABSENT" : late[s.admissionNumber] === iso ? "LATE" : "PRESENT";
          attendanceRows.push({
            date: day(iso),
            period: 1,
            status,
            studentId: s.id,
            classId: s.class.id,
            teacherId: s.class.teacherId!,
          });
        }
      }
      await tx.attendance.createMany({ data: attendanceRows });

      const teacherDays = ["2026-11-02", "2026-11-03", "2026-11-04", "2026-11-05", "2026-11-06"];
      await tx.teacherDailyAttendance.createMany({
        data: teachers.flatMap((t) =>
          teacherDays.map((iso) => ({
            teacherId: t.id,
            schoolId: school.id,
            date: day(iso),
            status: t.id === karthik.id && iso === "2026-11-05" ? "ON_LEAVE" : "PRESENT",
          }))
        ),
      });

      const examSubjects = ["ENGLISH", "MATHEMATICS", "SCIENCE", "SOCIAL STUDIES", "HINDI"];
      await tx.examSubject.createMany({
        data: examSubjects.map((name) => ({ name, schoolId: school.id })),
      });
      const term1Type = await tx.examType.create({
        data: {
          name: "TERM 1",
          maxMarks: 100,
          schoolId: school.id,
          sections: {
            create: [
              { name: "Written", maxMarks: 80, order: 0 },
              { name: "Practical", maxMarks: 20, order: 1 },
            ],
          },
        },
      });
      await tx.examType.create({
        data: { name: "HALF YEARLY", maxMarks: 100, schoolId: school.id },
      });
      await tx.examTypeSubject.create({
        data: {
          subject: "MATHEMATICS",
          maxMarks: 100,
          examTypeId: term1Type.id,
          sections: {
            create: [
              { name: "Written", maxMarks: 80, order: 0 },
              { name: "Practical", maxMarks: 20, order: 1 },
            ],
          },
        },
      });

      const scoreBank: Record<string, number[]> = {
        RS26001: [86, 92, 78, 81, 74],
        RS26002: [91, 88, 84, 79, 90],
        RS26003: [72, 68, 80, 75, 70],
        RS26004: [95, 97, 89, 92, 88],
        RS26005: [64, 71, 69, 73, 66],
        RS26006: [82, 85, 90, 77, 84],
      };
      for (const s of students) {
        for (let i = 0; i < examSubjects.length; i++) {
          const subject = examSubjects[i];
          const marks = scoreBank[s.admissionNumber][i];
          const mark = await tx.mark.create({
            data: {
              subject,
              marks,
              totalMarks: 100,
              grade: gradeFor(marks, 100),
              suggestions: marks >= 90 ? "Excellent work. Keep the same pace." : marks >= 75 ? "Good progress. Revise the weaker chapters." : "Needs regular practice and doubt-clearing.",
              examType: "TERM 1",
              studentId: s.id,
              classId: s.class.id,
              teacherId: s.class.teacherId!,
            },
          });
          if (subject === "MATHEMATICS") {
            const written = Math.round(marks * 0.8);
            await tx.markComponent.createMany({
              data: [
                { name: "Written", marks: written, totalMarks: 80, markId: mark.id },
                { name: "Practical", marks: marks - written, totalMarks: 20, markId: mark.id },
              ],
            });
          }
        }
      }

      for (const cls of classes) {
        const completed = await tx.examTerm.create({
          data: {
            name: "Term 1",
            description: "June to September assessments",
            status: "COMPLETED",
            classId: cls.id,
            schoolId: school.id,
            sections: { create: [{ name: "Written", maxMarks: 80, order: 0 }, { name: "Practical", maxMarks: 20, order: 1 }] },
          },
        });
        const upcoming = await tx.examTerm.create({
          data: {
            name: "Half Yearly",
            description: "Half yearly examinations, November 2026",
            status: "UPCOMING",
            classId: cls.id,
            schoolId: school.id,
          },
        });
        await tx.examSchedule.createMany({
          data: [
            { termId: upcoming.id, subject: "English", examDate: day("2026-11-16"), startTime: "09:30 AM", durationMin: 150 },
            { termId: upcoming.id, subject: "Mathematics", examDate: day("2026-11-18"), startTime: "09:30 AM", durationMin: 150 },
            { termId: upcoming.id, subject: "Science", examDate: day("2026-11-20"), startTime: "09:30 AM", durationMin: 150 },
            { termId: upcoming.id, subject: "Social Studies", examDate: day("2026-11-23"), startTime: "09:30 AM", durationMin: 150 },
          ],
        });
        const englishTrack = await tx.syllabusTracking.create({
          data: {
            termId: completed.id,
            subject: "English",
            completedPercent: 80,
            notes: "Prose and poetry for Term 1 are done. Grammar revision is pending.",
          },
        });
        await tx.syllabusUnit.createMany({
          data: [
            { trackingId: englishTrack.id, unitName: "Prose", completedPercent: 100, order: 0 },
            { trackingId: englishTrack.id, unitName: "Poetry", completedPercent: 100, order: 1 },
            { trackingId: englishTrack.id, unitName: "Grammar", completedPercent: 40, order: 2 },
          ],
        });
        await tx.syllabusTracking.create({
          data: { termId: upcoming.id, subject: "Mathematics", completedPercent: 55, notes: "Fractions and decimals are in progress." },
        });
      }

      const periods = [
        { slotOrder: 0, slotType: "PERIOD", title: "English", subject: "English", startTime: "09:00", endTime: "09:45", teacherId: meera.id },
        { slotOrder: 1, slotType: "PERIOD", title: "Mathematics", subject: "Mathematics", startTime: "09:45", endTime: "10:30", teacherId: ananya.id },
        { slotOrder: 2, slotType: "BREAK", title: "Break", subject: null, startTime: "10:30", endTime: "10:45", teacherId: null },
        { slotOrder: 3, slotType: "PERIOD", title: "Science", subject: "Science", startTime: "10:45", endTime: "11:30", teacherId: karthik.id },
        { slotOrder: 4, slotType: "PERIOD", title: "Social Studies", subject: "Social Studies", startTime: "11:30", endTime: "12:15", teacherId: suresh.id },
      ];
      const dayLabels = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
      for (const cls of classes) {
        const timetable = await tx.timetable.create({
          data: {
            schoolId: school.id,
            classId: cls.id,
            title: `${cls.name} ${cls.section} Weekly Timetable`,
            notes: "Demo timetable for 2026-27",
            createdById: admin.id,
          },
        });
        await tx.timetableEntry.createMany({
          data: dayLabels.flatMap((dayLabel, index) =>
            periods.map((p) => ({
              timetableId: timetable.id,
              dayOfWeek: index + 1,
              dayLabel,
              slotOrder: p.slotOrder,
              slotType: p.slotType,
              title: p.title,
              subject: p.subject,
              startTime: p.startTime,
              endTime: p.endTime,
              room: p.slotType === "BREAK" ? null : `Room ${cls.name.replace("Grade ", "")}${cls.section}`,
              teacherId: p.teacherId,
            }))
          ),
        });
      }

      const hwMath = await tx.homework.create({
        data: {
          title: "Fractions worksheet",
          description: "Complete exercises 3.1 and 3.2 in the textbook. Show all working.",
          subject: "Mathematics",
          assignedDate: day("2026-11-05"),
          dueDate: day("2026-11-10"),
          classId: grade5.id,
          teacherId: ananya.id,
          schoolId: school.id,
        },
      });
      const hwSci = await tx.homework.create({
        data: {
          title: "Plant life cycle",
          description: "Draw and label the life cycle of a flowering plant.",
          subject: "Science",
          assignedDate: day("2026-11-04"),
          dueDate: day("2026-11-09"),
          classId: grade6.id,
          teacherId: karthik.id,
          schoolId: school.id,
        },
      });
      const hwEng = await tx.homework.create({
        data: {
          title: "Letter writing",
          description: "Write a formal letter to the principal about the library hours.",
          subject: "English",
          assignedDate: day("2026-11-03"),
          dueDate: day("2026-11-12"),
          classId: grade8.id,
          teacherId: meera.id,
          schoolId: school.id,
        },
      });
      await tx.homeworkSubmission.create({
        data: {
          homeworkId: hwMath.id,
          studentId: byAdm.RS26001.id,
          content: "Submitted the worksheet in class.",
          graded: true,
          grade: "A",
        },
      });
      await tx.homeworkSubmission.create({
        data: {
          homeworkId: hwSci.id,
          studentId: byAdm.RS26003.id,
          content: "Diagram submitted. Colouring is pending.",
          graded: false,
        },
      });
      await tx.homeworkSubmission.create({
        data: {
          homeworkId: hwEng.id,
          studentId: byAdm.RS26006.id,
          content: "Formal letter attached in the notebook.",
          graded: true,
          grade: "B+",
        },
      });

      const scienceFair = await tx.event.create({
        data: {
          title: "Science Exhibition",
          description: "Class projects on everyday science. Parents are welcome from 10 AM.",
          type: "Exhibition",
          level: "School",
          location: "School auditorium",
          mode: "Offline",
          eventDate: day("2026-11-21"),
          maxSeats: 120,
          amount: 0,
          classId: grade6.id,
          teacherId: karthik.id,
          schoolId: school.id,
        },
      });
      const robotics = await tx.event.create({
        data: {
          title: "Robotics Workshop",
          description: "A Saturday workshop on simple sensors and motors.",
          type: "Workshop",
          level: "School",
          location: "Computer lab",
          mode: "Offline",
          additionalInfo: "Bring a notebook. Kits are provided.",
          eventDate: day("2026-11-28"),
          maxSeats: 30,
          amount: 500,
          teacherId: ananya.id,
          schoolId: school.id,
        },
      });
      await tx.eventRegistration.createMany({
        data: [
          { eventId: scienceFair.id, studentId: byAdm.RS26003.id, paymentStatus: "PAID" },
          { eventId: scienceFair.id, studentId: byAdm.RS26004.id, paymentStatus: "PAID" },
          { eventId: robotics.id, studentId: byAdm.RS26005.id, paymentStatus: "PENDING" },
          { eventId: robotics.id, studentId: byAdm.RS26001.id, paymentStatus: "PAID" },
        ],
      });

      const news = await tx.newsFeed.create({
        data: {
          title: "Half yearly exams begin 16 November",
          description: "The half yearly timetable is on the exams page. Students should carry their ID cards.",
          likes: 1,
          schoolId: school.id,
          createdById: admin.id,
        },
      });
      await tx.newsFeed.create({
        data: {
          title: "Annual day practice",
          description: "Grade 5 and Grade 8 practice is after lunch on Wednesday and Thursday.",
          schoolId: school.id,
          createdById: meera.id,
        },
      });
      await tx.newsFeedLike.create({ data: { userId: byAdm.RS26001.userId, newsFeedId: news.id } });

      await tx.circular.createMany({
        data: [
          {
            referenceNumber: "CIR/2026/001",
            date: day("2026-11-01"),
            subject: "Half yearly examination schedule",
            content: "Half yearly exams run from 16 November to 23 November. Arrive by 9:00 AM. A detailed subject list is with the class teacher.",
            issuedById: admin.id,
            schoolId: school.id,
            importanceLevel: "High",
            recipients: ["parents", "students", "teachers"],
            publishStatus: "PUBLISHED",
          },
          {
            referenceNumber: "CIR/2026/002",
            date: day("2026-11-05"),
            subject: "Parent-teacher meeting",
            content: "The parent-teacher meeting for Grade 5 and Grade 6 is on 14 November, 9:30 AM to 12:30 PM.",
            issuedById: admin.id,
            schoolId: school.id,
            importanceLevel: "Medium",
            recipients: ["parents"],
            classId: grade5.id,
            publishStatus: "PUBLISHED",
          },
          {
            referenceNumber: "CIR/2026/003",
            date: day("2026-11-08"),
            subject: "Winter uniform draft",
            content: "Draft notice: winter uniform starts on 1 December.",
            issuedById: suresh.id,
            schoolId: school.id,
            importanceLevel: "Low",
            recipients: ["all"],
            publishStatus: "DRAFT",
          },
        ],
      });

      const template = await tx.certificateTemplate.create({
        data: {
          name: "Academic Excellence",
          description: "Awarded for Term 1 performance",
          template: "<h1>{{studentName}}</h1><p>Awarded for academic excellence in Term 1, 2026-27.</p>",
          schoolId: school.id,
          createdById: admin.id,
        },
      });
      await tx.certificate.create({
        data: {
          title: "Academic Excellence — Term 1",
          description: "Highest marks in Grade 6 A",
          issuedDate: day("2026-10-15"),
          templateId: template.id,
          studentId: byAdm.RS26004.id,
          issuedById: admin.id,
          schoolId: school.id,
          eventId: scienceFair.id,
        },
      });
      await tx.transferCertificate.create({
        data: {
          reason: "Bonafide certificate for a passport application",
          status: "PENDING",
          studentId: byAdm.RS26002.id,
          requestedById: byAdm.RS26002.userId,
          schoolId: school.id,
        },
      });
      await tx.transferCertificate.create({
        data: {
          reason: "Study certificate for the academic year 2026-27",
          status: "ISSUED",
          issuedDate: day("2026-09-12"),
          studentId: byAdm.RS26001.id,
          requestedById: byAdm.RS26001.userId,
          approvedById: admin.id,
          schoolId: school.id,
        },
      });

      await tx.leaveRequest.create({
        data: {
          teacherId: karthik.id,
          approverId: suresh.id,
          schoolId: school.id,
          leaveType: "SICK",
          reason: "Fever. Medical note will be submitted on return.",
          fromDate: day("2026-11-05"),
          toDate: day("2026-11-05"),
          status: "APPROVED",
          remarks: "Approved. Class covered by Meera Iyer.",
        },
      });
      await tx.leaveRequest.create({
        data: {
          teacherId: meera.id,
          schoolId: school.id,
          leaveType: "CASUAL",
          reason: "Family function in Chennai.",
          fromDate: day("2026-11-19"),
          toDate: day("2026-11-20"),
          status: "PENDING",
        },
      });
      await tx.studentLeaveRequest.create({
        data: {
          studentId: byAdm.RS26001.id,
          schoolId: school.id,
          leaveType: "SICK",
          reason: "Cold and fever. Staying home on the advice of the doctor.",
          fromDate: day("2026-11-03"),
          toDate: day("2026-11-03"),
          status: "APPROVED",
          approverId: ananya.id,
          remarks: "Approved. Get well soon.",
        },
      });
      await tx.studentLeaveRequest.create({
        data: {
          studentId: byAdm.RS26006.id,
          schoolId: school.id,
          leaveType: "CASUAL",
          reason: "Attending a family wedding in Vijayawada.",
          fromDate: day("2026-11-13"),
          toDate: day("2026-11-14"),
          status: "PENDING",
        },
      });

      const appointment = await tx.appointment.create({
        data: {
          studentId: byAdm.RS26002.id,
          teacherId: ananya.id,
          schoolId: school.id,
          requestedAt: new Date("2026-11-06T05:00:00.000Z"),
          scheduledAt: new Date("2026-11-11T04:30:00.000Z"),
          status: "APPROVED",
          note: "Discuss the Term 1 mathematics paper.",
        },
      });
      await tx.chatMessage.createMany({
        data: [
          {
            appointmentId: appointment.id,
            senderId: byAdm.RS26002.userId,
            content: "Good morning ma'am. Can we meet about Diya's maths paper?",
            createdAt: new Date("2026-11-06T05:05:00.000Z"),
          },
          {
            appointmentId: appointment.id,
            senderId: ananya.id,
            content: "Yes. Wednesday 10:00 AM works. Please bring the answer sheet.",
            createdAt: new Date("2026-11-06T06:10:00.000Z"),
          },
        ],
      });
      await tx.appointment.create({
        data: {
          studentId: byAdm.RS26005.id,
          teacherId: meera.id,
          schoolId: school.id,
          status: "PENDING",
          note: "Request a meeting about hostel study hours.",
        },
      });

      await tx.teacherAuditRecord.createMany({
        data: [
          {
            teacherId: ananya.id,
            createdById: admin.id,
            category: "TEACHING_METHOD",
            description: "Clear board work and weekly doubt sessions for Grade 5.",
            scoreImpact: 5,
          },
          {
            teacherId: karthik.id,
            createdById: admin.id,
            category: "STUDENT_ENGAGEMENT",
            description: "Science exhibition projects are on track.",
            scoreImpact: 4,
          },
          {
            teacherId: meera.id,
            createdById: suresh.id,
            category: "PUNCTUALITY",
            description: "Arrived late to the first period twice in October.",
            scoreImpact: -2,
          },
        ],
      });

      await tx.notification.createMany({
        data: [
          { userId: admin.id, title: "Fee collection", message: "Four demo fee receipts are recorded for November.", type: "FEES" },
          { userId: chairman.id, title: "Discount waiting", message: "Vihaan Nair has a 5% tuition concession waiting for review.", type: "FEES", isRead: false },
          { userId: ananya.id, title: "Leave approved", message: "Aarav Sharma's sick leave on 3 November is approved.", type: "LEAVE" },
          { userId: byAdm.RS26001.userId, title: "Homework due", message: "Fractions worksheet is due on 10 November.", type: "HOMEWORK", isRead: false },
          { userId: byAdm.RS26004.userId, title: "Term 1 marks", message: "Term 1 marks are published.", type: "MARKS" },
          { userId: byAdm.RS26003.userId, title: "Science exhibition", message: "You are registered for the Science Exhibition on 21 November.", type: "WORKSHOPS" },
        ],
      });

      await tx.loginAuditLog.createMany({
        data: [
          { schoolId: school.id, userId: admin.id, role: "SCHOOLADMIN", name: admin.name, email: admin.email },
          { schoolId: school.id, userId: chairman.id, role: "CHAIRMAN", name: chairman.name, email: chairman.email },
          { schoolId: school.id, userId: ananya.id, role: "TEACHER", name: ananya.name, email: ananya.email },
          { schoolId: school.id, userId: byAdm.RS26001.userId, studentId: byAdm.RS26001.id, role: "STUDENT", name: "Aarav Sharma", email: "RS26001" },
        ],
      });

      const periodEnd = new Date("2027-05-31T18:29:59.000Z");
      await tx.parentSubscription.createMany({
        data: students.map((s) => ({
          studentId: s.id,
          schoolId: school.id,
          status: "ACTIVE" as const,
          isTrial: false,
          startedAt: consentAt,
          currentPeriodEnd: periodEnd,
          amount: 0,
          currency: "INR",
        })),
      });

      await tx.studentApplication.create({
        data: {
          schoolId: school.id,
          classId: grade5.id,
          className: "Grade 5",
          section: "A",
          applicationNo: "APP/2026/014",
          gradeSought: "GRADE_5",
          boardingType: "SEMI_RESIDENTIAL",
          residencyType: "Day Scholar",
          totalFee: 26500,
          applicationFee: 500,
          admissionFee: 5000,
          applicationFeePaid: true,
          applicationFeePaidAt: day("2026-11-07"),
          applicationFeePaymentMode: "CASH",
          firstName: "Ishaan",
          lastName: "Verma",
          gender: "MALE",
          dateOfBirth: day("2015-12-01"),
          aadharNo: "910000000014",
          firstLanguage: "Hindi",
          nationality: "Indian",
          languagesAtHome: "Hindi, Telugu",
          houseNo: "18",
          street: "Botanical Garden Road",
          city: "Hyderabad",
          state: "Telangana",
          pinCode: "500032",
          parentName: "Rohit Verma",
          motherName: "Sneha Verma",
          parentOccupation: "Engineer",
          officeAddress: "Hitech City, Hyderabad",
          parentPhone: "9876511014",
          parentEmail: "rohit.verma.demo@rssolutions.com",
          parentAadharNo: "910000000114",
          parentWhatsapp: "9876511014",
          bankAccountNo: "501009998877",
          previousSchoolName: "City Primary School",
          previousSchoolAddress: "Kondapur, Hyderabad",
          emergencyFatherNo: "9876511014",
          emergencyMotherNo: "9876511015",
          emergencyGuardianNo: "9876511016",
          workflowStatus: "PENDING",
        },
      });

      console.log(`School ${school.id} created.`);
    },
    { timeout: 180000, maxWait: 20000 }
  );
}

main()
  .catch((err) => {
    console.error(err instanceof Error ? err.message : err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
