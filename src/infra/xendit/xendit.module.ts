import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { XenditConfig } from './xendit.config';
import { XenditClient } from './xendit.client';
import { XenditService } from './xendit.service';
import { XenditWebhookGuard } from './guards/xendit-webhook.guard';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [XenditConfig, XenditClient, XenditService, XenditWebhookGuard],
  exports: [XenditConfig, XenditClient, XenditService, XenditWebhookGuard],
})
export class XenditModule {}
