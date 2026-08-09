import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  Param,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiCookieAuth,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { Session, AllowAnonymous } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import { SellerService } from './seller.service';
import { RegisterSellerDto } from './dto/register-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { SimulateApproveDto } from './dto/simulate-approve.dto';

@ApiTags('Seller')
@ApiCookieAuth('better-auth.session_token')
@Controller('seller')
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  @Get('me')
  @ApiOperation({
    summary: 'Get current user seller profile status',
    description: 'Fetch lightweight details of the seller profile associated with the logged-in user.',
  })
  @ApiResponse({ status: 200, description: 'Seller profile retrieved successfully' })
  @ApiNotFoundResponse({ description: 'Seller profile does not exist' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  getSellerMe(@Session() session: UserSession) {
    return this.sellerService.getSellerMe(session.user.id);
  }

  @Patch('settings')
  @ApiOperation({
    summary: 'Update seller store profile settings',
    description: 'Update store name, slug, phone, location, logo, or description for the logged-in seller.',
  })
  @ApiResponse({ status: 200, description: 'Seller profile updated successfully' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  updateSellerSettings(
    @Session() session: UserSession,
    @Body() dto: UpdateSellerDto,
  ) {
    return this.sellerService.updateSellerSettings(session.user.id, dto);
  }

  @Post('register')
  @ApiOperation({
    summary: 'Register as a seller',
    description: 'Initiate seller registration. Sets store status to PENDING approval.',
  })
  @ApiResponse({ status: 201, description: 'Seller profile created successfully' })
  @ApiConflictResponse({ description: 'Duplicate seller profile or store slug already taken' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  registerSeller(
    @Session() session: UserSession,
    @Body() dto: RegisterSellerDto,
  ) {
    return this.sellerService.registerSeller(session.user.id, dto);
  }

  @Get('dashboard')
  @ApiOperation({
    summary: 'Get seller dashboard analytics',
    description: 'Fetches metrics and listings for the active seller. Requires ACTIVE status.',
  })
  @ApiResponse({ status: 200, description: 'Dashboard analytics retrieved successfully' })
  @ApiForbiddenResponse({ description: 'Seller profile does not exist or status is not ACTIVE' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  getDashboard(@Session() session: UserSession) {
    return this.sellerService.getDashboard(session.user.id);
  }

  @Post('simulate-approve')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Simulate seller status change (Dev/Demo only)',
    description: 'Bypasses administrative approval in dev/demo mode to update seller status. Locked in production.',
  })
  @ApiResponse({ status: 200, description: 'Seller status updated successfully' })
  @ApiForbiddenResponse({ description: 'Simulation disabled in production environment' })
  @ApiNotFoundResponse({ description: 'Seller profile not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  simulateApprove(
    @Session() session: UserSession,
    @Body() dto: SimulateApproveDto,
  ) {
    return this.sellerService.simulateApprove(session.user.id, dto);
  }

  @Get('store/:slug')
  @AllowAnonymous()
  @ApiOperation({
    summary: 'Get public seller storefront details by store slug',
    description: 'Fetch public details of a seller store. Endpoint is publicly accessible.',
  })
  @ApiResponse({ status: 200, description: 'Store profile retrieved successfully' })
  @ApiNotFoundResponse({ description: 'Store not found or not active' })
  getStoreBySlug(@Param('slug') slug: string) {
    return this.sellerService.getStoreBySlug(slug);
  }

  @Get('orders')
  @ApiOperation({
    summary: 'Get seller orders with filters & pagination',
    description: 'Fetch list of orders for the active seller store.',
  })
  @ApiResponse({ status: 200, description: 'Seller orders retrieved successfully' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  getOrders(
    @Session() session: UserSession,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    return this.sellerService.getSellerOrders(session.user.id, {
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
      status,
      search,
    });
  }

  @Patch('orders/:id/status')
  @ApiOperation({
    summary: 'Update seller order status',
    description: 'Update the status of an order (e.g. PROCESSING, SHIPPED, COMPLETED).',
  })
  @ApiResponse({ status: 200, description: 'Order status updated successfully' })
  @ApiNotFoundResponse({ description: 'Order not found' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  updateOrderStatus(
    @Session() session: UserSession,
    @Param('id') id: string,
    @Body() dto: { status: any },
  ) {
    return this.sellerService.updateSellerOrderStatus(session.user.id, id, dto);
  }

  @Get('revenue')
  @ApiOperation({
    summary: 'Get seller revenue & financial statistics',
    description: 'Fetches revenue balances, payout history, and transaction entries for active seller.',
  })
  @ApiResponse({ status: 200, description: 'Seller revenue data retrieved successfully' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  getRevenue(@Session() session: UserSession) {
    return this.sellerService.getSellerRevenue(session.user.id);
  }

  @Post('revenue/withdraw')
  @ApiOperation({
    summary: 'Request balance withdrawal payout',
    description: 'Submit payout request for available balance.',
  })
  @ApiResponse({ status: 200, description: 'Payout requested successfully' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  requestPayout(
    @Session() session: UserSession,
    @Body() dto: { amount: number; bankName?: string; accountNumber?: string },
  ) {
    return this.sellerService.requestPayout(session.user.id, dto);
  }

  @Get('analytics')
  @ApiOperation({
    summary: 'Get seller business analytics & metrics',
    description: 'Fetches store performance metrics, top-selling products, and traffic conversions.',
  })
  @ApiResponse({ status: 200, description: 'Seller analytics retrieved successfully' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  getAnalytics(
    @Session() session: UserSession,
    @Query('period') period?: string,
  ) {
    return this.sellerService.getSellerAnalytics(session.user.id, period);
  }

  @Get('reviews')
  @ApiOperation({
    summary: 'Get seller reviews and rating breakdown',
    description: 'Fetches buyer reviews and satisfaction rating metrics for active seller store.',
  })
  @ApiResponse({ status: 200, description: 'Seller reviews retrieved successfully' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  getReviews(
    @Session() session: UserSession,
    @Query('rating') rating?: number,
  ) {
    return this.sellerService.getSellerReviews(session.user.id, rating ? Number(rating) : undefined);
  }

  @Post('reviews/:id/reply')
  @ApiOperation({
    summary: 'Reply to buyer review',
    description: 'Post a response from seller to a specific buyer review.',
  })
  @ApiResponse({ status: 200, description: 'Review reply posted successfully' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  replyReview(
    @Session() session: UserSession,
    @Param('id') id: string,
    @Body() dto: { reply: string },
  ) {
    return this.sellerService.replySellerReview(session.user.id, id, dto);
  }
}
