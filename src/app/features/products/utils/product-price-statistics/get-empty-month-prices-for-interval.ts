import { eachMonthOfInterval } from 'date-fns';
import { PricesByMonth } from '../../types/prices-by-month';
import { timestampToMonthLabel } from './timestamp-to-month-label';

export const getEmptyMonthPricesForInterval = (
  startTimestamp: number,
  endTimestamp: number,
): PricesByMonth[] => {
  return eachMonthOfInterval({ start: startTimestamp, end: endTimestamp }).map((monthStart) => ({
    monthLabel: timestampToMonthLabel(monthStart.getTime()),
    monthStartTimestamp: monthStart.getTime(),
    prices: [],
    averagePrice: null,
  }));
};
