import { Inject, Injectable, Logger } from '@nestjs/common';
import { SHIPPING_PROVIDER } from '../../infra/shipping/constants/shipping.constants';
import type { ShippingProvider } from '../../infra/shipping/interfaces/shipping-provider.interface';
import { CalculateShippingCostDto } from './dto/calculate-shipping-cost.dto';
import { NormalizedDestination } from '../../infra/shipping/interfaces/normalized-destination.interface';
import {
  GroupedCourierOption,
  NormalizedShippingCost,
} from '../../infra/shipping/interfaces/normalized-cost.interface';

@Injectable()
export class ShippingService {
  private readonly logger = new Logger(ShippingService.name);

  constructor(
    @Inject(SHIPPING_PROVIDER)
    private readonly shippingProvider: ShippingProvider,
  ) {}

  async searchDestination(keyword: string): Promise<NormalizedDestination[]> {
    this.logger.log(
      `Searching destination keyword="${keyword}" using provider=${this.shippingProvider.providerName}`,
    );
    return this.shippingProvider.searchDestination(keyword);
  }

  async calculateShippingCost(
    dto: CalculateShippingCostDto,
  ): Promise<NormalizedShippingCost[]> {
    this.logger.log(
      `Calculating shipping cost using provider=${this.shippingProvider.providerName} originId=${dto.originId} destinationId=${dto.destinationId} weight=${dto.weight} courier=${dto.courier}`,
    );

    return this.shippingProvider.calculateCost(
      dto.originId,
      dto.destinationId,
      dto.weight,
      dto.courier,
    );
  }

  async calculateMultiCourierOptions(
    originId: number,
    destinationId: number,
    weight: number,
    couriers: string[] = ['jne', 'pos', 'tiki', 'sicepat', 'jnt'],
  ): Promise<GroupedCourierOption[]> {
    this.logger.log(
      `Calculating multi-courier options using provider=${this.shippingProvider.providerName} originId=${originId} destinationId=${destinationId} weight=${weight} couriers=${couriers.join(',')}`,
    );

    return this.shippingProvider.calculateMultiCourierCost(
      originId,
      destinationId,
      weight,
      couriers,
    );
  }
}
