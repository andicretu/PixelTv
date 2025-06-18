import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';

const prisma = new PrismaClient();

// Map WP category ID to internal category labels
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
  return 'Gaming'; // default fallback
}

function extractVimeoId(content: string): string | null {
  const match = content.match(/player\.vimeo\.com\/video\/(\d+)/);
  return match ? match[1] : null;
}

async function run() {
  const raw = await fs.readFile('./posts.json', 'utf-8');
  const posts = JSON.parse(raw);

  for (const post of posts) {
    const vimeoId = extractVimeoId(post.content?.rendered ?? '');
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
    } catch (err: any) {
      if (err.code === 'P2002') {
        console.log(`⚠️ Skipped (duplicate): ${vimeoId}`);
      } else {
        console.error(`❌ Error for ${vimeoId}`, err.message);
      }
    }
  }

  await prisma.$disconnect();
}

run();
