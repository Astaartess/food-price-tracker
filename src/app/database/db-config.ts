import { DBConfig } from 'ngx-indexed-db';
import { DbStoreName } from './db-store-name';

export const dbConfig: DBConfig = {
  name: 'ProductPriceStatsDB',
  version: 4,
  objectStoresMeta: [
    {
      store: DbStoreName.PRODUCTS,
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [],
    },
    {
      store: DbStoreName.CATEGORIES,
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [],
    },
    {
      store: DbStoreName.PRICE_RECORDS,
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [],
    },
    {
      store: DbStoreName.OFFERS,
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [],
    },
    {
      store: DbStoreName.USER_PROFILE_SETTINGS,
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [],
    },
  ],
};
