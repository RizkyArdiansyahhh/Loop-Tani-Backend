import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';
import { PrismaService } from '../../infra/database/prisma.service';
import { ChatMessageRole } from '@prisma/client';
import { SendMessageDto } from './dto/send-message.dto';

const SYSTEM_INSTRUCTION = `
Kamu adalah Loopi, asisten virtual resmi dari LoopTani.

Peran & Tujuan:
Membantu pengguna dengan informasi yang ramah, akurat, dan relevan seputar:
- Pertanian & teknik budidaya
- Pupuk, kompos, dan nutrisi tanaman
- Produk pertanian & pengelolaan limbah pertanian
- Fitur dan layanan aplikasi LoopTani

Aturan Respon:
1. Bahasa: Jawab menggunakan bahasa yang sama dengan pengguna (secara default Bahasa Indonesia).
2. Format & Gaya: Gunakan nada ramah, sopan, dan jelas. Manfaatkan format Markdown (poin/bullet list) agar pesan mudah dibaca di aplikasi chat.
3. Batasan Topik: Jika pertanyaan tidak berkaitan dengan pertanian, produk tani, limbah pertanian, atau LoopTani, tolak secara sopan dan arahkan pengguna kembali ke topik pertanian/LoopTani.
`;

@Injectable()
export class ChatbotService {
  private readonly ai: GoogleGenAI;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not defined');
    }
    this.ai = new GoogleGenAI({ apiKey });
  }

  async sendMessage(dto: SendMessageDto, userId?: string) {
    // Case 1: Anonymous User (no userId)
    if (!userId) {
      try {
        const response = await this.ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: dto.message,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
          },
        });
        return {
          conversationId: null,
          message: response.text,
        };
      } catch (e) {
        console.error('Gemini API error:', e);
        throw new InternalServerErrorException('Gagal memproses pesan chatbot');
      }
    }

    // Authenticated User
    if (!dto.conversationId) {
      // Case 2: New Conversation
      let responseText = '';
      try {
        const response = await this.ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: dto.message,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
          },
        });
        responseText = response.text || '';
      } catch (e) {
        console.error('Gemini API error:', e);
        throw new InternalServerErrorException('Gagal memproses pesan chatbot');
      }

      const title = dto.message.slice(0, 60);

      const conversation = await this.prisma.chatConversation.create({
        data: {
          userId,
          title,
          messages: {
            create: [
              {
                role: ChatMessageRole.USER,
                content: dto.message,
              },
              {
                role: ChatMessageRole.MODEL,
                content: responseText,
              },
            ],
          },
        },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
          },
        },
      });

      const userMessage = conversation.messages.find(
        (m) => m.role === ChatMessageRole.USER,
      );
      const assistantMessage = conversation.messages.find(
        (m) => m.role === ChatMessageRole.MODEL,
      );

      return {
        conversationId: conversation.id,
        userMessage: {
          id: userMessage?.id,
          role: 'user',
          content: userMessage?.content,
        },
        assistantMessage: {
          id: assistantMessage?.id,
          role: 'model',
          content: assistantMessage?.content,
        },
      };
    }

    // Case 3: Existing Conversation
    const conversation = await this.prisma.chatConversation.findFirst({
      where: {
        id: dto.conversationId,
        userId,
      },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!conversation) {
      throw new NotFoundException('Percakapan tidak ditemukan');
    }

    const userMessageCount = conversation.messages.filter(
      (m) => m.role === ChatMessageRole.USER,
    ).length;

    if (userMessageCount >= 20) {
      throw new BadRequestException(
        'Percakapan telah mencapai batas maksimum 20 pesan. Silakan mulai percakapan baru.',
      );
    }

    // Format existing messages to Gemini API format
    const contents = conversation.messages.map((msg) => ({
      role: msg.role === ChatMessageRole.USER ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    // Append current user message
    contents.push({
      role: 'user',
      parts: [{ text: dto.message }],
    });

    let responseText = '';
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        },
      });
      responseText = response.text || '';
    } catch (e) {
      console.error('Gemini API error:', e);
      throw new InternalServerErrorException('Gagal memproses pesan chatbot');
    }

    const [savedUserMsg, savedModelMsg] = await this.prisma.$transaction([
      this.prisma.chatMessage.create({
        data: {
          conversationId: conversation.id,
          role: ChatMessageRole.USER,
          content: dto.message,
        },
      }),
      this.prisma.chatMessage.create({
        data: {
          conversationId: conversation.id,
          role: ChatMessageRole.MODEL,
          content: responseText,
        },
      }),
      this.prisma.chatConversation.update({
        where: { id: conversation.id },
        data: { updatedAt: new Date() },
      }),
    ]);

    return {
      conversationId: conversation.id,
      userMessage: {
        id: savedUserMsg.id,
        role: 'user',
        content: savedUserMsg.content,
      },
      assistantMessage: {
        id: savedModelMsg.id,
        role: 'model',
        content: savedModelMsg.content,
      },
    };
  }

  async getConversations(userId: string) {
    const conversations = await this.prisma.chatConversation.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    return conversations.map((c) => ({
      id: c.id,
      title: c.title,
      updatedAt: c.updatedAt,
      lastMessage: c.messages[0]?.content || '',
    }));
  }

  async getConversationDetail(userId: string, conversationId: string) {
    const conversation = await this.prisma.chatConversation.findFirst({
      where: {
        id: conversationId,
        userId,
      },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!conversation) {
      throw new NotFoundException('Percakapan tidak ditemukan');
    }

    return {
      id: conversation.id,
      title: conversation.title,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
      messages: conversation.messages.map((m) => ({
        id: m.id,
        role: m.role === ChatMessageRole.USER ? 'user' : 'model',
        content: m.content,
        createdAt: m.createdAt,
      })),
    };
  }

  async deleteConversation(userId: string, conversationId: string) {
    const conversation = await this.prisma.chatConversation.findFirst({
      where: {
        id: conversationId,
        userId,
      },
    });

    if (!conversation) {
      throw new NotFoundException('Percakapan tidak ditemukan');
    }

    await this.prisma.chatConversation.delete({
      where: { id: conversationId },
    });

    return {
      success: true,
      message: 'Percakapan berhasil dihapus',
    };
  }
}
