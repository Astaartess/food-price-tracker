import { Offer } from '../../../../types/offer';
import { offersToPriceLineChartData } from './offers-to-price-line-chart-data';
import { offersToPriceLineChartDataByCurrency } from './offers-to-price-line-chart-data-by-currency';

describe('offersToPriceLineChartData', () => {
  it('should return undefined when the selected currency has data for only one month', () => {
    const offers: Offer[] = [
      { id: 2, productId: 1, store: 'АТБ', price: 120, currency: 'UAH', date: '2026-03-20' },
      { id: 1, productId: 1, store: 'Сільпо', price: 100, currency: 'UAH', date: '2026-03-10' },
    ];

    expect(offersToPriceLineChartData(offers, 'UAH')).toBeUndefined();
  });

  it('should build line chart data for multiple months', () => {
    const offers: Offer[] = [
      { id: 3, productId: 1, store: 'АТБ', price: 130, currency: 'UAH', date: '2026-03-20' },
      { id: 2, productId: 1, store: 'Сільпо', price: 100, currency: 'UAH', date: '2026-02-10' },
      { id: 1, productId: 1, store: 'Novus', price: 90, currency: 'UAH', date: '2026-01-15' },
    ];

    const result = offersToPriceLineChartData(offers, 'UAH');

    expect(result).toEqual({
      xLabels: ['1/2026', '2/2026', '3/2026'],
      datasets: [
        {
          label: 'Середня ціна',
          data: [90, 100, 130],
          borderColor: 'rgb(255, 159, 64)',
        },
      ],
      scales: {
        y: {
          min: 77,
          max: 143,
        },
      },
    });
  });

  it('should build chart data grouped by supported currencies', () => {
    const offers: Offer[] = [
      { id: 4, productId: 1, store: 'АТБ', price: 130, currency: 'UAH', date: '2026-03-20' },
      { id: 3, productId: 1, store: 'Сільпо', price: 100, currency: 'UAH', date: '2026-02-10' },
      { id: 2, productId: 1, store: 'Novus', price: 90, currency: 'UAH', date: '2026-01-15' },
      { id: 1, productId: 1, store: 'АТБ', price: 5, currency: 'USD', date: '2026-03-01' },
    ];

    const result = offersToPriceLineChartDataByCurrency(offers);

    expect(result.UAH?.xLabels).toEqual(['1/2026', '2/2026', '3/2026']);
    expect(result.USD).toBeUndefined();
  });
});
