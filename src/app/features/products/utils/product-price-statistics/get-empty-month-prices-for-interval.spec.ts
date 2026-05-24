import { getEmptyMonthPricesForInterval } from './get-empty-month-prices-for-interval';

describe('getEmptyMonthPricesForInterval', () => {
  it('should return all months in the interval including empty months', () => {
    const start = new Date('2026-01-15T00:00:00.000Z').getTime();
    const end = new Date('2026-03-20T00:00:00.000Z').getTime();
    const januaryStart = new Date(2026, 0, 1).getTime();
    const februaryStart = new Date(2026, 1, 1).getTime();
    const marchStart = new Date(2026, 2, 1).getTime();

    const result = getEmptyMonthPricesForInterval(start, end);

    expect(result).toEqual([
      {
        monthLabel: '1/2026',
        monthStartTimestamp: januaryStart,
        prices: [],
        averagePrice: null,
      },
      {
        monthLabel: '2/2026',
        monthStartTimestamp: februaryStart,
        prices: [],
        averagePrice: null,
      },
      {
        monthLabel: '3/2026',
        monthStartTimestamp: marchStart,
        prices: [],
        averagePrice: null,
      },
    ]);
  });
});
