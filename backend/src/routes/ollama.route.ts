import { Router } from 'express';
import ChatController from '../controllers/ollama.controller';

const router = Router();
const controller = new ChatController();

router.post('/chat-ollama', (req, res) => controller.sendMessage(req, res));

export default router;
