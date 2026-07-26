import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class XenditWebhookGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const tokenHeader = request.headers['x-callback-token'];
    const expectedToken = this.configService.get<string>(
      'XENDIT_WEBHOOK_TOKEN',
    );

    if (!expectedToken) {
      throw new UnauthorizedException(
        'XENDIT_WEBHOOK_TOKEN belum dikonfigurasi di environment',
      );
    }

    if (!tokenHeader || tokenHeader !== expectedToken) {
      throw new UnauthorizedException('Token callback tidak valid');
    }

    return true;
  }
}
