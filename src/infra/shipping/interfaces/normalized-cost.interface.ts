export interface ShippingServiceOption {
  serviceCode: string;
  serviceName: string;
  etd: string;
  cost: number;
  isRecommended?: boolean;
  isCheapest?: boolean;
}

export interface GroupedCourierOption {
  courierCode: string;
  courierName: string;
  services: ShippingServiceOption[];
}

export interface NormalizedShippingCost {
  courierCode: string;
  courierName: string;
  serviceCode: string;
  serviceName: string;
  etd: string;
  cost: number;
  isRecommended?: boolean;
  isCheapest?: boolean;
}
