import { formatNumber } from '@angular/common';
import { appLocale } from './app-locale';

export const displayNumber = (value: number): string => {
  return formatNumber(value, appLocale);
};
