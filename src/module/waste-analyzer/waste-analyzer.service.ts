import { Injectable, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI, Type } from '@google/genai';
export interface WasteAnalysisResult {
  isAgriculturalWaste: boolean;
  isAnalyzable: boolean;

  wasteIdentification: {
    indonesianName: string;
    englishName: string;
    category: string;
    confidenceScore: number;
  };

  visualCondition: {
    color: string;
    state: string;
    environment: string;
  };

  processingPotential: string[];

  economicEstimation: {
    potentialValue: string;
    marketOpportunity: string;
    notes: string;
  };
}

const WASTE_ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    isAgriculturalWaste: {
      type: Type.BOOLEAN,
      description: 'True if the image contains agricultural waste or by-products.',
    },
    isAnalyzable: {
      type: Type.BOOLEAN,
      description: 'True if image quality and lighting are sufficient to analyze.',
    },
    wasteIdentification: {
      type: Type.OBJECT,
      properties: {
        indonesianName: {
          type: Type.STRING,
          description: 'Short name of the waste in Indonesian (e.g. Jerami Padi, Tongkol Jagung). Max 4 words.',
        },
        englishName: {
          type: Type.STRING,
          description: 'Short name of the waste in English (e.g. Rice Straw, Corn Cobs). Max 4 words.',
        },
        category: {
          type: Type.STRING,
          description: 'Category of agricultural waste (e.g. Limbah Tanaman Pangan). Max 4 words.',
        },
        confidenceScore: {
          type: Type.NUMBER,
          description: 'Confidence score between 0.0 and 1.0.',
        },
      },
      required: ['indonesianName', 'englishName', 'category', 'confidenceScore'],
    },
    visualCondition: {
      type: Type.OBJECT,
      properties: {
        color: {
          type: Type.STRING,
          description: 'Short visual color description (e.g. Cokelat Kehitaman). Max 3 words.',
        },
        state: {
          type: Type.STRING,
          description: 'Short visual condition state (e.g. Membusuk & Lembab, Segar, Kering). Max 4 words.',
        },
        environment: {
          type: Type.STRING,
          description: 'Short environment context (e.g. Lahan Pertanian Terbuka). Max 4 words.',
        },
      },
      required: ['color', 'state', 'environment'],
    },
    processingPotential: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
      },
      minItems: 3,
      description: 'List of 3 to 5 potential uses or processing recommendations.',
    },
    economicEstimation: {
      type: Type.OBJECT,
      properties: {
        potentialValue: {
          type: Type.STRING,
          description: 'Estimated monetary value range in Rupiah (e.g. Rp 150.000 - Rp 300.000 / ton).',
        },
        marketOpportunity: {
          type: Type.STRING,
          description: 'Market demand or opportunity level (e.g. Sedang, Tinggi).',
        },
        notes: {
          type: Type.STRING,
          description: 'Detailed analysis notes or disclaimers regarding waste condition and economic value.',
        },
      },
      required: ['potentialValue', 'marketOpportunity', 'notes'],
    },
  },
  required: [
    'isAgriculturalWaste',
    'isAnalyzable',
    'wasteIdentification',
    'visualCondition',
    'processingPotential',
    'economicEstimation',
  ],
};

const SYSTEM_INSTRUCTION = `
You are Limbah Analyzer, an AI computer vision assistant for agricultural waste analysis.

Your task is to analyze uploaded images of agricultural waste.

You must follow these rules:

1. Only analyze agricultural waste and agricultural by-products.
2. Do not identify humans, personal identity, faces, or unrelated objects.
3. If the image does not contain agricultural waste, set \`isAgriculturalWaste\` to false.
4. Do not hallucinate a waste type when the image is unclear.
5. If the image quality is insufficient, set \`isAnalyzable\` to false.
6. Only return the fields defined in the response schema.
7. Do not return markdown.
8. Do not return explanations outside the JSON structure.
9. The response must always be valid JSON according to the schema.
10. The analysis is an estimate and must not be treated as a guaranteed market price.
11. Use Indonesian language for textual descriptions (indonesianName, category, color, state, environment, processingPotential items, potentialValue, marketOpportunity, notes) and English for englishName.
12. Be conservative when identifying waste. If uncertain, set values to "Tidak Diketahui" / "Unknown" or empty strings/arrays.
13. \`confidenceScore\` must be a number between 0.0 and 1.0 (e.g. 0.95 for 95% confidence).
14. \`processingPotential\` must be a non-empty array of 3 to 5 actionable processing recommendations.
15. IMPORTANT: Keep \`indonesianName\`, \`category\`, \`color\`, \`state\`, and \`environment\` concise (2 to 4 words max). Place any detailed explanations in \`economicEstimation.notes\`.
`;

