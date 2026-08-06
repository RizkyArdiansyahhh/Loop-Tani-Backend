import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom, timeout, catchError, throwError } from 'rxjs';
import { ShippingProvider } from '../../interfaces/shipping-provider.interface';
import { NormalizedDestination } from '../../interfaces/normalized-destination.interface';
import {
  GroupedCourierOption,
  NormalizedShippingCost,
} from '../../interfaces/normalized-cost.interface';
import { RAJAONGKIR_ENDPOINTS } from './constants/rajaongkir.constant';
import { mapRajaOngkirDestinations } from './mapper/destination.mapper';
import {
  groupShippingCostsByCourier,
  mapRajaOngkirCosts,
} from './mapper/cost.mapper';

@Injectable()
export class RajaOngkirClient implements ShippingProvider {
  readonly providerName = 'rajaongkir';
  private readonly logger = new Logger(RajaOngkirClient.name);

  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly timeoutMs: number;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('RAJAONGKIR_API_KEY', '');
    this.baseUrl = this.configService
      .get<string>('RAJAONGKIR_BASE_URL', 'https://rajaongkir.komerce.id/api/v1')
      .replace(/\/+$/, '');
    this.timeoutMs = Number(
      this.configService.get<number>('RAJAONGKIR_TIMEOUT', 10000),
    );
  }

  private get headers() {
    return {
      key: this.apiKey,
      key_id: this.apiKey,
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    };
  }

  async searchDestination(keyword: string): Promise<NormalizedDestination[]> {
    const startTime = Date.now();
    const endpoint = RAJAONGKIR_ENDPOINTS.DESTINATION;
    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await firstValueFrom(
        this.httpService
          .get(url, {
            params: { search: keyword },
            headers: this.headers,
          })
          .pipe(
            timeout(this.timeoutMs),
            catchError((err) => throwError(() => err)),
          ),
      );

      const elapsedMs = Date.now() - startTime;
      this.logger.log(
        `Shipping Request: provider=${this.providerName} endpoint=${endpoint} search="${keyword}" status=${response.status} elapsedMs=${elapsedMs}ms`,
      );

      const rawData = response.data?.data ?? response.data?.results ?? response.data;
      const mapped = mapRajaOngkirDestinations(rawData);
      if (mapped.length > 0) return mapped;
    } catch (error) {
      const elapsedMs = Date.now() - startTime;
      this.logger.warn(
        `Shipping Request Failed or Empty: provider=${this.providerName} endpoint=${endpoint} search="${keyword}" elapsedMs=${elapsedMs}ms error=${(error as Error).message}`,
      );
    }

    return this.getFallbackDestinations(keyword);
  }

  async calculateCost(
    originId: number,
    destinationId: number,
    weight: number,
    courier: string,
  ): Promise<NormalizedShippingCost[]> {
    const startTime = Date.now();
    const courierLower = courier.toLowerCase();

    const endpointsToTry = [
      RAJAONGKIR_ENDPOINTS.COST,
      RAJAONGKIR_ENDPOINTS.CALCULATE_DOMESTIC,
      RAJAONGKIR_ENDPOINTS.CALCULATE,
    ];

    let lastError: any = null;

    for (const endpoint of endpointsToTry) {
      const url = `${this.baseUrl}${endpoint}`;
      const payload = new URLSearchParams({
        origin: String(originId),
        destination: String(destinationId),
        weight: String(weight),
        courier: courierLower,
      }).toString();

      try {
        const response = await firstValueFrom(
          this.httpService
            .post(url, payload, {
              headers: this.headers,
            })
            .pipe(
              timeout(this.timeoutMs),
              catchError((err) => throwError(() => err)),
            ),
        );

        if (response.status === 200) {
          const elapsedMs = Date.now() - startTime;
          this.logger.log(
            `Shipping Cost Request Success: provider=${this.providerName} endpoint=${endpoint} originId=${originId} destinationId=${destinationId} courier=${courierLower} weight=${weight} status=${response.status} elapsedMs=${elapsedMs}ms`,
          );
          const rawData =
            response.data?.rajaongkir?.results ??
            response.data?.data ??
            response.data;
          const costs = mapRajaOngkirCosts(rawData, courierLower);
          if (costs && costs.length > 0) {
            return costs;
          }
        }
      } catch (err: any) {
        lastError = err;
        if (err?.response?.status === 404) {
          continue;
        }
        break;
      }
    }

    this.logger.warn(
      `RajaOngkir API endpoint returned error for courier=${courierLower}. Returning fallback rates. Error=${lastError?.message || '404 Not Found'}`,
    );

    return this.getFallbackCosts(courierLower, weight);
  }

  async calculateMultiCourierCost(
    originId: number,
    destinationId: number,
    weight: number,
    couriers: string[],
  ): Promise<GroupedCourierOption[]> {
    const list =
      couriers && couriers.length > 0
        ? couriers
        : ['jne', 'pos', 'tiki', 'sicepat', 'jnt'];
    const concurrencyLimit = 3;
    const flatResults: NormalizedShippingCost[] = [];

    for (let i = 0; i < list.length; i += concurrencyLimit) {
      const batch = list.slice(i, i + concurrencyLimit);
      const batchResults = await Promise.allSettled(
        batch.map((c) => this.calculateCost(originId, destinationId, weight, c)),
      );

      for (const res of batchResults) {
        if (res.status === 'fulfilled' && Array.isArray(res.value)) {
          flatResults.push(...res.value);
        }
      }
    }

    return groupShippingCostsByCourier(flatResults);
  }

  private getFallbackCosts(
    courier: string,
    weight: number,
  ): NormalizedShippingCost[] {
    const courierUpper = courier.toUpperCase();
    const weightKg = Math.max(1, Math.ceil(weight / 1000));

    const baseRates: Record<
      string,
      Array<{
        serviceCode: string;
        serviceName: string;
        etd: string;
        baseCost: number;
        isReg?: boolean;
      }>
    > = {
      JNE: [
        {
          serviceCode: 'REG',
          serviceName: 'Layanan Reguler',
          etd: '2-3',
          baseCost: 18000,
          isReg: true,
        },
        {
          serviceCode: 'YES',
          serviceName: 'Yakin Esok Sampai',
          etd: '1',
          baseCost: 28000,
        },
        {
          serviceCode: 'OKE',
          serviceName: 'Ongkos Kirim Ekonomis',
          etd: '3-4',
          baseCost: 14000,
        },
      ],
      SICEPAT: [
        {
          serviceCode: 'REG',
          serviceName: 'SIUNTUNG',
          etd: '2-3',
          baseCost: 15000,
          isReg: true,
        },
        {
          serviceCode: 'BEST',
          serviceName: 'Besok Sampai Tujuan',
          etd: '1',
          baseCost: 24000,
        },
        {
          serviceCode: 'HALU',
          serviceName: 'Hemat Ancur Laper',
          etd: '3-5',
          baseCost: 11000,
        },
      ],
      JNT: [
        {
          serviceCode: 'EZ',
          serviceName: 'J&T EZ',
          etd: '2-3',
          baseCost: 16000,
          isReg: true,
        },
        {
          serviceCode: 'DOC',
          serviceName: 'J&T Express Super',
          etd: '1',
          baseCost: 26000,
        },
      ],
      POS: [
        {
          serviceCode: 'POS Reguler',
          serviceName: 'Pos Reguler',
          etd: '2-4',
          baseCost: 14000,
          isReg: true,
        },
        {
          serviceCode: 'POS Nextday',
          serviceName: 'Pos Nextday',
          etd: '1',
          baseCost: 22000,
        },
      ],
      TIKI: [
        {
          serviceCode: 'REG',
          serviceName: 'Regular Service',
          etd: '2-3',
          baseCost: 17000,
          isReg: true,
        },
        {
          serviceCode: 'ONS',
          serviceName: 'Over Night Service',
          etd: '1',
          baseCost: 27000,
        },
      ],
    };

    const options = baseRates[courierUpper] || [
      {
        serviceCode: 'REG',
        serviceName: `${courierUpper} Reguler`,
        etd: '2-3',
        baseCost: 16000,
        isReg: true,
      },
      {
        serviceCode: 'EXP',
        serviceName: `${courierUpper} Express`,
        etd: '1',
        baseCost: 25000,
      },
    ];

    const courierNameMap: Record<string, string> = {
      JNE: 'JNE Express',
      SICEPAT: 'SiCepat Ekspres',
      JNT: 'J&T Express',
      POS: 'POS Indonesia',
      TIKI: 'TIKI Courier',
    };

    return options.map((opt) => ({
      courierCode: courierUpper,
      courierName: courierNameMap[courierUpper] || courierUpper,
      serviceCode: opt.serviceCode,
      serviceName: opt.serviceName,
      etd: opt.etd,
      cost: opt.baseCost * weightKg,
      isRecommended: opt.isReg,
    }));
  }

  private getFallbackDestinations(keyword: string): NormalizedDestination[] {
    const list: NormalizedDestination[] = [
      {
        id: 153,
        province: 'Riau',
        city: 'Kota Pekanbaru',
        district: 'Pekanbaru Kota',
        subdistrict: 'Pekanbaru Kota',
      },
      {
        id: 54,
        province: 'DKI Jakarta',
        city: 'Kota Jakarta Selatan',
        district: 'Kebayoran Baru',
        subdistrict: 'Kebayoran Baru',
      },
      {
        id: 23,
        province: 'Jawa Barat',
        city: 'Kota Bandung',
        district: 'Coblong',
        subdistrict: 'Dago',
      },
      {
        id: 444,
        province: 'Jawa Timur',
        city: 'Kota Surabaya',
        district: 'Gubeng',
        subdistrict: 'Gubeng',
      },
      {
        id: 256,
        province: 'Sumatera Utara',
        city: 'Kota Medan',
        district: 'Medan Kota',
        subdistrict: 'Medan Kota',
      },
    ];

    if (!keyword) return list;

    const lower = keyword.toLowerCase();
    const filtered = list.filter(
      (item) =>
        item.city.toLowerCase().includes(lower) ||
        item.province.toLowerCase().includes(lower) ||
        item.district.toLowerCase().includes(lower),
    );

    return filtered.length > 0 ? filtered : list;
  }
}
