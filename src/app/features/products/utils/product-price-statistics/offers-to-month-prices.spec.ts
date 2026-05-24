import { Offer } from '../../../../types/offer';
import { offersToMonthPrices } from './offers-to-month-prices';

const offersInDescOrder: Offer[] = [
  { id: 4, productId: 1, store: 'АТБ', price: 90, currency: 'UAH', date: '2026-03-20' },
  { id: 3, productId: 1, store: 'Сільпо', price: 110, currency: 'UAH', date: '2026-03-05' },
  { id: 2, productId: 1, store: 'АТБ', price: 5, currency: 'USD', date: '2026-02-10' },
  { id: 1, productId: 1, store: 'Novus', price: 100, currency: 'UAH', date: '2026-01-15' },
];

describe('offersToMonthPrices', () => {
  it('should return an empty array when there are no offers in the selected currency', () => {
    expect(offersToMonthPrices(offersInDescOrder, 'EUR' as never)).toEqual([]);
  });

  it('should group offer prices by month and calculate the monthly average', () => {
    const januaryStart = new Date(2026, 0, 1).getTime();
    const februaryStart = new Date(2026, 1, 1).getTime();
    const marchStart = new Date(2026, 2, 1).getTime();

    expect(offersToMonthPrices(offersInDescOrder, 'UAH')).toEqual([
      {
        monthLabel: '1/2026',
        monthStartTimestamp: januaryStart,
        prices: [100],
        averagePrice: 100,
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
        prices: [90, 110],
        averagePrice: 100,
      },
    ]);
  });
});
