import { Request, Response } from 'express';
import OpenAI from 'openai';
import axios from 'axios';
import { errorResponse, successResponse } from '../middleware/responseModifier.middleware';
import dotenv from 'dotenv';

dotenv.config();

const HUGGINGFACE_API_URL = process.env.HUGGINGFACE_API_URL || '';
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY || ''; 

export class ChatController {
  private openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

  private async callHuggingFaceAPI(prompt: string): Promise<string> {
    try {
      const response = await axios.post(
        HUGGINGFACE_API_URL,
        { inputs: prompt },
        {
          headers: {
            Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Huggingface returns an array with generated text
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data[0].generated_text || "Sorry, I couldn't generate a response.";
      }
      return "Sorry, I couldn't generate a response.";
    } catch (error) {
      console.error('Huggingface API error:', error);
      return "Sorry, I couldn't generate a response.";
    }
  }

  public sendMessage = async (req: Request, res: Response): Promise<void> => {
    const { message } = req.body;
    if (!message) {
      return errorResponse(res, 'Message is required', 400);
    }

    try {
      // Try OpenAI first
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: message },
        ],
        max_tokens: 150,
        temperature: 0.7,
      });

      const reply = completion.choices[0].message?.content;
      return successResponse(res, { reply });
    } catch (err: any) {
      console.error('OpenAI Error:', err);

      // On quota error, fallback to Huggingface
      if (err.code === 'insufficient_quota' || err.status === 429) {
        const fallbackReply = await this.callHuggingFaceAPI(message);
        return successResponse(res, { reply: fallbackReply });
      }

      return errorResponse(res, 'Server error. Please try again later.', 500);
    }
  };
}

export default ChatController;
