import { Request, Response } from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import Chat from '../models/chat.model';
import { errorResponse, successResponse } from '../middleware/responseModifier.middleware';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default class OpenAIController {
  public sendMessage = async (req: Request, res: Response): Promise<void> => {
    const userMessage = req.body.message || '';

    if (!userMessage.trim()) {
      return errorResponse(res, 'Message is required');
    }

    try {
      const response = await openai.responses.create({
        model: 'gpt-4.1',
        input: userMessage,
      });

      const reply = response.output_text || 'No response from OpenAI';

      await Chat.create({
        chatType: 'openai',
        userMessage,
        botReply: reply,
      });

      return successResponse(res, reply);
    } catch (error: any) {
      const errData = error.error;
      let errorMsg = 'Internal Server Error';
      let statusCode = 500;

      if (
        errData &&
        (errData?.code === 'insufficient_quota' || errData?.message?.toLowerCase().includes('quota'))
      ) {
        errorMsg = 'OpenAI API quota exceeded. Please try again later.';
        statusCode = 429;
      }

      await Chat.create({
        chatType: 'openai',
        userMessage,
        botReply: errorMsg,
      });

      console.error('OpenAI API error:', errData || error.message);
      return errorResponse(res, errorMsg, statusCode);
    }
  };
}
