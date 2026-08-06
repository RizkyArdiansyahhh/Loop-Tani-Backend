import {
  GroupedCourierOption,
  NormalizedShippingCost,
  ShippingServiceOption,
} from '../../../interfaces/normalized-cost.interface';

export function mapRajaOngkirCosts(
  rawResponse: any,
  requestedCourier: string,
): NormalizedShippingCost[] {
  const normalized: NormalizedShippingCost[] = [];

  const results = rawResponse?.data ?? rawResponse?.results ?? rawResponse;

  if (!Array.isArray(results)) {
    if (results && typeof results === 'object' && Array.isArray(results.costs)) {
      return mapRajaOngkirCosts([results], requestedCourier);
    }
    return normalized;
  }

  for (const item of results) {
    const courierCode = String(item.code ?? requestedCourier).toUpperCase();
    const courierName = String(item.name ?? courierCode);
    const costs = item.costs ?? (Array.isArray(item.service) ? item.service : [item]);

    if (Array.isArray(costs)) {
      for (const c of costs) {
        const serviceCode = String(c.service ?? c.code ?? 'REG');
        const serviceName = String(c.description ?? c.name ?? serviceCode);
        const costDetail = Array.isArray(c.cost) ? c.cost[0] : c;

        const cost = Number(costDetail?.value ?? costDetail?.price ?? costDetail?.cost ?? 0);
        const rawEtd = String(costDetail?.etd ?? c.etd ?? '');
        const etd = rawEtd.replace(/HARI|day|days/gi, '').trim();

        if (cost > 0) {
          const isReg = ['REG', 'EZ', 'REGULER', 'STANDARD'].includes(serviceCode.toUpperCase());
          normalized.push({
            courierCode,
            courierName,
            serviceCode,
            serviceName,
            etd: etd || '1-3',
            cost,
            isRecommended: isReg,
          });
        }
      }
    }
  }

  return normalized;
}

export function groupShippingCostsByCourier(
  flatCosts: NormalizedShippingCost[],
): GroupedCourierOption[] {
  if (!flatCosts || flatCosts.length === 0) return [];

  // Find overall cheapest cost across all options
  let minCost = Infinity;
  for (const c of flatCosts) {
    if (c.cost < minCost) minCost = c.cost;
  }

  const map = new Map<string, { courierName: string; services: ShippingServiceOption[] }>();

  for (const item of flatCosts) {
    const code = item.courierCode;
    if (!map.has(code)) {
      map.set(code, {
        courierName: item.courierName,
        services: [],
      });
    }

    const courierGroup = map.get(code)!;
    courierGroup.services.push({
      serviceCode: item.serviceCode,
      serviceName: item.serviceName,
      etd: item.etd,
      cost: item.cost,
      isRecommended: item.isRecommended || item.serviceCode.toUpperCase() === 'REG',
      isCheapest: item.cost === minCost,
    });
  }

  const grouped: GroupedCourierOption[] = [];
  map.forEach((val, key) => {
    grouped.push({
      courierCode: key,
      courierName: val.courierName,
      services: val.services,
    });
  });

  return grouped;
}
