import { Request, Response } from 'express';
import { exec } from 'child_process';
import Chat from '../models/chat.model';  
import { errorResponse, successResponse } from '../middleware/responseModifier.middleware';

export default class ChatController {
  public sendMessage = (req: Request, res: Response): void => {
    const userMessage = req.body.message || '';
    const safeMessage = userMessage.replace(/"/g, '\\"');

    exec(`echo "${safeMessage}" | ollama run llama2`, async (error, stdout, stderr) => {
      if (error) {
        console.error('Ollama exec error:', error);

        await Chat.create({
          chatType: 'ollama',
          userMessage,
          botReply: 'Internal Server Error',
        });

        return errorResponse(res, 'Internal Server Error');
      }

      if (stderr) {
        console.error('Ollama stderr:', stderr);
      }

      const reply = stdout.trim();

      await Chat.create({
        chatType: 'ollama',
        userMessage,
        botReply: reply,
      });

      return successResponse(res, reply);
    });
  };
}
