import { inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of, Subject, switchMap, tap } from 'rxjs';
import { DbService } from '../../../../database/db-service';
import { SnackbarService } from '../../../../core/services/snackbar.service';
import { Offer } from '../../../../types/offer';

@Injectable()
export class OfferListStore {
  private dbService = inject(DbService);
  private snackbar = inject(SnackbarService);

  public offers = signal<Offer[] | undefined>(undefined);
  public dateFrom = signal('');
  public dateTo = signal('');
  public filteredOffers = signal<Offer[]>([]);
  public isOffersLoading = signal(false);
  public isRemoveOfferLoading = signal(false);
  public errorMessage = signal<string | undefined>(undefined);

  private loadOffersRequest = new Subject<number>();
  private removeOfferRequest = new Subject<number>();

  private onLoadOffers: Observable<undefined> = this.loadOffersRequest.pipe(
    tap(() => {
      this.isOffersLoading.set(true);
      this.resetDateFilter();
    }),
    switchMap((productId) =>
      this.dbService.getOffersByProductDescending(productId).pipe(
        tap((offers) => {
          this.offers.set(offers);
          this.applyDateFilter();
          this.errorMessage.set(undefined);
          this.isOffersLoading.set(false);
        }),
        map(() => undefined),
        catchError((error) => {
          this.errorMessage.set(error?.message || 'Не вдалося завантажити офери');
          this.isOffersLoading.set(false);
          return of(undefined);
        }),
      ),
    ),
  );

  private onRemoveOffer: Observable<undefined> = this.removeOfferRequest.pipe(
    tap(() => this.isRemoveOfferLoading.set(true)),
    switchMap((offerId) =>
      this.dbService.removeOffer(offerId).pipe(
        tap(() => {
          const updated = (this.offers() ?? []).filter((offer) => offer.id !== offerId);
          this.offers.set(updated);
          this.applyDateFilter();
          this.isRemoveOfferLoading.set(false);
          this.snackbar.success('Офер видалено');
        }),
        map(() => undefined),
        catchError((error) => {
          console.error(error);
          this.snackbar.error('Не вдалося видалити офер');
          this.isRemoveOfferLoading.set(false);
          return of(undefined);
        }),
      ),
    ),
  );

  constructor() {
    this.onLoadOffers.subscribe();
    this.onRemoveOffer.subscribe();
  }

  public loadOffers(productId: number): void {
    this.loadOffersRequest.next(productId);
  }

  public removeOffer(offerId: number): void {
    this.removeOfferRequest.next(offerId);
  }

  public setDateFrom(value: string): void {
    this.dateFrom.set(value);
    this.applyDateFilter();
  }

  public setDateTo(value: string): void {
    this.dateTo.set(value);
    this.applyDateFilter();
  }

  public resetDateFilter(): void {
    this.dateFrom.set('');
    this.dateTo.set('');
    this.applyDateFilter();
  }

  private applyDateFilter(): void {
    const offers = this.offers() ?? [];
    const from = this.dateFrom();
    const to = this.dateTo();

    const filtered = offers.filter((offer) => {
      const isAfterStart = !from || offer.date >= from;
      const isBeforeEnd = !to || offer.date <= to;
      return isAfterStart && isBeforeEnd;
    });

    this.filteredOffers.set(filtered);
  }
}
