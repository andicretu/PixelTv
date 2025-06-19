import { PrismaClient } from '@prisma/client';
import { promises as fs } from 'fs';

const prisma = new PrismaClient();

// Same helper functions as before
const categoryMap: Record<string, number[]> = {
  'Gaming': [2038, 7, 1267, 800, 284],
  'Film og Serier': [801, 908, 285, 6],
  'Tech og Gadgets': [3261, 2397, 9, 3239, 2396],
  'Programmer': [8],
  'Nordisk Videos': [3883],
};

function getCategory(categoryId: number): string {
  for (const [label, ids] of Object.entries(categoryMap)) {
    if (ids.includes(categoryId)) return label;
  }
  return 'Gaming';
}

function extractVimeoId(content: string): string | null {
  const match = content.match(/player\.vimeo\.com\/video\/(\d+)/);
  return match ? match[1] : null;
}

async function run() {
  const postTypesToScan = ['posts', 'anmeldelser', 'underholdning'];
  let totalChecked = 0;
  let totalInserted = 0;

  for (const type of postTypesToScan) {
    let page = 1;

    while (true) {
      const url = `https://pixel.tv/wp-json/wp/v2/${type}?per_page=100&page=${page}&_embed`;
      const res = await fetch(url);

      if (!res.ok) {
        console.log(`🛑 Done with ${type} at page ${page}. Status: ${res.status}`);
        break;
      }

      const posts = await res.json();
      if (posts.length === 0) break;

      for (const post of posts) {
        totalChecked++;

        // Skip non-Vimeo content
        if (!post.content?.rendered.includes('vimeo.com/video')) continue;

        const vimeoId = extractVimeoId(post.content.rendered);
        if (!vimeoId) continue;

        try {
          await prisma.video.create({
            data: {
              vimeoId,
              title: post.title?.rendered?.replace(/&#8217;/g, '’').replace(/&#8216;/g, '‘') ?? 'Untitled',
              thumbnailUrl: post._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? 'https://via.placeholder.com/300',
              uploadDate: new Date(post.date),
              ageRecommendation: 'All Ages',
              description: post.excerpt?.rendered?.replace(/(<([^>]+)>)/gi, '') ?? '',
              category: getCategory(post.categories?.[0] ?? 0),
            },
          });

          console.log(`✅ Inserted: ${vimeoId}`);
          totalInserted++;
        } catch (err: any) {
          if (err.code === 'P2002') {
            console.log(`⚠️ Skipped (duplicate): ${vimeoId}`);
          } else {
            console.error(`❌ Error for ${vimeoId}:`, err.message);
          }
        }
      }

      page++;
    }
  }

  console.log(`📦 Done. Checked ${totalChecked} posts.`);
  console.log(`✅ Inserted ${totalInserted} new videos.`);
  console.log(`⚠️ Skipped ${totalChecked - totalInserted} duplicates or invalid entries.`);

  await prisma.$disconnect();
}

run();
