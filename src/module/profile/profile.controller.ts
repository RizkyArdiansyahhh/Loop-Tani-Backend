import {
  Controller,
  Get,
  Patch,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiCookieAuth,
  ApiConsumes,
  ApiBody,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { Session } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@ApiTags('Profile')
@ApiCookieAuth('better-auth.session_token')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  /**
   * GET /profile
   */
  @Get()
  @ApiOperation({
    summary: 'Get logged-in user profile',
    description:
      'Returns the full profile of the currently authenticated user, including seller profile status.',
  })
  @ApiResponse({ status: 200, description: 'Profile data' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  getProfile(@Session() session: UserSession) {
    return this.profileService.getProfile(session.user.id);
  }

  /**
   * PATCH /profile
   */
  @Patch()
  @ApiOperation({
    summary: 'Update user profile',
    description: 'Update name and/or phone number of the authenticated user.',
  })
  @ApiResponse({ status: 200, description: 'Updated profile' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiBadRequestResponse({ description: 'Validation error' })
  updateProfile(
    @Session() session: UserSession,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.profileService.updateProfile(session.user.id, dto);
  }

  /**
   * POST /profile/avatar
   */
  @Post('avatar')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 2 * 1024 * 1024 }, // 2MB hard limit at interceptor level
    }),
  )
  @ApiOperation({
    summary: 'Upload avatar image',
    description:
      'Uploads an avatar image to Cloudinary. Previous avatar is deleted automatically. Allowed types: JPEG, PNG. Max size: 2 MB.',
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
  @ApiResponse({ status: 200, description: 'Updated profile with new avatar' })
  @ApiUnauthorizedResponse({ description: 'Not authenticated' })
  @ApiBadRequestResponse({
    description: 'Invalid file type, size, or format',
  })
  uploadAvatar(
    @Session() session: UserSession,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.profileService.uploadAvatar(session.user.id, file);
  }
}
