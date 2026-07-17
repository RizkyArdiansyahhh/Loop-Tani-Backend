import { Controller, Get, Post, Body, Param, ParseUUIDPipe } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiCookieAuth,
  ApiConflictResponse,
} from '@nestjs/swagger';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  /**
   * POST /categories
   */
  @Post()
  @ApiCookieAuth('better-auth.session_token')
  @ApiOperation({
    summary: 'Buat kategori baru',
    description:
      'Membuat kategori produk baru. Slug harus unik dan dalam format kebab-case lowercase. ' +
      '**Dalam production, endpoint ini seharusnya dibatasi untuk ADMIN saja.**',
  })
  @ApiResponse({
    status: 201,
    description: 'Kategori berhasil dibuat',
    schema: {
      example: {
        id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        name: 'Sayuran Segar',
        slug: 'sayuran-segar',
      },
    },
  })
  @ApiConflictResponse({ description: 'Slug sudah digunakan oleh kategori lain' })
  @ApiUnauthorizedResponse({ description: 'Tidak terautentikasi' })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  /**
   * GET /categories
   */
  @Get()
  @AllowAnonymous()
  @ApiOperation({
    summary: 'Daftar semua kategori',
    description: 'Mengambil semua kategori produk yang tersedia, diurutkan alphabetically. Menyertakan jumlah produk per kategori. **Endpoint publik.**',
  })
  @ApiResponse({
    status: 200,
    description: 'Daftar kategori',
    schema: {
      example: [
        {
          id: 'uuid',
          name: 'Beras & Serealia',
          slug: 'beras-serealia',
          _count: { products: 3 },
        },
        {
          id: 'uuid',
          name: 'Sayuran Segar',
          slug: 'sayuran-segar',
          _count: { products: 8 },
        },
      ],
    },
  })
  findAll() {
    return this.categoryService.findAll();
  }

  /**
   * GET /categories/:id
   */
  @Get(':id')
  @AllowAnonymous()
  @ApiOperation({
    summary: 'Detail kategori',
    description: 'Mengambil detail satu kategori berdasarkan UUID. **Endpoint publik.**',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID kategori',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiResponse({
    status: 200,
    description: 'Detail kategori ditemukan',
    schema: {
      example: {
        id: 'uuid',
        name: 'Sayuran Segar',
        slug: 'sayuran-segar',
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Kategori tidak ditemukan' })
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }
}
