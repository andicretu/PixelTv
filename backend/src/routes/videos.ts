import express from 'express';
import { prisma } from '../prisma';


const router = express.Router();

//GET videos (no order)
router.get('/', async (req, res) => {
  const videos = await prisma.video.findMany();
  res.json(videos);
});

//GET videos in chronological order
router.get('/latest', async (req, res) => {
  const videos = await prisma.video.findMany({
    orderBy: { uploadDate: 'desc' },
  });
  res.json(videos);
});

//POST videos ID in the database
router.post('/', async (req, res) => {
  try {
    const video = await prisma.video.create({
      data: {
        vimeoId: req.body.vimeoId,
        title: req.body.title,
        description: req.body.description,
        uploadDate: new Date(req.body.uploadDate),
        thumbnailUrl: req.body.thumbnailUrl,
        category: req.body.category,
        ageRecommendation: 'All Ages', // optional
      },
    });
    res.status(201).json(video);
  } catch (err) {
    console.error('POST /api/videos failed:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /api/videos/:id/view - add views per video
router.post('/:id/view', async (req, res, next) => {

  console.log(`[VIEW ENDPOINT] hit for video ${req.params.id}`);
  
  const videoId = Number(req.params.id);
  try {
    const updated = await prisma.video.update({
      where: { id: videoId },
      data: { views: { increment: 1 } },
    });
    res.json({ id: updated.id, views: updated.views });
  } catch (err) {
    next(err);
  }
});

export default router;
