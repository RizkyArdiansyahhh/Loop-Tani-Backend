import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
  ParseUUIDPipe,
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
} from '@nestjs/swagger';
import { Session, AllowAnonymous } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { GetCommentsDto } from './dto/get-comments.dto';
import { ReportCommentDto } from './dto/report-comment.dto';
import { ModerateCommentDto } from './dto/moderate-comment.dto';

@ApiTags('Comments')
@ApiCookieAuth('better-auth.session_token')
@Controller()
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  // Helper check admin role
  private checkIsAdmin(session: UserSession | undefined): boolean {
    if (!session?.user) return false;
    const userRole = session.user.role;
    return (
      userRole === 'ADMIN' ||
      (Array.isArray(userRole) && userRole.includes('ADMIN'))
    );
  }

  /**
   * GET /knowledge/:contentId/comments
   */
  @Get('knowledge/:contentId/comments')
  @AllowAnonymous()
  @ApiOperation({
    summary: 'Daftar komentar untuk konten panduan (publik)',
    description: 'Mengambil daftar komentar utama (parent) beserta balasannya untuk artikel/video.',
  })
  @ApiParam({ name: 'contentId', description: 'UUID konten panduan' })
  @ApiResponse({ status: 200, description: 'Daftar komentar ditemukan' })
  findAll(
    @Param('contentId', ParseUUIDPipe) contentId: string,
    @Query() dto: GetCommentsDto,
    @Session() session: UserSession | undefined,
  ) {
    const isAdmin = this.checkIsAdmin(session);
    return this.commentService.findAll(contentId, dto, session?.user?.id, isAdmin);
  }

  /**
   * POST /knowledge/:contentId/comments
   */
  @Post('knowledge/:contentId/comments')
  @ApiOperation({
    summary: 'Buat komentar atau balasan baru',
    description: 'Membuat komentar utama atau balasan (jika parentId disertakan) untuk artikel/video.',
  })
  @ApiParam({ name: 'contentId', description: 'UUID konten panduan' })
  @ApiResponse({ status: 201, description: 'Komentar berhasil dibuat' })
  @ApiUnauthorizedResponse({ description: 'Tidak terautentikasi' })
  create(
    @Param('contentId', ParseUUIDPipe) contentId: string,
    @Session() session: UserSession,
    @Body() dto: CreateCommentDto,
  ) {
    return this.commentService.create(session.user.id, contentId, dto);
  }

  /**
   * PATCH /comments/:commentId
   */
  @Patch('comments/:commentId')
  @ApiOperation({
    summary: 'Edit komentar sendiri',
    description: 'Mengupdate isi teks komentar. Hanya pemilik komentar atau admin yang berwenang.',
  })
  @ApiParam({ name: 'commentId', description: 'UUID komentar' })
  @ApiResponse({ status: 200, description: 'Komentar berhasil diperbarui' })
  @ApiUnauthorizedResponse({ description: 'Tidak terautentikasi' })
  @ApiNotFoundResponse({ description: 'Komentar tidak ditemukan' })
  update(
    @Param('commentId', ParseUUIDPipe) commentId: string,
    @Session() session: UserSession,
    @Body() dto: UpdateCommentDto,
  ) {
    const isAdmin = this.checkIsAdmin(session);
    return this.commentService.update(session.user.id, commentId, dto, isAdmin);
  }

  /**
   * DELETE /comments/:commentId
   */
  @Delete('comments/:commentId')
  @ApiOperation({
    summary: 'Hapus komentar sendiri (soft delete)',
    description: 'Melakukan soft delete komentar. Hanya pemilik komentar atau admin yang berwenang.',
  })
  @ApiParam({ name: 'commentId', description: 'UUID komentar' })
  @ApiResponse({ status: 200, description: 'Komentar berhasil dihapus' })
  @ApiUnauthorizedResponse({ description: 'Tidak terautentikasi' })
  @ApiNotFoundResponse({ description: 'Komentar tidak ditemukan' })
  remove(
    @Param('commentId', ParseUUIDPipe) commentId: string,
    @Session() session: UserSession,
  ) {
    const isAdmin = this.checkIsAdmin(session);
    return this.commentService.remove(session.user.id, commentId, isAdmin);
  }

  /**
   * POST /comments/:commentId/report
   */
  @Post('comments/:commentId/report')
  @ApiOperation({
    summary: 'Laporkan komentar tidak pantas',
    description: 'Melaporkan komentar. Pengguna hanya dapat melaporkan satu komentar sekali.',
  })
  @ApiParam({ name: 'commentId', description: 'UUID komentar' })
  @ApiResponse({ status: 201, description: 'Komentar berhasil dilaporkan' })
  @ApiUnauthorizedResponse({ description: 'Tidak terautentikasi' })
  report(
    @Param('commentId', ParseUUIDPipe) commentId: string,
    @Session() session: UserSession,
    @Body() dto: ReportCommentDto,
  ) {
    return this.commentService.report(session.user.id, commentId, dto.reason);
  }

  /**
   * PATCH /comments/:commentId/status
   */
  @Patch('comments/:commentId/status')
  @ApiOperation({
    summary: 'Moderasi status komentar (Admin only)',
    description: 'Mengubah status komentar (ACTIVE, HIDDEN, DELETED). Hanya admin yang berwenang.',
  })
  @ApiParam({ name: 'commentId', description: 'UUID komentar' })
  @ApiResponse({ status: 200, description: 'Komentar berhasil dimoderasi' })
  @ApiUnauthorizedResponse({ description: 'Tidak terautentikasi' })
  moderate(
    @Param('commentId', ParseUUIDPipe) commentId: string,
    @Session() session: UserSession,
    @Body() dto: ModerateCommentDto,
  ) {
    const isAdmin = this.checkIsAdmin(session);
    if (!isAdmin) {
      throw new ForbiddenException('Akses ditolak. Hanya Admin yang diperbolehkan memoderasi.');
    }
    return this.commentService.moderate(commentId, dto.status);
  }
}
