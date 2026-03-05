import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment");
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  const admin = await db.user.upsert({
    where: { email: adminEmail },
    update: {
      hashedPassword,
      role: "admin",
      tier: "pro",
      status: "active",
      emailVerified: new Date(),
      mustChangePassword: false,
    },
    create: {
      email: adminEmail,
      name: "Admin",
      hashedPassword,
      role: "admin",
      tier: "pro",
      status: "active",
      emailVerified: new Date(),
      mustChangePassword: false,
    },
  });

  console.log("Admin account fixed:", admin.email, "role:", admin.role, "status:", admin.status, "emailVerified:", admin.emailVerified);
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
