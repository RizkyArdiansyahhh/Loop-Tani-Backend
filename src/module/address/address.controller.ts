import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiCookieAuth,
  ApiParam,
} from '@nestjs/swagger';
import { Session } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { AddressResponseDto } from './dto/address-response.dto';

@ApiTags('Address')
@ApiCookieAuth('better-auth.session_token')
@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  /**
   * GET /address
   */
  @Get()
  @ApiOperation({
    summary: 'Daftar semua alamat user',
    description: 'Mengambil semua alamat aktif (belum dihapus) milik user yang sedang terautentikasi, diurutkan berdasarkan alamat default terlebih dahulu, kemudian alamat terbaru.',
  })
  @ApiResponse({
    status: 200,
    description: 'Daftar alamat berhasil diambil',
    type: [AddressResponseDto],
  })
  @ApiUnauthorizedResponse({ description: 'Tidak terautentikasi' })
  async findAll(@Session() session: UserSession): Promise<AddressResponseDto[]> {
    const addresses = await this.addressService.findAll(session.user.id);
    return AddressResponseDto.fromEntities(addresses);
  }

  /**
   * GET /address/default
   */
  @Get('default')
  @ApiOperation({
    summary: 'Ambil alamat default',
    description: 'Mengambil satu alamat yang ditandai sebagai alamat pengiriman default/utama milik user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Alamat default berhasil diambil',
    type: AddressResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Alamat default tidak ditemukan' })
  @ApiUnauthorizedResponse({ description: 'Tidak terautentikasi' })
  async findDefault(@Session() session: UserSession): Promise<AddressResponseDto> {
    const address = await this.addressService.findDefault(session.user.id);
    return AddressResponseDto.fromEntity(address);
  }

  /**
   * GET /address/:id
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Detail alamat',
    description: 'Mengambil detail satu alamat berdasarkan ID alamat.',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID dari alamat',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Detail alamat ditemukan',
    type: AddressResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Alamat tidak ditemukan' })
  @ApiForbiddenResponse({ description: 'Tidak memiliki akses ke alamat ini' })
  @ApiUnauthorizedResponse({ description: 'Tidak terautentikasi' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Session() session: UserSession,
  ): Promise<AddressResponseDto> {
    const address = await this.addressService.findOne(id, session.user.id);
    return AddressResponseDto.fromEntity(address);
  }

  /**
   * POST /address
   */
  @Post()
  @ApiOperation({
    summary: 'Buat alamat baru',
    description: 'Menambahkan alamat pengiriman baru ke akun user. Jika ini alamat pertama, alamat otomatis dijadikan default.',
  })
  @ApiResponse({
    status: 201,
    description: 'Alamat berhasil dibuat',
    type: AddressResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Validasi input gagal' })
  @ApiUnauthorizedResponse({ description: 'Tidak terautentikasi' })
  async create(
    @Session() session: UserSession,
    @Body() dto: CreateAddressDto,
  ): Promise<AddressResponseDto> {
    const address = await this.addressService.create(session.user.id, dto);
    return AddressResponseDto.fromEntity(address);
  }

  /**
   * PATCH /address/:id
   */
  @Patch(':id')
  @ApiOperation({
    summary: 'Update alamat',
    description: 'Mengubah informasi rincian alamat (seperti jalan, penerima, nomor HP). Field isDefault tidak bisa diubah lewat endpoint ini.',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID dari alamat yang akan diupdate',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Alamat berhasil diperbarui',
    type: AddressResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Alamat tidak ditemukan' })
  @ApiForbiddenResponse({ description: 'Tidak memiliki akses ke alamat ini' })
  @ApiBadRequestResponse({ description: 'Validasi input gagal' })
  @ApiUnauthorizedResponse({ description: 'Tidak terautentikasi' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Session() session: UserSession,
    @Body() dto: UpdateAddressDto,
  ): Promise<AddressResponseDto> {
    const address = await this.addressService.update(id, session.user.id, dto);
    return AddressResponseDto.fromEntity(address);
  }

  /**
   * PATCH /address/:id/set-default
   */
  @Patch(':id/set-default')
  @ApiOperation({
    summary: 'Jadikan alamat default',
    description: 'Mengatur alamat ini sebagai alamat default pengiriman user, dan secara otomatis menonaktifkan status default pada alamat lainnya.',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID dari alamat yang akan dijadikan default',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Alamat berhasil dijadikan default',
    type: AddressResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Alamat tidak ditemukan' })
  @ApiForbiddenResponse({ description: 'Tidak memiliki akses ke alamat ini' })
  @ApiUnauthorizedResponse({ description: 'Tidak terautentikasi' })
  async setDefault(
    @Param('id', ParseUUIDPipe) id: string,
    @Session() session: UserSession,
  ): Promise<AddressResponseDto> {
    const address = await this.addressService.setDefault(id, session.user.id);
    return AddressResponseDto.fromEntity(address);
  }

  /**
   * DELETE /address/:id
   */
  @Delete(':id')
  @ApiOperation({
    summary: 'Hapus alamat (Soft Delete)',
    description: 'Menghapus alamat pengiriman secara soft-delete. Jika alamat yang dihapus sebelumnya adalah default, maka alamat aktif terbaru akan dipromosikan sebagai default baru.',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID dari alamat yang akan dihapus',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Alamat berhasil dihapus secara soft-delete',
    type: AddressResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Alamat tidak ditemukan' })
  @ApiForbiddenResponse({ description: 'Tidak memiliki akses ke alamat ini' })
  @ApiUnauthorizedResponse({ description: 'Tidak terautentikasi' })
  async delete(
    @Param('id', ParseUUIDPipe) id: string,
    @Session() session: UserSession,
  ): Promise<AddressResponseDto> {
    const address = await this.addressService.delete(id, session.user.id);
    return AddressResponseDto.fromEntity(address);
  }
}
