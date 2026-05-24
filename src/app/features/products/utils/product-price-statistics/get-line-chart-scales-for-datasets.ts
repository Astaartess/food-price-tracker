import { LineChartScales } from '../../types/line-chart-scales';
import { getMinMaxForArray } from './get-min-max-for-array';

export const getLineChartScalesForDatasets = (
  datasets: { data: (number | null)[] }[],
  limitOffsetPercentage = 10,
): LineChartScales | undefined => {
  const allDatasetLimits: number[] = [];

  datasets.forEach((dataset) => {
    const limits = getMinMaxForArray(dataset.data);
    if (limits) {
      allDatasetLimits.push(limits.min, limits.max);
    }
  });

  const mergedLimits = getMinMaxForArray(allDatasetLimits);
  if (mergedLimits) {
    const offset = Math.round(mergedLimits.max * (limitOffsetPercentage / 100));
    const min = mergedLimits.min - offset < 0 ? 0 : mergedLimits.min - offset;
    return {
      y: {
        min,
        max: mergedLimits.max + offset,
      },
    };
  }

  return undefined;
};
