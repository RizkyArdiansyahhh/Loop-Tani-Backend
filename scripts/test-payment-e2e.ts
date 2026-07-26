import 'dotenv/config';
import { PrismaClient, PaymentStatus, OrderStatus } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import fetch from 'node-fetch';
import { PaymentService } from '../src/module/payment/payment.service';
import { XenditService } from '../src/infra/xendit/xendit.service';
import { XenditClient } from '../src/infra/xendit/xendit.client';
import { XenditConfig } from '../src/infra/xendit/xendit.config';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../src/infra/database/prisma.service';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const WEBHOOK_TOKEN = process.env.XENDIT_WEBHOOK_TOKEN || 'qVjyUGX4NvvvoZd7Z03RB024ZNY6U8w9CdASml3CtcegwtJx';

async function runE2ETest() {
  console.log('====================================================');
  console.log('🚀 RUNNING E2E PAYMENT & WEBHOOK SIMULATION TEST');
  console.log('====================================================\n');

  try {
    await prisma.$connect();

    // Instantiate NestJS PaymentService manually for unit-E2E test
    const configService = new ConfigService();
    const prismaService = new PrismaService();
    await prismaService.onModuleInit();
    const xenditConfig = new XenditConfig(configService);
    const xenditClient = new XenditClient(xenditConfig);
    const xenditService = new XenditService(xenditClient);
    const paymentService = new PaymentService(prismaService, xenditService, configService);

    // 1. Fetch or Find a PENDING_PAYMENT Order
    let order = await prisma.order.findFirst({
      where: { orderStatus: OrderStatus.PENDING_PAYMENT },
      include: { payment: true, buyer: true },
      orderBy: { createdAt: 'desc' },
    });

    if (!order) {
      console.log('⚠️  No PENDING_PAYMENT Order found in DB. Searching for any Order...');
      const anyOrder = await prisma.order.findFirst({
        include: { buyer: true },
      });

      if (!anyOrder) {
        console.error('❌ Error: No Order found in DB to test. Please create an Order first.');
        process.exit(1);
      }

      console.log(`ℹ️  Found Order ID: ${anyOrder.id}. Resetting its status to PENDING_PAYMENT for test...`);
      order = await prisma.order.update({
        where: { id: anyOrder.id },
        data: { orderStatus: OrderStatus.PENDING_PAYMENT },
        include: { payment: true, buyer: true },
      });
    }

    console.log(`✅ [Step 1] Target Order ID: ${order.id} | Order Number: ${order.orderNumber}`);

    // 2. Ensure Payment record exists
    let payment = order.payment;
    if (!payment) {
      console.log('ℹ️  Creating Payment record for target Order...');
      payment = await prisma.payment.create({
        data: {
          orderId: order.id,
          referenceId: `PAY-${Date.now()}-TEST`,
          amount: order.grandTotal,
        },
      });
    } else {
      // Reset payment status for clean test
      payment = await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: PaymentStatus.PENDING,
          paymentRequestId: null,
          paymentId: null,
          paidAt: null,
        },
      });
    }

    console.log(`✅ [Step 2] Target Payment ID: ${payment.id} | Ref ID: ${payment.referenceId}`);

    // 3. Simulate Creating Xendit Payment Request for ID_BCA
    console.log('\n--- Step 3: Simulating Payment Request Creation (Xendit v3) ---');
    const mockXenditResponse = {
      id: `pr_${Date.now()}_test`,
      reference_id: payment.referenceId,
      status: 'REQUIRES_ACTION',
      currency: 'IDR',
      amount: payment.amount.toNumber(),
      channel_code: 'ID_BCA',
      actions: [
        {
          action: 'PRESENT_TO_CUSTOMER',
          method: 'GET',
          url: 'https://checkout-staging.xendit.co/v3/pay/mock',
        },
      ],
    };

    // Update DB to reflect payment request created
    payment = await prisma.payment.update({
      where: { id: payment.id },
      data: {
        paymentRequestId: mockXenditResponse.id,
        providerCode: 'BCA',
        paymentMethod: 'VIRTUAL_ACCOUNT',
        rawResponse: mockXenditResponse as any,
      },
    });

    console.log(`✅ Payment Request Created! ID: ${payment.paymentRequestId}`);
    console.log(`   Actions cached in rawResponse: ${JSON.stringify(mockXenditResponse.actions)}`);

    // 4. Test Webhook Handler via PaymentService (payment.capture)
    console.log('\n--- Step 4: Simulating Webhook Callback via PaymentService (payment.capture) ---');
    const webhookPayload = {
      event: 'payment.capture',
      api_version: 'v3',
      created: new Date().toISOString(),
      data: {
        id: `pm_${Date.now()}_capture`,
        payment_request_id: payment.paymentRequestId,
        reference_id: payment.referenceId,
        status: 'SUCCEEDED',
        amount: payment.amount.toNumber(),
        currency: 'IDR',
        channel_code: 'ID_BCA',
        capture_timestamp: new Date().toISOString(),
      },
    };

    const webhookResult = await paymentService.handleXenditWebhook(webhookPayload as any);
    console.log(`📥 Webhook Result:`, webhookResult);

    if (!webhookResult.success) {
      throw new Error(`Webhook handler returned failure: ${webhookResult.message}`);
    }

    // 5. Verify DB State Sync
    console.log('\n--- Step 5: Verifying DB State Synchronization ---');
    const updatedPayment = await prisma.payment.findUnique({
      where: { id: payment.id },
    });
    const updatedOrder = await prisma.order.findUnique({
      where: { id: order.id },
    });

    console.log(`🔍 Payment Status: ${updatedPayment?.status} (Expected: SUCCEEDED)`);
    console.log(`🔍 Order Status:   ${updatedOrder?.orderStatus} (Expected: PAID)`);
    console.log(`🔍 Payment ID:      ${updatedPayment?.paymentId}`);
    console.log(`🔍 Paid At:         ${updatedPayment?.paidAt?.toISOString()}`);

    if (updatedPayment?.status !== PaymentStatus.SUCCEEDED || updatedOrder?.orderStatus !== OrderStatus.PAID) {
      throw new Error('❌ DB Synchronization Verification Failed!');
    }
    console.log('✨ DB State Synchronization PASSED!');

    // 6. Test Late Expiry Webhook Idempotency (200 OK Ignore)
    console.log('\n--- Step 6: Testing Late Expiry Webhook Idempotency ---');
    const lateExpiryPayload = {
      event: 'payment_request.expiry',
      api_version: 'v3',
      created: new Date().toISOString(),
      data: {
        id: payment.paymentRequestId,
        payment_request_id: payment.paymentRequestId,
        reference_id: payment.referenceId,
        status: 'EXPIRED',
      },
    };

    const lateResult = await paymentService.handleXenditWebhook(lateExpiryPayload as any);
    console.log(`📥 Late Expiry Result:`, lateResult);

    // Verify Order is STILL PAID (not reset to EXPIRED)
    const recheckedOrder = await prisma.order.findUnique({
      where: { id: order.id },
    });
    console.log(`🔍 Order Status after Late Expiry: ${recheckedOrder?.orderStatus} (Expected: PAID)`);

    if (recheckedOrder?.orderStatus !== OrderStatus.PAID) {
      throw new Error('❌ Late Expiry Idempotency Failed! Order status was incorrectly modified!');
    }

    console.log('✨ Late Expiry Idempotency PASSED! Order remains PAID.');

    console.log('\n====================================================');
    console.log('🎉 ALL E2E PAYMENT & WEBHOOK TESTS PASSED 100%!');
    console.log('====================================================\n');

    await prismaService.onModuleDestroy();
  } catch (err: any) {
    console.error('❌ E2E Test Failed:', err.message);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

runE2ETest();
