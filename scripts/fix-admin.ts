import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("floofs!!QQ1209", 12);

  const admin = await db.user.upsert({
    where: { email: "admin@iwanttobeapilot.online" },
    update: {
      hashedPassword,
      role: "admin",
      tier: "pro",
      status: "active",
      emailVerified: new Date(),
      mustChangePassword: false,
    },
    create: {
      email: "admin@iwanttobeapilot.online",
      name: "Admin",
      hashedPassword,
      role: "admin",
      tier: "pro",
      status: "active",
      emailVerified: new Date(),
      mustChangePassword: false,
    },
  });

  console.log("Admin account fixed:", admin.email, "status:", admin.status, "emailVerified:", admin.emailVerified);
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
