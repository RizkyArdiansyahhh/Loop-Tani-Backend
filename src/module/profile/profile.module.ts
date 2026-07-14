import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { PrismaModule } from '../../infra/database/prisma.module';
import { CloudinaryModule } from '../../infra/cloudinary/cloudinary.module';

@Module({
  imports: [PrismaModule, CloudinaryModule],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
