// Re-compiled waste analyzer controller
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { WasteAnalyzerService } from './waste-analyzer.service';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/jpg',
];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

@ApiTags('Waste Analyzer')
@Controller('waste-analyzer')
export class WasteAnalyzerController {
  constructor(
    private readonly wasteAnalyzerService: WasteAnalyzerService,
  ) {}

  @AllowAnonymous()
  @Post('analyze')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: 'Analisis foto limbah pertanian dengan AI Vision',
    description:
      'Mengidentifikasi jenis limbah, tingkat keyakinan, kondisi visual, potensi pemrosesan, dan estimasi nilai ekonomi dari gambar limbah pertanian.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 200,
    description: 'Hasil analisis foto limbah pertanian berhasil diperoleh',
  })
  @ApiBadRequestResponse({
    description: 'File tidak valid, tipe MIME tidak didukung, atau ukuran file melebihi 10MB',
  })
  async analyzeWaste(
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('File gambar wajib diunggah');
    }

    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException(
        'Format gambar tidak didukung. Gunakan format JPG, PNG, atau WebP.',
      );
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      throw new BadRequestException('Ukuran file gambar maksimal 10MB.');
    }

    const result = await this.wasteAnalyzerService.analyzeImage(
      file.buffer,
      file.mimetype,
    );

    return {
      success: true,
      data: result,
    };
  }
}
