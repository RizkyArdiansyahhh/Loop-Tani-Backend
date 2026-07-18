import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';

@Injectable()
export class ChatbotService {
  private readonly ai: GoogleGenAI;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not defined');
    }
    this.ai = new GoogleGenAI({ apiKey });
  }

  async sendMessage(message: string) {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: message,
      });
      return {
        message: response.text,
      };
    } catch (e) {
      console.error('Gemini API error:', e);

      throw new InternalServerErrorException(
        'Gagal memproses pesan chatbot',
      );
    }
  }
}
