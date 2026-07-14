import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './module/product/product.module';
import { CategoryModule } from './module/category/category.module';
import { CartModule } from './module/cart/cart.module';
import { PrismaModule } from './infra/database/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from './infra/auth/auth';
import { ProfileModule } from './module/profile/profile.module';
import { SellerModule } from './module/seller/seller.module';
import { CloudinaryModule } from './infra/cloudinary/cloudinary.module';
import { KnowledgeModule } from './module/knowledge/knowledge.module';
import { PointsModule } from './module/points/points.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthModule.forRoot({ auth }),
    PrismaModule,
    CloudinaryModule,
    ProductModule,
    CategoryModule,
    CartModule,
    ProfileModule,
    SellerModule,
    KnowledgeModule,
    PointsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
