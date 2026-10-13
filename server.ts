import express, { Request, Response } from 'express';
import http from 'http';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { handlePlatformScores, handleReviewPoll, handleSnapshot } from './api/_lib/handlers.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Same handlers as the Vercel functions in /api.
app.post('/api/hotel-snapshot', async (req: Request, res: Response) => {
  const result = await handleSnapshot(req.body?.query);
  res.status(result.status).json(result.body);
});

app.get('/api/hotel-reviews', async (req: Request, res: Response) => {
  const result = await handleReviewPoll(req.query.jobId, req.query.placeId);
  res.status(result.status).json(result.body);
});

app.get('/api/platform-scores', async (req: Request, res: Response) => {
  const result = await handlePlatformScores(req.query.placeId);
  res.status(result.status).json(result.body);
});

// Vite middleware for dev / static for prod
const isProduction = process.env.NODE_ENV === 'production';

async function startServer() {
  const httpServer = http.createServer(app);

  if (!isProduction) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: {
          server: httpServer,
        },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  httpServer.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server running on port ${PORT} (dev mode: ${!isProduction})`);
  });
}

startServer();
