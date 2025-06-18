import express from 'express';
import { prisma } from '../prisma';

const router = express.Router();

router.get('/', async (req, res) => {
  const videos = await prisma.video.findMany();
  res.json(videos);
});

router.get('/latest', async (req, res) => {
  const videos = await prisma.video.findMany({
    orderBy: { uploadDate: 'desc' },
  });
  res.json(videos);
});

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
        ageRecommendation: 'All Ages', // hardcoded for now
      },
    });
    res.status(201).json(video);
  } catch (err) {
    console.error('POST /api/videos error:', err);
    res.status(500).json({ error: 'Insert failed' });
  }
});



export default router;
