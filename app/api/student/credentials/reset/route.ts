import { NextResponse } from "next/server";
import { z } from "zod";
import type { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { tenantDb as prisma, runInTenantScope } from "@/lib/db/tenantContext";
import {
  canonicalStudentPasswordFromDob,
  decodeDobPasswordCheck,
  dobDefaultPasswordCheck,
  hashStudentPasswordFromDob,
} from "@/lib/students/studentDefaultPassword";
import { invalidateStudentListCaches } from "@/lib/students/invalidateStudentListCaches";
import { logger } from "@/lib/logger";
import { schoolIdViaAdminRelation } from "@/lib/auth/tenant";
import { toClientErrorMessage } from "@/lib/errors/errorInfo";

const MAX_RESET = 5000;

/**
 * Time one request may spend hashing (the route's limit is 60 s; a bcrypt hash is ~0.1 s). What does not fit
 * is reported as `remaining`, and the page calls again: students already on the DOB default are skipped,
 * so each call carries on where the last stopped.
 */
const RESET_BUDGET_MS = 40_000;
const RESET_CHUNK = 20;

const resetCredentialsBodySchema = z.object({
  classId: z.string().optional(),
  className: z.string().optional(),
  section: z.string().optional(),
  /** Reset only these students (admission-desk fix for one login); the class filters are then ignored. */
  studentIds: z.array(z.string().min(1)).max(100).optional(),
});

async function resolveSchoolId(session: {
  user: { id: string; schoolId?: string | null };
}): Promise<string | null> {
  return session.user.schoolId ?? (await schoolIdViaAdminRelation(session.user.id));
}

function buildWhere(
  schoolId: string,
  classId: string,
  className: string,
  section: string
): Prisma.StudentWhereInput {
  const where: Prisma.StudentWhereInput = { schoolId, status: "Active" };

  if (classId) {
    where.classId = classId;
  } else if (className) {
    where.class = {
      schoolId,
      name: className,
      ...(section ? { section } : {}),
    };
  } else if (section) {
    where.class = { schoolId, section };
  }

  return where;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const isAdmin =
      session.user.role === "SCHOOLADMIN" || session.user.role === "SUPERADMIN";
    if (!isAdmin) {
      return NextResponse.json(
        { message: "Only admins can reset student credentials" },
        { status: 403 }
      );
    }

    const schoolId = await resolveSchoolId(session);
    if (!schoolId) {
      return NextResponse.json(
        { message: "School not found in session" },
        { status: 400 }
      );
    }
    return await runInTenantScope(schoolId, async (schoolId) => {

    if (session.user.schoolIsActive === false) {
      return NextResponse.json({ message: "School is paused" }, { status: 403 });
    }

    const parsedBody = resetCredentialsBodySchema.safeParse(await req.json().catch(() => ({})));
    if (!parsedBody.success) {
      return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
    }
    const body = parsedBody.data;

    const classId = body.classId?.trim() || "";
    const className = body.className?.trim() || "";
    const section = body.section?.trim() || "";

    if (classId) {
      const classData = await prisma.class.findFirst({
        where: { id: classId, schoolId },
        select: { id: true },
      });
      if (!classData) {
        return NextResponse.json(
          { message: "Class not found or doesn't belong to your school" },
          { status: 404 }
        );
      }
    }

    const studentIds = [...new Set((body.studentIds ?? []).map((s) => s.trim()).filter(Boolean))];
    const where: Prisma.StudentWhereInput =
      studentIds.length > 0
        ? { schoolId, status: "Active", id: { in: studentIds } }
        : buildWhere(schoolId, classId, className, section);

    const students = await prisma.student.findMany({
      where,
      take: MAX_RESET,
      select: {
        id: true,
        dob: true,
        userId: true,
        user: { select: { password: true, dobPasswordCheck: true } },
      },
    });

    // A bulk reset leaves students already on the DOB default alone (a no-op, and it is what lets a
    // repeated call resume). Resetting named students always runs.
    const todo = students.filter((student) => {
      const canonical = canonicalStudentPasswordFromDob(student.dob);
      if (!canonical) return false; // no usable DOB: nothing to reset to
      if (studentIds.length > 0) return true;
      const hash = student.user?.password;
      return !hash || decodeDobPasswordCheck(student.user?.dobPasswordCheck, student.dob, hash) !== canonical;
    });

    const deadline = Date.now() + RESET_BUDGET_MS;
    let resetCount = 0;
    let processed = 0;
    for (let i = 0; i < todo.length && Date.now() < deadline; i += RESET_CHUNK) {
      const chunk = todo.slice(i, i + RESET_CHUNK);
      processed += chunk.length;
      // Hashing is CPU-bound, so it runs one after another; the database writes go in together.
      const hashes: Array<string | null> = [];
      for (const student of chunk) {
        try {
          hashes.push(await hashStudentPasswordFromDob(student.dob));
        } catch {
          hashes.push(null); /* invalid DOB */
        }
      }
      const done = await Promise.all(
        chunk.map(async (student, j) => {
          const hashed = hashes[j];
          if (!hashed) return false;
          await prisma.user.update({
            where: { id: student.userId },
            data: { password: hashed, dobPasswordCheck: dobDefaultPasswordCheck(student.dob, hashed) },
          });
          return true;
        })
      );
      resetCount += done.filter(Boolean).length;
    }
    const remaining = todo.length - processed;

    invalidateStudentListCaches(schoolId);

    return NextResponse.json(
      {
        message:
          remaining > 0
            ? `Reset ${resetCount} student password${resetCount === 1 ? "" : "s"} so far, ${remaining} to go.`
            : `Reset ${resetCount} student password${resetCount === 1 ? "" : "s"} to DOB (YYYYMMDD).`,
        resetCount,
        remaining,
      },
      { status: 200 }
    );
    });
  } catch (error: unknown) {
    logger.error("Student credentials reset error:", error);
    return NextResponse.json(
      { message: toClientErrorMessage(error, "Internal server error") },
      { status: 500 }
    );
  }
}

// Heavy report/export: raise the serverless timeout above the default.
export const maxDuration = 60;
