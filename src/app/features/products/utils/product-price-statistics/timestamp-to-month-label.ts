export const timestampToMonthLabel = (timestamp: number): string => {
  const date = new Date(timestamp);
  const monthNumber = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${monthNumber}/${year}`;
};
