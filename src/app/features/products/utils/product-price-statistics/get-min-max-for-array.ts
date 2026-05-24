export const getMinMaxForArray = (
  values: (number | null)[],
): { min: number; max: number } | undefined => {
  const numberValues = values.filter((value): value is number => typeof value === 'number');

  if (!numberValues.length) {
    return undefined;
  }

  let min = numberValues[0];
  let max = numberValues[0];
  for (const value of numberValues) {
    if (value < min) min = value;
    if (value > max) max = value;
  }
  return { min, max };
};
