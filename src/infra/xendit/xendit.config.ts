import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class XenditConfig {
  constructor(private readonly configService: ConfigService) {}

  get secretKey(): string {
    return (
      this.configService.get<string>('XENDIT_SECRET_KEY') ||
      'xnd_development_dummy_key_for_sandbox_testing'
    );
  }

  get webhookVerificationToken(): string {
    return (
      this.configService.get<string>('XENDIT_WEBHOOK_VERIFICATION_TOKEN') ||
      'xnd_webhook_verification_token_dummy'
    );
  }

  get isSandbox(): boolean {
    const key = this.secretKey;
    return key.includes('development') || key.includes('dummy');
  }
}
