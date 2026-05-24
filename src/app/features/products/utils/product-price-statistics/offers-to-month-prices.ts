import { Offer } from '../../../../types/offer';
import { CurrencyCode } from '../../../../types/currency-code';
import { PricesByMonth } from '../../types/prices-by-month';
import { getEmptyMonthPricesForInterval } from './get-empty-month-prices-for-interval';
import { timestampToMonthLabel } from './timestamp-to-month-label';
import { calculateAverage } from './calculate-average';

export const offersToMonthPrices = (
  offersInDescOrder: Offer[],
  currency: CurrencyCode,
): PricesByMonth[] => {
  const filtered = offersInDescOrder.filter((o) => o.currency === currency);

  if (!filtered.length) {
    return [];
  }

  const newestTs = new Date(filtered[0].date).getTime();
  const oldestTs = new Date(filtered[filtered.length - 1].date).getTime();
  const months = getEmptyMonthPricesForInterval(oldestTs, newestTs);

  const monthMap: Record<string, PricesByMonth> = {};
  months.forEach((m) => (monthMap[m.monthLabel] = m));

  filtered.forEach((offer) => {
    const label = timestampToMonthLabel(new Date(offer.date).getTime());
    if (monthMap[label]) {
      monthMap[label].prices.push(offer.price);
    }
  });

  months.forEach((m) => (m.averagePrice = calculateAverage(m.prices)));

  return months;
};
