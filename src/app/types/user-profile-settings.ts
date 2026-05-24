import { CurrencyCode } from './currency-code';

export interface UserProfileSettings {
  id: number;
  defaultCurrency: CurrencyCode;
}
