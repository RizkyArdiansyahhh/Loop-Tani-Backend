import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import express, { Express } from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';

let cachedServer: Express;

async function bootstrapServer(): Promise<Express> {
  if (!cachedServer) {
    const expressApp = express();
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
      { logger: ['error', 'warn', 'log'] },
    );

    app.setGlobalPrefix('api/v1');
    app.enableCors({
      origin: [
        'https://looptani.id',
        'https://www.looptani.id',
        'http://localhost:3000',
      ],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    });

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );

    await app.init();
    cachedServer = expressApp;
  }
  return cachedServer;
}

export default async function handler(req: any, res: any) {
  const server = await bootstrapServer();
  return server(req, res);
}
