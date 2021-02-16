import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { email: "admin@symon.org" },
    update: {},
    create: {
      email: "admin@symon.org",
      password_hash:
        "$2b$10$mWyxxy0l3SAKl08g6K0W9u0gBzrEDQ757Fgn/gY727t.BYYIvCAhK", //hashed password from: right password
      enabled: 1,
      suspended: 0,
    },
  });
}
main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
