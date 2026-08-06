import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule, HttpService } from '@nestjs/axios';
import { SHIPPING_PROVIDER } from '../../infra/shipping/constants/shipping.constants';
import { RajaOngkirClient } from '../../infra/shipping/provider/rajaongkir/rajaongkir.client';
import { RajaOngkirModule } from '../../infra/shipping/provider/rajaongkir/rajaongkir.module';
import { ShippingService } from './shipping.service';
import { ShippingController } from './shipping.controller';

@Module({
  imports: [ConfigModule, HttpModule, RajaOngkirModule],
  controllers: [ShippingController],
  providers: [
    ShippingService,
    {
      provide: SHIPPING_PROVIDER,
      useFactory: (config: ConfigService, http: HttpService) => {
        const providerName = config.get<string>('SHIPPING_PROVIDER', 'rajaongkir');

        switch (providerName.toLowerCase()) {
          case 'rajaongkir':
          default:
            return new RajaOngkirClient(http, config);
        }
      },
      inject: [ConfigService, HttpService],
    },
  ],
  exports: [ShippingService],
})
export class ShippingModule {}
