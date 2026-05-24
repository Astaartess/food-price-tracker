import { LineChartDataset } from './line-chart-dataset';
import { LineChartScales } from './line-chart-scales';

export type LineChartData = {
  xLabels: string[];
  datasets: LineChartDataset[];
  scales?: LineChartScales;
};
