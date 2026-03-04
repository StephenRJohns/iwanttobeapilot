import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  const before = await db.dPERecord.count();
  console.log(`DPE records before: ${before}`);

  const deleted = await db.dPERecord.deleteMany({
    where: { designeeNumber: { startsWith: "DPE-" } },
  });

  const after = await db.dPERecord.count();
  console.log(`Deleted: ${deleted.count}`);
  console.log(`DPE records after: ${after}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
