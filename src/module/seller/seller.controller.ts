import {
  Controller,
  Get,
  Post,
  Body,
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
}
