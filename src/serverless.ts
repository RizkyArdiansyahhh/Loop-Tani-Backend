import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

const server = express();
let cachedServer: any;

export async function createNestApp(expressInstance: express.Express) {
  if (!cachedServer) {
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressInstance),
      { bodyParser: false }
    );

    app.use(express.json({ limit: '20mb' }));
    app.use(express.urlencoded({ limit: '20mb', extended: true }));

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );

    app.setGlobalPrefix('api/v1');

    const allowedOrigins = [
      'https://looptani.id',
      'https://www.looptani.id',
      'http://localhost:3000',
    ];

    app.enableCors({
      origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
    });

    await app.init();
    cachedServer = expressInstance;
  }
  return cachedServer;
}

export default async function handler(req: any, res: any) {
  const expressApp = await createNestApp(server);
  return expressApp(req, res);
}
