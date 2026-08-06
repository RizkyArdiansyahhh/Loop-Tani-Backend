import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RajaOngkirClient } from './rajaongkir.client';

@Module({
  imports: [HttpModule],
  providers: [RajaOngkirClient],
  exports: [RajaOngkirClient, HttpModule],
})
export class RajaOngkirModule {}
