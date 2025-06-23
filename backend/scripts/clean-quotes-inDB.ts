import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function cleanText(text: string): string {
  return text
    .replace(/&#8217;/g, '’') // right apostrophe
    .replace(/&#8216;/g, '‘') // left apostrophe
    .replace(/&#8220;/g, '"') // left double quote
    .replace(/&#8221;/g, '"') // right double quote
    .replace(/&quot;/g, '"')  // general quote
    .replace(/""/g, '"')      // double quote fix
    .replace(/“|”/g, '"')     // fancy quotes
    .replace(/‘|’/g, "'")     // fancy apostrophes
    .trim();
}

async function fixQuotes() {
  const videos = await prisma.video.findMany();

  let updated = 0;

  for (const video of videos) {
    const cleanedTitle = cleanText(video.title);
    const cleanedDesc = cleanText(video.description);

    if (cleanedTitle !== video.title || cleanedDesc !== video.description) {
      await prisma.video.update({
        where: { id: video.id },
        data: {
          title: cleanedTitle,
          description: cleanedDesc,
        },
      });
      console.log(`✅ Updated ${video.vimeoId}`);
      updated++;
    }
  }

  console.log(`🔧 Done. Updated ${updated} entries.`);
  await prisma.$disconnect();
}

fixQuotes().catch(console.error);
