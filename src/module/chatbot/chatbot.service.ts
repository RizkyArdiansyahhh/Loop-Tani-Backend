import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI, Type } from '@google/genai';
import { PrismaService } from '../../infra/database/prisma.service';
import { ChatMessageRole } from '@prisma/client';
import { SendMessageDto } from './dto/send-message.dto';

const SYSTEM_INSTRUCTION = `
Kamu adalah Loopi, asisten virtual pintar dan ramah resmi dari LoopTani (Marketplace Sirkular Pertanian Indonesia).

Peran & Tujuan:
Membantu pengguna dengan informasi yang akurat, berorientasi solusi, dan relevan seputar:
- Pengolahan limbah pertanian (jerami, sawit, sekam) berbasis standar SNI.
- Dosis pemupukan dan nutrisi tanaman secara teknis & praktis.
- Rekomendasi produk limbah, olahan, pupuk, atau peralatan tani di marketplace LoopTani.
- Cara transaksi dan rujukan fitur aplikasi LoopTani.

Aturan Respon & Format:
1. Bahasa: Gunakan Bahasa Indonesia yang ramah, sopan, dan profesional.
2. Format Markdown: Manfaatkan format Markdown (tebal, bullet list, quote, emoji) agar balasan terlihat cantik dan mudah dibaca di UI chat.
3. Link Rekomendasi Produk: Ketika memanggil fungsi searchMarketplace dan menemukan produk, selalu buatkan link markdown produk dengan rute relatif /[locale]/marketplace/[id] (contoh: [🛒 Pupuk Kompos Organik 5kg](/id/marketplace/prod_123)). Tampilkan harga, lokasi penjual, dan nama toko dengan rapi.
4. Tombol Aksi Fitur LoopTani: Ketika merekomendasikan atau menjelaskan fitur aplikasi LoopTani, SELALU sertakan tombol aksi link markdown rute relatif agar pengguna bisa langsung klik & pindah halaman:
   - Limbah Analyzer: [♻️ Buka Fitur Limbah Analyzer](/id/limbah-analyzer)
   - Kalkulator Dosis Pupuk: [🌱 Buka Kalkulator Dosis Pupuk](/id/fertilizer-calculator)
   - Panduan & Artikel Tani: [📖 Baca Panduan Tani](/id/panduan-tani)
   - Jejak Lestari (Jejak Karbon): [🌍 Cek Jejak Lestari](/id/jejak-lestari)
   - Marketplace: [🛒 Jelajahi Marketplace](/id/marketplace)
5. Batasan Topik: Jika pertanyaan di luar domain pertanian, limbah, pupuk, atau LoopTani, tolak secara sopan.
`;

const CHAT_TOOLS: any[] = [
  {
    functionDeclarations: [
      {
        name: 'calculateFertilizer',
        description: 'Menghitung estimasi dosis pupuk (Urea, NPK, Organik) dan jadwal pemupukan berdasarkan luas lahan dan jenis tanaman.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            landArea: { type: Type.NUMBER, description: 'Luas lahan dalam hektar atau m2 (default 1)' },
            cropType: { type: Type.STRING, description: 'Jenis tanaman (misal: padi, sawit, jagung, cabai)' },
          },
          required: ['cropType'],
        },
      },
      {
        name: 'analyzeWaste',
        description: 'Menganalisis potensi pengolahan limbah pertanian (jerami, sawit, sekam) berdasarkan standar SNI dan estimasi nilai ekonomi.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            wasteType: { type: Type.STRING, description: 'Jenis limbah pertanian (misal: jerami padi, kelapa sawit, sekam)' },
          },
          required: ['wasteType'],
        },
      },
      {
        name: 'searchMarketplace',
        description: 'Mencari produk limbah pertanian, pupuk organik, atau pembeli/penjual di marketplace LoopTani berdasarkan kata kunci dan lokasi.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            keyword: { type: Type.STRING, description: 'Kata kunci pencarian produk atau limbah (misal: sawit, jerami, pupuk, kompos, mesin)' },
            location: { type: Type.STRING, description: 'Lokasi kota atau daerah pengguna (opsional)' },
          },
          required: ['keyword'],
        },
      },
    ],
  },
];

