import express from 'express';
import cors from 'cors';
import videosRouter from './routes/videos';
import { prisma } from './prisma';

const app = express();

const allowedOrigins = ['https://pixel.tv', 'https://www.pixel.tv'];
app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST'],
}));

app.use(express.json());

// Mount routers
app.use('/api/videos', videosRouter);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

export default app;
