import { Offer } from '../../../../types/offer';
import { CurrencyCode } from '../../../../types/currency-code';
import { LineChartData } from '../../types/line-chart-data';
import { LineChartDataset } from '../../types/line-chart-dataset';
import { offersToMonthPrices } from './offers-to-month-prices';
import { getLineChartScalesForDatasets } from './get-line-chart-scales-for-datasets';

export const offersToPriceLineChartData = (
  offersInDescOrder: Offer[],
  currency: CurrencyCode,
): LineChartData | undefined => {
  const months = offersToMonthPrices(offersInDescOrder, currency);

  if (months.length <= 1) {
    return undefined;
  }

  const datasets: LineChartDataset[] = [
    {
      label: 'Середня ціна',
      data: months.map((month) => month.averagePrice),
      borderColor: 'rgb(255, 159, 64)',
    },
  ];

  return {
    xLabels: months.map((month) => month.monthLabel),
    datasets,
    scales: getLineChartScalesForDatasets(datasets),
  };
};