@Injectable()
export class ChatbotService {
  private readonly ai: GoogleGenAI;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY_CB');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not defined');
    }
    this.ai = new GoogleGenAI({ apiKey });
  }

  private async executeTool(functionCall: { name?: string; args?: any }) {
    const name = functionCall?.name;
    const args = functionCall?.args || {};

    if (name === 'calculateFertilizer') {
      const area = args.landArea || 1;
      const crop = (args.cropType || 'padi').toLowerCase();

      let urea = 200 * area;
      let npk = 150 * area;
      let organik = 1000 * area;

      if (crop.includes('sawit')) {
        urea = 300 * area;
        npk = 250 * area;
        organik = 2000 * area;
      } else if (crop.includes('jagung')) {
        urea = 250 * area;
        npk = 200 * area;
        organik = 1500 * area;
      }

      return {
        success: true,
        cropType: args.cropType,
        landArea: `${area} Hektar`,
        recommendation: {
          urea: `${urea} kg`,
          npk: `${npk} kg`,
          pupukOrganik: `${organik} kg (Kompos/Kasgot)`,
        },
        applicationSchedule: [
          'Pemupukan Dasar (H-7 sebelum tanam): 100% Pupuk Organik + 50% NPK',
          'Pemupukan Susulan I (15-21 HST): 50% Urea',
          'Pemupukan Susulan II (35-40 HST): 50% Urea + 50% NPK',
        ],
        tips: 'Lakukan pengujian pH tanah secara berkala (pH ideal 6.0 - 7.0). Tambahkan kapur pertanian (Dolomit) jika tanah terlalu asam.',
      };
    }

    if (name === 'analyzeWaste') {
      const waste = (args.wasteType || 'jerami').toLowerCase();

      if (waste.includes('sawit')) {
        return {
          success: true,
          wasteType: args.wasteType,
          options: [
            {
              title: '1. Tandan Kosong Sawit (TKS) -> Kompos Organik (SNI 19-7030-2004)',
              description: 'TKS dicacah dan dikomposkan dengan bio-aktivator. Sangat kaya akan hara Kalium (K) alami.',
              economicValue: 'Nilai jual kompos: Rp 1.200 - Rp 2.500 / kg',
            },
            {
              title: '2. Cangkang & Serabut Sawit -> Bahan Bakar Biomassa / Briket',
              description: 'Dipakai sebagai sumber energi hijau ramah lingkungan pengganti batubara pabrik.',
              economicValue: 'Harga pasar: Rp 800 - Rp 1.500 / kg',
            },
            {
              title: '3. Pelepah & Daun Sawit -> Pakan Ternak Fermentasi',
              description: 'Diprofilisasi dan difermentasi untuk pakan sapi/kambing.',
              economicValue: 'Hemat biaya pakan ternak hingga 40%',
            },
          ],
        };
      }

      return {
        success: true,
        wasteType: args.wasteType,
        options: [
          {
            title: '1. Pupuk Kompos Organik (SNI 19-7030-2004)',
            description: 'Jerami dicacah dan dikomposkan menggunakan aktivator mikroba (EM4/Mol). Menghasilkan kompos berkualitas tinggi dengan C/N ratio ideal 15-25.',
            economicValue: 'Nilai jual kompos: Rp 1.500 - Rp 3.000 / kg',
          },
          {
            title: '2. Pakan Ternak Fermentasi (Silase)',
            description: 'Jerami difermentasi dengan dedak & tetes tebu. Meningkatkan protein kasar jerami dari 4% menjadi 8-9%.',
            economicValue: 'Nilai jual silase: Rp 1.000 - Rp 2.000 / kg',
          },
          {
            title: '3. Bio-Char & Briket Bioarang',
            description: 'Jerami diarangkan untuk membenahi struktur tanah yang krisis bahan organik.',
            economicValue: 'Nilai jual biochar: Rp 4.000 - Rp 7.000 / kg',
          },
          {
            title: '4. Media Tanam Jamur Merang',
            description: 'Jerami dimanfaatkan sebagai media utama budidaya jamur konsumsi.',
            economicValue: 'Hasil panen jamur: Rp 25.000 - Rp 35.000 / kg',
          },
        ],
      };
    }

    if (name === 'searchMarketplace') {
      const keyword = (args.keyword || '').trim();

      const products = await this.prisma.product.findMany({
        where: {
          OR: [
            { title: { contains: keyword, mode: 'insensitive' } },
            { description: { contains: keyword, mode: 'insensitive' } },
          ],
        },
        take: 4,
        select: {
          id: true,
          title: true,
          price: true,
          images: true,
          city: true,
          province: true,
          seller: {
            select: {
              name: true,
            },
          },
        },
      });

      return {
        success: true,
        keyword,
        foundCount: products.length,
        products: products.map((p) => ({
          id: p.id,
          title: p.title,
          price: `Rp ${Number(p.price).toLocaleString('id-ID')}`,
          sellerStore: p.seller?.name || 'Penjual LoopTani',
          sellerCity: p.city || p.province || 'Indonesia',
          url: `/id/marketplace/${p.id}`,
        })),
      };
    }

    return { success: false, message: 'Tool tidak ditemukan' };
  }

  private async generateWithTools(contents: any[]) {
    // Ensure contents are properly formatted Content objects
    const formattedContents = contents.map((item) => {
      if (typeof item === 'string') {
        return { role: 'user', parts: [{ text: item }] };
      }
      return item;
    });

    const modelName = 'gemini-3.5-flash';

    try {
      const response = await this.ai.models.generateContent({
        model: modelName,
        contents: formattedContents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          tools: CHAT_TOOLS,
        },
      });

      // Check if Gemini requested function calls
      if (response.functionCalls && response.functionCalls.length > 0) {
        const functionCall = response.functionCalls[0];
        const toolResult = await this.executeTool(functionCall);

        const modelTurnContent = response.candidates?.[0]?.content || {
          role: 'model',
          parts: [{ functionCall }],
        };

        // Turn 2: Pass function response back to Gemini to generate natural response
        const secondResponse = await this.ai.models.generateContent({
          model: modelName,
          contents: [
            ...formattedContents,
            modelTurnContent,
            {
              role: 'user',
              parts: [
                {
                  functionResponse: {
                    name: functionCall.name || 'tool',
                    response: toolResult,
                  },
                },
              ],
            },
          ],
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            tools: CHAT_TOOLS,
          },
        });

        return secondResponse.text || '';
      }

      return response.text || '';
    } catch (e) {
      console.error('Gemini API error with tools:', e);
      // Fallback without tools if error occurs
      try {
        const fallback = await this.ai.models.generateContent({
          model: modelName,
          contents: formattedContents,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
          },
        });
        return fallback.text || 'Maaf, Loopi sedang mengalami kendala jaringan.';
      } catch (err) {
        console.error('Gemini fallback error:', err);
        return 'Maaf, Loopi sedang tidak dapat memproses permintaan Anda saat ini.';
      }
    }
  }

  async sendMessage(dto: SendMessageDto, userId?: string) {
    // Case 1: Anonymous User (no userId)
    if (!userId) {
      const responseText = await this.generateWithTools([dto.message]);
      return {
        conversationId: null,
        message: responseText,
      };
    }

    // Authenticated User
    if (!dto.conversationId) {
      // Case 2: New Conversation
      const responseText = await this.generateWithTools([dto.message]);
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

    const responseText = await this.generateWithTools(contents);

    const savedUserMsg = await this.prisma.chatMessage.create({
      data: {
        conversationId: conversation.id,
        role: ChatMessageRole.USER,
        content: dto.message,
      },
    });

    const savedModelMsg = await this.prisma.chatMessage.create({
      data: {
        conversationId: conversation.id,
        role: ChatMessageRole.MODEL,
        content: responseText,
      },
    });

    await this.prisma.chatConversation.update({
      where: { id: conversation.id },
      data: { updatedAt: new Date() },
    });

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
