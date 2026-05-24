import { formatDate } from 'date-fns';

export const dateToShortDate = (date: Date | number): string => {
  return formatDate(date, 'dd.MM.yy');
};
