import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiCookieAuth,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { AllowAnonymous, Session } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import { ChatbotService } from './chatbot.service';
import { SendMessageDto } from './dto/send-message.dto';

@ApiTags('Chatbot')
@ApiCookieAuth('better-auth.session_token')
@Controller('chat')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @AllowAnonymous()
  @Post('message')
  @ApiOperation({
    summary: 'Kirim pesan ke chatbot Loopi',
    description:
      'Pengguna anonim maupun terautentikasi dapat mengirim pesan. Untuk pengguna terautentikasi, riwayat pesan akan disimpan.',
  })
  @ApiResponse({ status: 201, description: 'Pesan berhasil diproses' })
  @ApiBadRequestResponse({
    description: 'Pesan kosong, lebih dari 2000 karakter, atau telah mencapai batas 20 pesan.',
  })
  sendMessage(
    @Body() dto: SendMessageDto,
    @Session() session?: UserSession,
  ) {
    return this.chatbotService.sendMessage(dto, session?.user?.id);
  }

  @Get('conversations')
  @ApiOperation({
    summary: 'Ambil daftar percakapan pengguna (Authenticated)',
    description: 'Mengambil seluruh percakapan milik pengguna yang sedang login diurutkan berdasarkan updatedAt DESC.',
  })
  @ApiResponse({ status: 200, description: 'Daftar percakapan berhasil diambil' })
  @ApiUnauthorizedResponse({ description: 'Tidak terautentikasi' })
  getConversations(@Session() session: UserSession) {
    return this.chatbotService.getConversations(session.user.id);
  }

  @Get('conversations/:id')
  @ApiOperation({
    summary: 'Ambil detail percakapan beserta seluruh pesan (Authenticated)',
    description: 'Mengambil riwayat percakapan spesifik berdasarkan ID untuk pengguna yang login.',
  })
  @ApiResponse({ status: 200, description: 'Detail percakapan berhasil diambil' })
  @ApiUnauthorizedResponse({ description: 'Tidak terautentikasi' })
  @ApiNotFoundResponse({ description: 'Percakapan tidak ditemukan' })
  getConversationDetail(
    @Session() session: UserSession,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.chatbotService.getConversationDetail(session.user.id, id);
  }

  @Delete('conversations/:id')
  @ApiOperation({
    summary: 'Hapus percakapan (Authenticated)',
    description: 'Menghapus percakapan beserta seluruh pesan di dalamnya.',
  })
  @ApiResponse({ status: 200, description: 'Percakapan berhasil dihapus' })
  @ApiUnauthorizedResponse({ description: 'Tidak terautentikasi' })
  @ApiNotFoundResponse({ description: 'Percakapan tidak ditemukan' })
  deleteConversation(
    @Session() session: UserSession,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.chatbotService.deleteConversation(session.user.id, id);
  }
}
