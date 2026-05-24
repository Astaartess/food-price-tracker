import { Product } from './product';
import { Category } from './category';
import { PriceRecord } from './price-record';
import { Offer } from './offer';
import { UserProfileSettings } from './user-profile-settings';

export interface DbData {
  products: Product[];
  categories: Category[];
  priceRecords: PriceRecord[];
  offers: Offer[];
  userProfileSettings: UserProfileSettings[];
}
