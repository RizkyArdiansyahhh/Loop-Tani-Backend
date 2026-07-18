import { Controller, Post, Body } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { SendMessageDto } from './dto/send-message.dto';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

@Controller('chat')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) { }

  @AllowAnonymous()
  @Post('message')
  sendMessage(@Body() dto: SendMessageDto) {
    return this.chatbotService.sendMessage(dto.message)
  }
}
