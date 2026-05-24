import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, forkJoin, map, Observable, of, Subject, switchMap, tap } from 'rxjs';
import { DbService } from '../../../../database/db-service';
import { CurrencyCode } from '../../../../types/currency-code';
import { LineChartData } from '../../types/line-chart-data';
import { PriceLineChartDataByCurrency } from '../../types/price-line-chart-data-by-currency';
import { offersToPriceLineChartDataByCurrency } from '../../utils/product-price-statistics/offers-to-price-line-chart-data-by-currency';

@Injectable()
export class ProductPriceStatisticsStore {
  private dbService = inject(DbService);

  public selectedCurrency = signal<CurrencyCode>('UAH');

  private priceLineChartDataByCurrency = signal<PriceLineChartDataByCurrency>({});
  public isPriceLineChartDataLoading = signal(false);
  public priceLineChartDataErrorMessage = signal<string | undefined>(undefined);

  public priceLineChartData = computed((): LineChartData | undefined => {
    const dataByCurrency = this.priceLineChartDataByCurrency();
    const currency = this.selectedCurrency();
    return dataByCurrency[currency];
  });

  private loadRequest = new Subject<number>();
  private setCurrencyRequest = new Subject<CurrencyCode>();

  private onLoadRequest: Observable<undefined> = this.loadRequest.pipe(
    tap(() => this.isPriceLineChartDataLoading.set(true)),
    switchMap((productId) =>
      forkJoin({
        offers: this.dbService.getOffersByProductDescending(productId),
        settings: this.dbService.getUserProfileSettings(),
      }).pipe(
        tap(({ offers, settings }) => {
          this.selectedCurrency.set(settings.defaultCurrency);
          this.priceLineChartDataByCurrency.set(offersToPriceLineChartDataByCurrency(offers));
          this.priceLineChartDataErrorMessage.set(undefined);
          this.isPriceLineChartDataLoading.set(false);
        }),
        map(() => undefined),
        catchError((error) => {
          this.priceLineChartDataErrorMessage.set(
            error?.message || 'Помилка завантаження статистики',
          );
          this.isPriceLineChartDataLoading.set(false);
          return of(undefined);
        }),
      ),
    ),
  );

  private onSetCurrencyRequest: Observable<undefined> = this.setCurrencyRequest.pipe(
    tap((currency) => this.selectedCurrency.set(currency)),
    switchMap((currency) =>
      this.dbService.setDefaultCurrency(currency).pipe(
        tap((settings) => {
          this.selectedCurrency.set(settings.defaultCurrency);
          this.priceLineChartDataErrorMessage.set(undefined);
        }),
        map(() => undefined),
        catchError((error) => {
          this.priceLineChartDataErrorMessage.set(
            error?.message || 'Не вдалося оновити валюту за замовчуванням',
          );
          return of(undefined);
        }),
      ),
    ),
  );

  constructor() {
    this.onLoadRequest.subscribe();
    this.onSetCurrencyRequest.subscribe();
  }

  public load(productId: number): void {
    this.loadRequest.next(productId);
  }

  public setCurrency(currency: CurrencyCode): void {
    this.setCurrencyRequest.next(currency);
  }
}