const USER_PROMPT = `
Analisis gambar ini sebagai limbah pertanian.

Identifikasi hanya objek limbah pertanian yang terlihat jelas.

Jangan menebak jika gambar tidak cukup jelas.

Berikan hasil hanya dalam format JSON sesuai response schema.

Fokus pada:
- wasteIdentification (indonesianName [ringkas 2-4 kata], englishName, category, confidenceScore)
- visualCondition (color [ringkas], state [ringkas 2-4 kata], environment [ringkas])
- processingPotential (array 3-5 item potensi pemrosesan/rekomendasi)
- economicEstimation (potentialValue, marketOpportunity, notes [penjelasan detail])

Jika gambar bukan limbah pertanian, kembalikan isAgriculturalWaste=false.
`;

@Injectable()
export class WasteAnalyzerService {
  private readonly ai: GoogleGenAI;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY_CV');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not defined');
    }
    this.ai = new GoogleGenAI({ apiKey });
  }

  private cleanShortLabel(text: string, defaultVal: string, maxLen: number = 40): string {
    if (!text) return defaultVal;
    const trimmed = String(text).trim();
    if (trimmed.length <= maxLen) return trimmed;
    // If long sentence, take first clause before comma/period
    const firstClause = trimmed.split(/[,.;]/)[0].trim();
    if (firstClause.length > 0 && firstClause.length <= maxLen) {
      return firstClause;
    }
    return trimmed.substring(0, maxLen).trim() + '...';
  }

  private normalizeResponse(parsed: any): WasteAnalysisResult {
    const rawName =
      parsed.wasteIdentification?.indonesianName ||
      parsed.wasteType ||
      parsed.wasteAnalysis?.primaryWasteType ||
      parsed.detectedWaste?.[0]?.name ||
      'Limbah Pertanian';

    const rawCategory =
      parsed.wasteIdentification?.category ||
      parsed.category ||
      parsed.wasteAnalysis?.categories?.[0] ||
      parsed.detectedWaste?.[0]?.category ||
      'Limbah Pertanian';

    const rawColor =
      parsed.visualCondition?.color ||
      parsed.color ||
      'Alami';

    const rawState =
      parsed.visualCondition?.state ||
      parsed.condition ||
      parsed.detectedWaste?.[0]?.visualCondition ||
      'Sedang';

    const rawEnv =
      parsed.visualCondition?.environment ||
      parsed.environment ||
      'Lahan Pertanian';

    const wasteIdentification = {
      indonesianName: this.cleanShortLabel(rawName, 'Limbah Pertanian', 45),
      englishName: String(
        parsed.wasteIdentification?.englishName ||
        parsed.englishName ||
        'Agricultural Waste'
      ),
      category: this.cleanShortLabel(rawCategory, 'Limbah Pertanian', 35),
      confidenceScore: Number(
        parsed.wasteIdentification?.confidenceScore ||
        parsed.confidence ||
        parsed.confidenceScore ||
        parsed.detectedWaste?.[0]?.confidence ||
        0.85
      ),
    };

    const visualCondition = {
      color: this.cleanShortLabel(rawColor, 'Alami', 30),
      state: this.cleanShortLabel(rawState, 'Sedang', 35),
      environment: this.cleanShortLabel(rawEnv, 'Lahan Pertanian', 35),
    };

    let rawProcessing: any[] = [];
    if (Array.isArray(parsed.processingPotential) && parsed.processingPotential.length > 0) {
      rawProcessing = parsed.processingPotential;
    } else if (Array.isArray(parsed.wasteAnalysis?.processingPotential) && parsed.wasteAnalysis.processingPotential.length > 0) {
      rawProcessing = parsed.wasteAnalysis.processingPotential;
    } else if (Array.isArray(parsed.detectedWaste?.[0]?.potentialProcessing) && parsed.detectedWaste[0].potentialProcessing.length > 0) {
      rawProcessing = parsed.detectedWaste[0].potentialProcessing;
    } else if (Array.isArray(parsed.recommendations) && parsed.recommendations.length > 0) {
      rawProcessing = parsed.recommendations;
    } else if (Array.isArray(parsed.wasteAnalysis?.recommendations) && parsed.wasteAnalysis.recommendations.length > 0) {
      rawProcessing = parsed.wasteAnalysis.recommendations;
    }

    let processingPotential = rawProcessing.map((p: any) =>
      typeof p === 'string'
        ? p
        : p.type && p.description
        ? `${p.type}: ${p.description}`
        : typeof p === 'object'
        ? Object.values(p).join(' - ')
        : String(p),
    );

    if (processingPotential.length === 0) {
      processingPotential = [
        'Pengomposan secara aerobik/anaerobik untuk pupuk organik berkualitas',
        'Pemanfaatan sebagai pakan ternak (sapi/kambing) setelah pencacahan',
        'Bahan baku briket biomassa atau bahan bakar energi alternatif',
      ];
    }

    const initialNotes =
      parsed.economicEstimation?.notes ||
      parsed.economicPotential?.notes ||
      parsed.economicPotential?.description ||
      parsed.economicPotential?.disclaimer ||
      '';

    // If rawState or rawEnv was very long, append it cleanly to notes for full context
    let finalNotes = initialNotes;
    if (rawState.length > 35 && !finalNotes.includes(rawState)) {
      finalNotes = `Kondisi fisik: ${rawState}. ${finalNotes}`.trim();
    }
    if (!finalNotes) {
      finalNotes = 'Potensi nilai ekonomi bergantung pada kadar air, kebersihan, dan pengolahan limbah.';
    }

    const economicEstimation = {
      potentialValue: String(
        parsed.economicEstimation?.potentialValue ||
        parsed.economicPotential?.potentialValue ||
        parsed.economicPotential?.estimatedValue ||
        parsed.detectedWaste?.[0]?.estimatedEconomicValue ||
        parsed.economicPotential?.level ||
        'Rp 150.000 - Rp 350.000 / ton'
      ),
      marketOpportunity: String(
        parsed.economicEstimation?.marketOpportunity ||
        parsed.economicPotential?.marketOpportunity ||
        parsed.economicPotential?.level ||
        'Tinggi (Permintaan Lokal)'
      ),
      notes: finalNotes,
    };

    return {
      isAgriculturalWaste: parsed.isAgriculturalWaste ?? true,
      isAnalyzable: parsed.isAnalyzable ?? true,
      wasteIdentification,
      visualCondition,
      processingPotential,
      economicEstimation,
    };
  }

  private extractJsonString(rawText: string): string {
    const firstBrace = rawText.indexOf('{');
    const lastBrace = rawText.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      return rawText.substring(firstBrace, lastBrace + 1);
    }
    return rawText.replace(/```json\n?|\n?```/g, '').trim();
  }

  async analyzeImage(
    fileBuffer: Buffer,
    mimeType: string,
  ): Promise<WasteAnalysisResult> {
    const modelsToTry = ['gemini-3.5-flash', 'gemini-2.5-flash'];
    const imagePart = {
      inlineData: {
        data: fileBuffer.toString('base64'),
        mimeType,
      },
    };

    let lastError: any = null;

    for (const model of modelsToTry) {
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          const response = await this.ai.models.generateContent({
            model,
            contents: [USER_PROMPT, imagePart],
            config: {
              systemInstruction: SYSTEM_INSTRUCTION,
              responseMimeType: 'application/json',
              responseSchema: WASTE_ANALYSIS_SCHEMA,
            },
          });

          const rawText = response.text || '';
          const cleanedJsonText = this.extractJsonString(rawText);

          const parsed = JSON.parse(cleanedJsonText);
          const normalized = this.normalizeResponse(parsed);
          console.log('Normalized Waste Analysis Result:', normalized);
          return normalized;
        } catch (e: any) {
          lastError = e;
          console.warn(
            `Gemini Vision API warning (model: ${model}, attempt: ${attempt}):`,
            e?.message || e,
          );

          if (attempt < 2) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }
        }
      }
    }

    console.error('Gemini Vision API error after all retries and fallbacks:', lastError);
    throw new InternalServerErrorException(
      'Analisis limbah sedang mengalami lonjakan beban tinggi di server AI. Silakan coba beberapa saat lagi.',
    );
  }
}
