import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { forkJoin, from, Observable, map, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { DbStoreName } from './db-store-name';
import { DbData } from '../types/db-data';
import { Product } from '../types/product';
import { Category } from '../types/category';
import { PriceRecord } from '../types/price-record';
import { Offer } from '../types/offer';
import { NewOffer } from '../types/new-offer';
import { UserProfileSettings } from '../types/user-profile-settings';
import { CurrencyCode } from '../types/currency-code';
import seedData from './test-app-data.json';

const defaultUserProfileSettings: UserProfileSettings = {
  id: 1,
  defaultCurrency: 'UAH',
};

const normalizedSeedData: DbData = {
  products: seedData.products,
  categories: seedData.categories,
  priceRecords: seedData.priceRecords,
  offers: seedData.offers.map((offer) => ({
    ...offer,
    currency: offer.currency as CurrencyCode,
  })),
  userProfileSettings:
    seedData.userProfileSettings.length > 0
      ? seedData.userProfileSettings.map((settings) => ({
          ...settings,
          defaultCurrency: settings.defaultCurrency as CurrencyCode,
        }))
      : [defaultUserProfileSettings],
};

@Injectable({
  providedIn: 'root',
})
export class DbService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  constructor(private db: NgxIndexedDBService) {}

  seedInitialData(): Observable<void> {
    if (!this.isBrowser) {
      return of(undefined);
    }

    return this.getAppData().pipe(
      switchMap((data) => {
        const hasExistingData =
          data.products.length > 0 ||
          data.categories.length > 0 ||
          data.priceRecords.length > 0 ||
          data.offers.length > 0;

        if (hasExistingData) {
          return from(Promise.resolve());
        }

        return this.putAppData(normalizedSeedData);
      }),
    );
  }

  getAppData(): Observable<DbData> {
    if (!this.isBrowser) {
      return of({
        products: [],
        categories: [],
        priceRecords: [],
        offers: [],
        userProfileSettings: [defaultUserProfileSettings],
      });
    }

    return forkJoin({
      products: this.db.getAll<Product>(DbStoreName.PRODUCTS),
      categories: this.db.getAll<Category>(DbStoreName.CATEGORIES),
      priceRecords: this.db.getAll<PriceRecord>(DbStoreName.PRICE_RECORDS),
      offers: this.db.getAll<Offer>(DbStoreName.OFFERS),
      userProfileSettings: this.getUserProfileSettings().pipe(map((settings) => [settings])),
    });
  }

  putAppData(data: DbData): Observable<void> {
    if (!this.isBrowser) {
      return of(undefined);
    }

    return this.clearAppData().pipe(
      switchMap(() =>
        forkJoin([
          ...data.products.map((product) => this.db.add<Product>(DbStoreName.PRODUCTS, product)),

          ...data.categories.map((category) =>
            this.db.add<Category>(DbStoreName.CATEGORIES, category),
          ),

          ...data.priceRecords.map((record) =>
            this.db.add<PriceRecord>(DbStoreName.PRICE_RECORDS, record),
          ),

          ...data.offers.map((offer) => this.db.add<Offer>(DbStoreName.OFFERS, offer)),
          ...(data.userProfileSettings.length > 0
            ? data.userProfileSettings
            : [defaultUserProfileSettings]
          ).map((settings) =>
            this.db.add<UserProfileSettings>(DbStoreName.USER_PROFILE_SETTINGS, settings),
          ),
        ]),
      ),
      switchMap(() => from(Promise.resolve())),
    );
  }

  setAppData(data: DbData): Observable<void> {
    return this.putAppData(data);
  }

  clearAppData(): Observable<void> {
    if (!this.isBrowser) {
      return of(undefined);
    }

    return forkJoin([
      this.db.clear(DbStoreName.PRODUCTS),
      this.db.clear(DbStoreName.CATEGORIES),
      this.db.clear(DbStoreName.PRICE_RECORDS),
      this.db.clear(DbStoreName.OFFERS),
      this.db.clear(DbStoreName.USER_PROFILE_SETTINGS),
    ]).pipe(switchMap(() => from(Promise.resolve())));
  }

  getProductById(id: number): Observable<Product | undefined> {
    return this.getAppData().pipe(map((data) => data.products.find((p) => p.id === id)));
  }

  getOfferById(id: number): Observable<Offer | undefined> {
    if (!this.isBrowser) {
      return of(undefined);
    }

    return this.db
      .getAll<Offer>(DbStoreName.OFFERS)
      .pipe(map((offers) => offers.find((offer) => offer.id === id)));
  }

  getOffersByProductDescending(productId: number): Observable<Offer[]> {
    if (!this.isBrowser) {
      return of([]);
    }

    return this.db
      .getAll<Offer>(DbStoreName.OFFERS)
      .pipe(
        map((offers) =>
          offers
            .filter((offer) => offer.productId === productId)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
        ),
      );
  }

  addOffer(newOffer: NewOffer): Observable<Offer> {
    if (!this.isBrowser) {
      return of({ ...newOffer, id: Date.now() });
    }

    const offer: Offer = { ...newOffer, id: Date.now() };
    return this.db.add<Offer>(DbStoreName.OFFERS, offer).pipe(map(() => offer));
  }

  updateOffer(offer: Offer): Observable<Offer> {
    if (!this.isBrowser) {
      return of(offer);
    }

    return this.db.update<Offer>(DbStoreName.OFFERS, offer).pipe(map(() => offer));
  }

  removeOffer(id: number): Observable<void> {
    if (!this.isBrowser) {
      return of(undefined);
    }

    return this.db.delete(DbStoreName.OFFERS, id).pipe(switchMap(() => from(Promise.resolve())));
  }

  getUserProfileSettings(): Observable<UserProfileSettings> {
    if (!this.isBrowser) {
      return of(defaultUserProfileSettings);
    }

    return this.db.getAll<UserProfileSettings>(DbStoreName.USER_PROFILE_SETTINGS).pipe(
      switchMap((settingsList) => {
        const settings = settingsList[0];
        if (settings) {
          return of(settings);
        }

        return this.db
          .add<UserProfileSettings>(DbStoreName.USER_PROFILE_SETTINGS, defaultUserProfileSettings)
          .pipe(map(() => defaultUserProfileSettings));
      }),
    );
  }

  setDefaultCurrency(defaultCurrency: CurrencyCode): Observable<UserProfileSettings> {
    if (!this.isBrowser) {
      return of({
        ...defaultUserProfileSettings,
        defaultCurrency,
      });
    }

    return this.getUserProfileSettings().pipe(
      switchMap((settings) => {
        const updatedSettings: UserProfileSettings = {
          ...settings,
          defaultCurrency,
        };

        return this.db
          .update<UserProfileSettings>(DbStoreName.USER_PROFILE_SETTINGS, updatedSettings)
          .pipe(map(() => updatedSettings));
      }),
    );
  }
}
