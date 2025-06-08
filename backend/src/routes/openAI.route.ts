import { Router } from 'express';
import OpenAIController from '../controllers/openAI.controller';

const router = Router();
const controller = new OpenAIController();

router.post('/chat-openai', (req, res) => controller.sendMessage(req, res));

export default router;
