import { LineChartData } from './line-chart-data';
import { CurrencyCode } from '../../../types/currency-code';

export type PriceLineChartDataByCurrency = {
  [key in CurrencyCode]?: LineChartData;
};
