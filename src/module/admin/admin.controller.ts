import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiCookieAuth } from '@nestjs/swagger';
import { Session } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import { AdminService } from './admin.service';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { UpdateUserRolesDto } from './dto/update-user-roles.dto';
import { VerifySellerDto } from './dto/verify-seller.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateKnowledgeDto } from './dto/create-knowledge.dto';
import { CreateRewardDto } from './dto/create-reward.dto';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { SellerStatus } from '@prisma/client';

@ApiTags('Admin')
@ApiCookieAuth('better-auth.session_token')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ─── Dashboard ────────────────────────────────────────────────────────────

  @Get('dashboard')
  @ApiOperation({ summary: 'Mendapatkan analitik dashboard admin' })
  getDashboard(@Session() session: UserSession) {
    return this.adminService.getDashboard(session.user.id);
  }

  // ─── User Management ──────────────────────────────────────────────────────

  @Get('users')
  @ApiOperation({ summary: 'Daftar semua pengguna dengan pagination & search' })
  getUsers(
    @Session() session: UserSession,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('search') search?: string,
  ) {
    return this.adminService.getUsers(
      session.user.id,
      page ?? 1,
      limit ?? 10,
      search,
    );
  }

  @Patch('users/:id/status')
  @ApiOperation({ summary: 'Mengaktifkan / menonaktifkan pengguna' })
  updateUserStatus(
    @Session() session: UserSession,
    @Param('id') targetUserId: string,
    @Body() dto: UpdateUserStatusDto,
  ) {
    return this.adminService.updateUserStatus(session.user.id, targetUserId, dto);
  }

  @Patch('users/:id/roles')
  @ApiOperation({ summary: 'Mengupdate peran pengguna' })
  updateUserRoles(
    @Session() session: UserSession,
    @Param('id') targetUserId: string,
    @Body() dto: UpdateUserRolesDto,
  ) {
    return this.adminService.updateUserRoles(session.user.id, targetUserId, dto);
  }

  // ─── Seller Verification ──────────────────────────────────────────────────

  @Get('sellers')
  @ApiOperation({ summary: 'Daftar semua profil seller berdasarkan status' })
  getSellers(
    @Session() session: UserSession,
    @Query('status') status?: SellerStatus,
  ) {
    return this.adminService.getSellers(session.user.id, status);
  }

  @Patch('sellers/:userId/verify')
  @ApiOperation({ summary: 'Verifikasi pendaftaran toko seller' })
  verifySeller(
    @Session() session: UserSession,
    @Param('userId') targetSellerUserId: string,
    @Body() dto: VerifySellerDto,
  ) {
    return this.adminService.verifySeller(session.user.id, targetSellerUserId, dto);
  }

  // ─── Category Management ──────────────────────────────────────────────────

  @Get('categories')
  @ApiOperation({ summary: 'Mendapatkan semua kategori' })
  getCategories(@Session() session: UserSession) {
    return this.adminService.getCategories(session.user.id);
  }

  @Post('categories')
  @ApiOperation({ summary: 'Membuat kategori baru' })
  createCategory(
    @Session() session: UserSession,
    @Body() dto: CreateCategoryDto,
  ) {
    return this.adminService.createCategory(session.user.id, dto);
  }

  @Patch('categories/:id')
  @ApiOperation({ summary: 'Mengupdate kategori' })
  updateCategory(
    @Session() session: UserSession,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: Partial<CreateCategoryDto>,
  ) {
    return this.adminService.updateCategory(session.user.id, id, dto);
  }

  @Delete('categories/:id')
  @ApiOperation({ summary: 'Menghapus kategori' })
  deleteCategory(
    @Session() session: UserSession,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.adminService.deleteCategory(session.user.id, id);
  }

  // ─── Knowledge Management ─────────────────────────────────────────────────

  @Get('knowledge')
  @ApiOperation({ summary: 'Daftar seluruh artikel & video edukasi' })
  getKnowledge(@Session() session: UserSession) {
    return this.adminService.getKnowledge(session.user.id);
  }

  @Post('knowledge')
  @ApiOperation({ summary: 'Membuat artikel atau video edukasi baru' })
  createKnowledge(
    @Session() session: UserSession,
    @Body() dto: CreateKnowledgeDto,
  ) {
    return this.adminService.createKnowledge(session.user.id, dto);
  }

  @Patch('knowledge/:id')
  @ApiOperation({ summary: 'Mengupdate artikel atau video edukasi' })
  updateKnowledge(
    @Session() session: UserSession,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: Partial<CreateKnowledgeDto>,
  ) {
    return this.adminService.updateKnowledge(session.user.id, id, dto);
  }

  @Delete('knowledge/:id')
  @ApiOperation({ summary: 'Menghapus artikel atau video edukasi' })
  deleteKnowledge(
    @Session() session: UserSession,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.adminService.deleteKnowledge(session.user.id, id);
  }

  // ─── Reward Management ────────────────────────────────────────────────────

  @Get('rewards')
  @ApiOperation({ summary: 'Katalog reward penukaran poin' })
  getRewards(@Session() session: UserSession) {
    return this.adminService.getRewards(session.user.id);
  }

  @Post('rewards')
  @ApiOperation({ summary: 'Membuat item reward penukaran baru' })
  createReward(
    @Session() session: UserSession,
    @Body() dto: CreateRewardDto,
  ) {
    return this.adminService.createReward(session.user.id, dto);
  }

  @Patch('rewards/:id')
  @ApiOperation({ summary: 'Mengupdate item reward penukaran' })
  updateReward(
    @Session() session: UserSession,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: Partial<CreateRewardDto>,
  ) {
    return this.adminService.updateReward(session.user.id, id, dto);
  }

  @Delete('rewards/:id')
  @ApiOperation({ summary: 'Menghapus item reward penukaran' })
  deleteReward(
    @Session() session: UserSession,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.adminService.deleteReward(session.user.id, id);
  }

  // ─── Notification Management ──────────────────────────────────────────────

  @Get('notifications')
  @ApiOperation({ summary: 'Mendapatkan daftar siaran notifikasi' })
  getNotifications(@Session() session: UserSession) {
    return this.adminService.getNotifications(session.user.id);
  }

  @Post('notifications')
  @ApiOperation({ summary: 'Menyiarkan notifikasi baru ke platform' })
  createNotification(
    @Session() session: UserSession,
    @Body() dto: CreateNotificationDto,
  ) {
    return this.adminService.createNotification(session.user.id, dto);
  }

  // ─── Point Transactions ───────────────────────────────────────────────────

  @Get('point-transactions')
  @ApiOperation({ summary: 'Mendapatkan riwayat transaksi poin platform' })
  getPointTransactions(
    @Session() session: UserSession,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('search') search?: string,
  ) {
    return this.adminService.getPointTransactions(
      session.user.id,
      page ?? 1,
      limit ?? 10,
      search,
    );
  }
}
