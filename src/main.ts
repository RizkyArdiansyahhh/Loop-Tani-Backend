import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'express';

import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

console.log("cwd:", process.cwd());
console.log("FRONTEND_URL:", process.env.FRONTEND_URL);

let cachedServer: any;

async function bootstrapServerless(): Promise<any> {
  if (!cachedServer) {
    const expressApp = express();
    const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp), {
      bodyParser: false,
    });

    app.use(json({ limit: '20mb' }));
    app.use(urlencoded({ limit: '20mb', extended: true }));

    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      transform: true,
    }));

    app.setGlobalPrefix('api/v1');

    const allowedOrigins = [
      "https://looptani.id",
      "https://www.looptani.id",
      "http://localhost:3000",
    ];

    app.enableCors({
      origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
    });

    await app.init();
    cachedServer = expressApp;
  }
  return cachedServer;
}

export default async function handler(req: any, res: any) {
  const server = await bootstrapServerless();
  return server(req, res);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });

  app.use(json({ limit: '20mb' }));
  app.use(urlencoded({ limit: '20mb', extended: true }));

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  app.setGlobalPrefix('api/v1');

  const allowedOrigins = [
    "https://looptani.id",
    "https://www.looptani.id",
    "http://localhost:3000",
  ];

  app.enableCors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  });

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

if (!process.env.VERCEL) {
  bootstrap();
}
