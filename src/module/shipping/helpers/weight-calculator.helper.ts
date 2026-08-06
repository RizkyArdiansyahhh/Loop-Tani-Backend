export interface WeightCalculatableItem {
  quantity: number;
  product?: {
    weight?: number | null;
  };
}

export class WeightCalculator {
  /**
   * Calculates total shipping weight in grams.
   * If product weight is not configured or <= 0, defaults to 500 grams per unit item.
   */
  static calculateTotalWeightInGrams(items: WeightCalculatableItem[]): number {
    if (!items || items.length === 0) {
      return 1000; // Default fallback: 1kg
    }

    let totalGrams = 0;
    for (const item of items) {
      const qty = Math.max(1, item.quantity || 1);
      const unitWeight =
        item.product?.weight && item.product.weight > 0
          ? item.product.weight
          : 500; // 500 grams default per unit
      totalGrams += unitWeight * qty;
    }

    return Math.max(1, Math.round(totalGrams));
  }
}
