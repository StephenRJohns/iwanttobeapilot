import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail) throw new Error("ADMIN_EMAIL must be set in environment");

  const user = await db.user.findUnique({
    where: { email: adminEmail },
    select: {
      id: true,
      email: true,
      status: true,
      emailVerified: true,
      hashedPassword: true,
      role: true,
      tier: true,
    },
  });

  if (!user) {
    console.log("USER NOT FOUND");
    return;
  }

  console.log("User found:");
  console.log("  status:", user.status);
  console.log("  emailVerified:", user.emailVerified);
  console.log("  role:", user.role);
  console.log("  hashedPassword present:", !!user.hashedPassword);

  if (user.hashedPassword && adminPassword) {
    const valid = await bcrypt.compare(adminPassword, user.hashedPassword);
    console.log("  password match:", valid);
  }
}

main().catch(console.error).finally(() => db.$disconnect());
