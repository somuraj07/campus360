/**
 * Create one SUPERADMIN login. Never overwrites or modifies an existing user:
 * if any user already has this email it exits without writing anything.
 *
 *   npx tsx scripts/create-superadmin.ts --email=you@example.com [--name="Platform Admin"]
 *
 * Password: set SUPERADMIN_PASSWORD in the environment to choose one (min 12 chars);
 * otherwise a random one is generated and printed once. Change it after first login.
 */
import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import prisma from "../lib/db";

function arg(name: string): string | undefined {
  return process.argv.find((a) => a.startsWith(`--${name}=`))?.slice(name.length + 3);
}

async function main() {
  const email = arg("email")?.trim();
  const name = arg("name")?.trim() || "Super Admin";
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Pass a valid --email=... (e.g. --email=admin@example.com)');
  }

  const chosen = process.env.SUPERADMIN_PASSWORD;
  if (chosen !== undefined && chosen.length < 12) {
    throw new Error("SUPERADMIN_PASSWORD must be at least 12 characters");
  }
  const password = chosen ?? randomBytes(12).toString("base64url");

  // Login looks users up by exact email and rejects duplicates, so refuse any existing match.
  const existing = await prisma.user.findFirst({ where: { email }, select: { id: true, role: true } });
  if (existing) {
    throw new Error(`A user with this email already exists (role ${existing.role}); nothing was changed.`);
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: await bcrypt.hash(password, 10),
      role: "SUPERADMIN",
      schoolId: null,
    },
    select: { id: true, email: true, role: true },
  });

  console.log(`Created ${user.role} ${user.email} (id ${user.id})`);
  if (chosen === undefined) {
    console.log(`Generated password (shown once, store it now): ${password}`);
  }
}

main()
  .catch((err) => {
    console.error(err instanceof Error ? err.message : err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
