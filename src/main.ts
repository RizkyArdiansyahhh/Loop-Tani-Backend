import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

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

  app.setGlobalPrefix('api/v1')

  app.enableCors({ origin: process.env.FRONTEND_URL, credentials: true })


  await app.listen(process.env.PORT ?? 2000);
}
bootstrap();
