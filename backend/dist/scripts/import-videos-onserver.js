"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const WP_API_URL = 'https://pixel.tv/wp-json/wp/v2/posts?_embed&per_page=100';
const FLY_API_URL = 'https://pixeltv-api.fly.dev/api/videos';
console.log('[cron] import-videos-onserver.ts started at', new Date().toISOString());
// Category mapping from WP category IDs to labels
const categoryMap = {
    'Gaming': [2038, 7, 1267, 800, 284],
    'Film og Serier': [801, 908, 285, 6],
    'Tech og Gadgets': [3261, 2397, 9, 3239, 2396],
    'Programmer': [8],
    'Danish Games': [3883],
};
function mapCategory(id) {
    for (const [label, ids] of Object.entries(categoryMap)) {
        if (ids.includes(id))
            return label;
    }
    return 'Gaming';
}
async function syncVideosToFly() {
    const postTypesToScan = ['posts', 'anmeldelser', 'underholdning'];
    for (const type of postTypesToScan) {
        let page = 1;
        while (true) {
            const url = `https://pixel.tv/wp-json/wp/v2/${type}?_embed&per_page=100&page=${page}`;
            let response;
            try {
                response = await axios_1.default.get(url);
            }
            catch (err) {
                if (err.response?.status === 400 &&
                    err.response?.data?.code === 'rest_post_invalid_page_number') {
                    console.log(`🛑 No more pages for ${type} at page ${page}.`);
                    break;
                }
                else {
                    console.error(`❌ Failed to fetch ${type} page ${page}:`, err.message);
                    break; // you could also `continue` here if you want to skip errors and keep going
                }
            }
            const posts = response.data;
            if (!posts || posts.length === 0)
                break;
            for (const post of posts) {
                const content = post.content?.rendered || '';
                const match = content.match(/player\.vimeo\.com\/video\/(\d+)/);
                if (!match)
                    continue;
                const vimeoId = match[1];
                const title = post.title?.rendered || '';
                const description = post.excerpt?.rendered || '';
                const uploadDate = post.date;
                const thumbnailUrl = post._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
                    'https://via.placeholder.com/300';
                const wpCategories = post.categories;
                const categoryId = wpCategories?.[0] || 0;
                const category = mapCategory(categoryId);
                const payload = {
                    vimeoId,
                    title: stripTags(title),
                    description: stripTags(description),
                    uploadDate,
                    thumbnailUrl,
                    category,
                };
                try {
                    const res = await axios_1.default.post(FLY_API_URL, payload, {
                        headers: { 'Content-Type': 'application/json' },
                    });
                    console.log(`✅ Synced ${vimeoId} (${title})`);
                }
                catch (err) {
                    if (err.response?.status === 409) {
                        console.log(`⚠️ Already exists: ${vimeoId}`);
                    }
                    else {
                        console.error(`❌ Failed to sync ${vimeoId}:`, err.message);
                    }
                }
            }
            page++;
        }
    }
}
function stripTags(html) {
    return html.replace(/<\/?[^>]+(>|$)/g, '').trim();
}
syncVideosToFly().catch(console.error);
