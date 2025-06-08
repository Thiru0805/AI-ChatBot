import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import chatRouter from './src/routes/chat.route';  

dotenv.config();

const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.use('/api', chatRouter);

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on http://localhost:5000`);
});
