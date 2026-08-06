import { NormalizedDestination } from './normalized-destination.interface';
import { GroupedCourierOption, NormalizedShippingCost } from './normalized-cost.interface';

export interface ShippingProvider {
  readonly providerName: string;

  searchDestination(keyword: string): Promise<NormalizedDestination[]>;

  calculateCost(
    originId: number,
    destinationId: number,
    weight: number,
    courier: string,
  ): Promise<NormalizedShippingCost[]>;

  calculateMultiCourierCost(
    originId: number,
    destinationId: number,
    weight: number,
    couriers: string[],
  ): Promise<GroupedCourierOption[]>;
}
