import { Module } from '@nestjs/common';
import { PaymentController, PaymentWebhookController } from './payment.controller';
import { PaymentService } from './payment.service';
import { PrismaModule } from '../../infra/database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PaymentController, PaymentWebhookController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
