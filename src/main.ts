import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

console.log("cwd:", process.cwd());
console.log("FRONTEND_URL:", process.env.FRONTEND_URL);

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  app.setGlobalPrefix('api/v1');

  app.enableCors({ origin: process.env.FRONTEND_URL, credentials: true });

  // ─── Swagger / OpenAPI ───────────────────────────────────────────────────
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Loop Tani API')
      .setDescription(
        'REST API untuk marketplace hasil pertanian dan limbah pertanian Loop Tani.\n\n' +
        '**Auth:** Endpoint yang memerlukan autentikasi menggunakan session cookie dari Better Auth. ' +
        'Login terlebih dahulu via `/api/v1/auth/sign-in/email` sebelum mengakses endpoint yang dilindungi.',
      )
      .setVersion('1.0')
      .addTag('Products', 'Manajemen produk marketplace')
      .addTag('Categories', 'Kategori produk')
      .addCookieAuth('better-auth.session_token')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        tagsSorter: 'alpha',
        operationsSorter: 'alpha',
      },
      customSiteTitle: 'Loop Tani API Docs',
    });

    console.log(`📚 Swagger docs: http://localhost:${process.env.PORT ?? 2000}/api/docs`);
  }

  await app.listen(process.env.PORT ?? 2000);
}
bootstrap();
