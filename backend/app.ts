import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectToMongo } from './src/database/mongo';
import ollamaRouter from './src/routes/ollama.route';
import openaiRouter from './src/routes/openAI.route';

dotenv.config();

const app = express();

const startServer = async () => {
  await connectToMongo();

  app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
  app.use(express.json());

  app.use('/api', ollamaRouter);
  app.use('/api', openaiRouter);

  app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
  });

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();
