import { SelectOption } from '../types/select-option';
import { CurrencyCode } from '../types/currency-code';

export const getCurrencyOptions = (): SelectOption<CurrencyCode>[] => {
  return [
    { value: 'UAH', label: 'UAH' },
    { value: 'USD', label: 'USD' },
  ];
};
