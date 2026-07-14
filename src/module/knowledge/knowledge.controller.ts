import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiCookieAuth,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { Session, AllowAnonymous } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import { FileInterceptor } from '@nestjs/platform-express';
import { KnowledgeService } from './knowledge.service';
import { CreateContentDto } from './dto/create-content.dto';
import { CompleteContentDto } from './dto/complete-content.dto';
import { GetContentsDto } from './dto/get-contents.dto';
import { CloudinaryService } from '../../infra/cloudinary/cloudinary.service';

@ApiTags('Knowledge')
@ApiCookieAuth('better-auth.session_token')
@Controller('knowledge')
export class KnowledgeController {
  constructor(
    private readonly knowledgeService: KnowledgeService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  /**
   * POST /knowledge
   */
  @Post()
  @ApiOperation({
    summary: 'Buat konten panduan tani baru',
    description: 'Membuat artikel/video panduan tani baru. Memerlukan autentikasi.',
  })
  @ApiResponse({ status: 201, description: 'Konten berhasil dibuat' })
  @ApiUnauthorizedResponse({ description: 'Tidak terautentikasi' })
  create(
    @Session() session: UserSession,
    @Body() dto: CreateContentDto,
  ) {
    return this.knowledgeService.create(session.user.id, dto);
  }

  /**
   * GET /knowledge
   */
  @Get()
  @AllowAnonymous()
  @ApiOperation({
    summary: 'Daftar konten panduan tani (publik)',
    description: 'Mengambil daftar konten panduan tani aktif (artikel/video) dengan pagination dan filter.',
  })
  @ApiResponse({ status: 200, description: 'Daftar konten ditemukan' })
  findAll(@Query() dto: GetContentsDto) {
    return this.knowledgeService.findAll(dto);
  }

  /**
   * GET /knowledge/:contentId/progress
   */
  @Get(':contentId/progress')
  @ApiOperation({
    summary: 'Ambil progress belajar user untuk suatu konten',
    description: 'Mendapatkan data detail scroll/watch progress belajar user saat ini.',
  })
  @ApiParam({ name: 'contentId', description: 'UUID konten panduan' })
  @ApiResponse({ status: 200, description: 'Progress ditemukan' })
  @ApiUnauthorizedResponse({ description: 'Tidak terautentikasi' })
  getProgress(
    @Param('contentId', ParseUUIDPipe) contentId: string,
    @Session() session: UserSession,
  ) {
    return this.knowledgeService.getProgress(contentId, session.user.id);
  }

  /**
   * POST /knowledge/upload-video
   */
  @Post('upload-video')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit for video upload
    }),
  )
  @ApiOperation({
    summary: 'Upload video panduan ke Cloudinary (Admin only)',
    description: 'Mengupload file video (mp4, mkv, dll) ke Cloudinary dan mengembalikan metadata detail.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['file'],
    },
  })
  @ApiResponse({ status: 201, description: 'Video berhasil diupload ke Cloudinary' })
  @ApiUnauthorizedResponse({ description: 'Tidak terautentikasi' })
  async uploadVideo(
    @Session() session: UserSession,
    @UploadedFile() file: Express.Multer.File,
  ) {
    // Role check: Only admin
    const userRole = session.user.role === 'ADMIN' ||
                     (Array.isArray(session.user.role) && session.user.role.includes('ADMIN'));
    if (!userRole) {
      throw new ForbiddenException('Hanya Admin yang diperbolehkan mengupload video.');
    }

    if (!file) {
      throw new BadRequestException('File video harus disertakan.');
    }

    const folder = `loop-tani/videos/${session.user.id}`;
    const result = await this.cloudinaryService.uploadVideo(file.buffer, folder);

    const secureUrl = result.secure_url;
    const duration = result.duration ? Math.round(result.duration) : 0;
    const thumbnailUrl = secureUrl.substring(0, secureUrl.lastIndexOf('.')) + '.jpg';

    return {
      secure_url: secureUrl,
      public_id: result.public_id,
      duration,
      thumbnail: thumbnailUrl,
    };
  }

  /**
   * POST /knowledge/:contentId/complete
   */
  @Post(':contentId/complete')
  @ApiOperation({
    summary: 'Laporkan progress/selesai belajar konten',
    description: 'Mengirimkan progress belajar (scroll/waktu aktif/watch) ke server. Server memvalidasi thresholds.',
  })
  @ApiParam({ name: 'contentId', description: 'UUID konten panduan' })
  @ApiResponse({ status: 200, description: 'Progress berhasil diverifikasi' })
  @ApiUnauthorizedResponse({ description: 'Tidak terautentikasi' })
  complete(
    @Param('contentId', ParseUUIDPipe) contentId: string,
    @Session() session: UserSession,
    @Body() dto: CompleteContentDto,
  ) {
    return this.knowledgeService.complete(contentId, session.user.id, dto);
  }

  /**
   * POST /knowledge/:contentId/claim
   */
  @Post(':contentId/claim')
  @ApiOperation({
    summary: 'Klaim LoopPoints reward setelah menyelesaikan konten',
    description: 'Mengklaim poin reward. Menambahkan ke balance user melalui transaksi database aman.',
  })
  @ApiParam({ name: 'contentId', description: 'UUID konten panduan' })
  @ApiResponse({ status: 200, description: 'LoopPoints berhasil diklaim' })
  @ApiUnauthorizedResponse({ description: 'Tidak terautentikasi' })
  claim(
    @Param('contentId', ParseUUIDPipe) contentId: string,
    @Session() session: UserSession,
  ) {
    return this.knowledgeService.claim(contentId, session.user.id);
  }

  /**
   * GET /knowledge/:idOrSlug
   */
  @Get(':idOrSlug')
  @AllowAnonymous()
  @ApiOperation({
    summary: 'Detail konten panduan tani',
    description: 'Mengambil detail lengkap satu artikel/video panduan tani berdasarkan ID atau slug.',
  })
  @ApiParam({ name: 'idOrSlug', description: 'UUID atau slug konten panduan' })
  @ApiResponse({ status: 200, description: 'Detail konten ditemukan' })
  @ApiNotFoundResponse({ description: 'Konten tidak ditemukan' })
  findOne(
    @Param('idOrSlug') idOrSlug: string,
    @Session() session: UserSession | undefined,
  ) {
    return this.knowledgeService.findOne(idOrSlug, session?.user?.id);
  }

  /**
   * DELETE /knowledge/:id
   */
  @Delete(':id')
  @ApiOperation({
    summary: 'Hapus konten panduan tani',
    description: 'Menghapus konten secara permanen. Hanya admin atau pembuat konten yang berwenang.',
  })
  @ApiParam({ name: 'id', description: 'UUID konten panduan' })
  @ApiResponse({ status: 200, description: 'Konten berhasil dihapus' })
  @ApiUnauthorizedResponse({ description: 'Tidak terautentikasi' })
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Session() session: UserSession,
  ) {
    return this.knowledgeService.remove(id, session.user.id);
  }
}
