import { NormalizedDestination } from '../../../interfaces/normalized-destination.interface';

export function mapRajaOngkirDestination(rawItem: any): NormalizedDestination {
  const rawId = rawItem.id ?? rawItem.subdistrict_id ?? rawItem.city_id ?? rawItem.destination_id ?? 0;
  const province = rawItem.province_name ?? rawItem.province ?? '';
  const cityName = rawItem.city_name ?? rawItem.city ?? '';
  const cityType = rawItem.type ? `${rawItem.type} ` : '';
  const fullCity = rawItem.city_name ? `${cityType}${cityName}`.trim() : cityName;

  const district = rawItem.district_name ?? rawItem.subdistrict_name ?? fullCity;
  const subdistrict = rawItem.subdistrict_name ?? rawItem.district_name ?? fullCity;

  return {
    id: Number(rawId),
    province: String(province),
    city: String(fullCity),
    district: String(district),
    subdistrict: String(subdistrict),
  };
}

export function mapRajaOngkirDestinations(rawList: any[]): NormalizedDestination[] {
  if (!Array.isArray(rawList)) return [];
  return rawList.map(mapRajaOngkirDestination);
}
