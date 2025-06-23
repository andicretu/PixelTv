import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // copy your existing local data logic here, e.g.:
  await prisma.video.createMany({
    data: [
      // { id: "vid1", title: "Example", uploadDate: new Date("2025-01-01"), url: "https://…" },
      // add as many as you need, or query your local DB and paste them in
    ],
    skipDuplicates: true,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
