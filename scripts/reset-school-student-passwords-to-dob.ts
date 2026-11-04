/**
 * Reset every active student's login password in ONE school to their date of birth (YYYYMMDD, the DOB as
 * the app shows it). Same effect as "Reset to DOB" on the Student credentials page, without the 60 s
 * request limit. It replaces passwords students chose themselves, so the old hashes are written to a
 * backup file first (restore with --restore=<file>). Students already on the default are skipped.
 *
 *   npx tsx scripts/reset-school-student-passwords-to-dob.ts                         list schools
 *   npx tsx scripts/reset-school-student-passwords-to-dob.ts --school-id=<id>        dry run
 *   npx tsx scripts/reset-school-student-passwords-to-dob.ts --school-id=<id> --apply --backup=<file>
 *   npx tsx scripts/reset-school-student-passwords-to-dob.ts --restore=<file>
 *
 * Keep the backup file out of the repo: it holds password hashes.
 */
import { existsSync, readFileSync, writeFileSync } from "fs";
import prisma from "../lib/db";
import {
  canonicalStudentPasswordFromDob,
  decodeDobPasswordCheck,
  dobDefaultPasswordCheck,
  hashStudentPasswordFromDob,
} from "@/lib/students/studentDefaultPassword";

const arg = (name: string) => process.argv.find((a) => a.startsWith(`--${name}=`))?.slice(name.length + 3);
const CHUNK = 20;

async function listSchools() {
  const schools = await prisma.school.findMany({ select: { id: true, name: true }, orderBy: { createdAt: "asc" } });
  for (const s of schools) {
    const active = await prisma.student.count({ where: { schoolId: s.id, status: "Active" } });
    if (active > 0) console.log(`${s.id}\t${s.name}\t${active} active students`);
  }
}

async function restore(file: string) {
  const rows = JSON.parse(readFileSync(file, "utf8")) as Array<{ userId: string; password: string; dobPasswordCheck: string | null }>;
  for (let i = 0; i < rows.length; i += CHUNK) {
    await Promise.all(
      rows.slice(i, i + CHUNK).map((r) =>
        prisma.user.update({ where: { id: r.userId }, data: { password: r.password, dobPasswordCheck: r.dobPasswordCheck } })
      )
    );
  }
  console.log(`Restored ${rows.length} passwords from ${file}.`);
}

async function main() {
  const restoreFile = arg("restore");
  if (restoreFile) return restore(restoreFile);

  const schoolId = arg("school-id");
  if (!schoolId) return listSchools();
  const apply = process.argv.includes("--apply");
  const backup = arg("backup");
  if (apply && (!backup || existsSync(backup))) {
    throw new Error("--apply needs --backup=<new file path> (an existing file is never overwritten)");
  }

  const school = await prisma.school.findUnique({ where: { id: schoolId }, select: { name: true } });
  if (!school) throw new Error("School not found");

  const students = await prisma.student.findMany({
    where: { schoolId, status: "Active" },
    select: {
      admissionNumber: true,
      dob: true,
      user: { select: { id: true, password: true, dobPasswordCheck: true } },
    },
  });

  const todo = students.filter((s) => {
    if (!s.user?.password || !canonicalStudentPasswordFromDob(s.dob)) return false; // no login, or no usable DOB
    const saved = decodeDobPasswordCheck(s.user.dobPasswordCheck, s.dob, s.user.password);
    return saved !== canonicalStudentPasswordFromDob(s.dob);
  });
  console.log(
    `${school.name}: ${students.length} active, ${todo.length} to reset, ${students.length - todo.length} already on the DOB default or without a login/DOB.`
  );
  if (!apply) return console.log("Dry run: nothing changed.");

  writeFileSync(
    backup!,
    JSON.stringify(todo.map((s) => ({ userId: s.user!.id, password: s.user!.password, dobPasswordCheck: s.user!.dobPasswordCheck })))
  );
  console.log(`Backed up ${todo.length} old password hashes to ${backup}`);

  let done = 0;
  for (let i = 0; i < todo.length; i += CHUNK) {
    const chunk = todo.slice(i, i + CHUNK);
    const hashed: string[] = [];
    for (const s of chunk) hashed.push(await hashStudentPasswordFromDob(s.dob));
    await Promise.all(
      chunk.map((s, j) =>
        prisma.user.update({
          where: { id: s.user!.id },
          data: { password: hashed[j], dobPasswordCheck: dobDefaultPasswordCheck(s.dob, hashed[j]) },
        })
      )
    );
    done += chunk.length;
    console.log(`  ${done}/${todo.length}`);
  }
  console.log(`Reset ${done} passwords to the DOB shown in the app.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
