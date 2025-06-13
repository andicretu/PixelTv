import express from 'express';
import dotenv from 'dotenv';
import {prisma} from './prisma';

// Load .env variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// A health-check route
app.get('/health', (req, res) => {
  res.status(200).json({status: 'ok'});
});

// Get latest 3 videos
app.get('/videos', async (req, res) => {
  try {
    const videos = await prisma.video.findMany({
      orderBy: { uploadDate: 'desc' },
      take: 3,
    });
    res.json(videos);
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Get all users
app.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'Internal server error'});
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
