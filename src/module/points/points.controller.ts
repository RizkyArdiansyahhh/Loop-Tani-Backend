import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiCookieAuth,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Session } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import { PointsService } from './points.service';
import { GetTransactionsDto } from './dto/get-transactions.dto';

@ApiTags('Points')
@ApiCookieAuth('better-auth.session_token')
@Controller('points')
export class PointsController {
  constructor(private readonly pointsService: PointsService) {}

  /**
   * GET /points/me
   */
  @Get('me')
  @ApiOperation({
    summary: 'Dapatkan saldo LoopPoints user saat ini',
    description: 'Mengembalikan detail saldo poin, poin seumur hidup, dan tier member user yang sedang login.',
  })
  @ApiResponse({ status: 200, description: 'Informasi LoopPoints berhasil didapatkan' })
  @ApiUnauthorizedResponse({ description: 'Tidak terautentikasi' })
  getAccount(@Session() session: UserSession) {
    return this.pointsService.getAccount(session.user.id);
  }

  /**
   * GET /points/transactions
   */
  @Get('transactions')
  @ApiOperation({
    summary: 'Riwayat transaksi LoopPoints (paginated)',
    description: 'Mengambil daftar riwayat perolehan/penggunaan LoopPoints user yang sedang login.',
  })
  @ApiResponse({ status: 200, description: 'Riwayat transaksi berhasil didapatkan' })
  @ApiUnauthorizedResponse({ description: 'Tidak terautentikasi' })
  getTransactions(
    @Session() session: UserSession,
    @Query() dto: GetTransactionsDto,
  ) {
    return this.pointsService.getTransactions(session.user.id, dto);
  }
}
