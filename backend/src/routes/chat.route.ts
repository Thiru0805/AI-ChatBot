import { Router } from 'express';
import ChatController from '../controllers/chat.controller';

const router = Router();
const controller = new ChatController();

router.post('/chat', (req, res) => controller.sendMessage(req, res));

export default router;
