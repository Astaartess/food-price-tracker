import { inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of, Subject, switchMap, tap } from 'rxjs';
import { DbService } from '../../../../database/db-service';
import { SnackbarService } from '../../../../core/services/snackbar.service';
import { NewOffer } from '../../../../types/new-offer';
import { Offer } from '../../../../types/offer';

@Injectable()
export class AddOfferStore {
  private dbService = inject(DbService);
  private snackbar = inject(SnackbarService);

  public isSaving = signal(false);
  public errorMessage = signal<string | undefined>(undefined);

  private addRequest = new Subject<NewOffer>();
  private updateRequest = new Subject<Offer>();

  private onAddRequest: Observable<undefined> = this.addRequest.pipe(
    tap(() => this.isSaving.set(true)),
    switchMap((offer) =>
      this.dbService.addOffer(offer).pipe(
        tap(() => {
          this.errorMessage.set(undefined);
          this.snackbar.success('Офер додано');
          this.isSaving.set(false);
          window.history.back();
        }),
        map(() => undefined),
        catchError((error) => {
          console.error(error);
          this.errorMessage.set(error?.message || 'Не вдалося додати офер');
          this.snackbar.error('Не вдалося додати офер');
          this.isSaving.set(false);
          return of(undefined);
        }),
      ),
    ),
  );

  private onUpdateRequest: Observable<undefined> = this.updateRequest.pipe(
    tap(() => this.isSaving.set(true)),
    switchMap((offer) =>
      this.dbService.updateOffer(offer).pipe(
        tap(() => {
          this.errorMessage.set(undefined);
          this.snackbar.success('Офер оновлено');
          this.isSaving.set(false);
          window.history.back();
        }),
        map(() => undefined),
        catchError((error) => {
          console.error(error);
          this.errorMessage.set(error?.message || 'Не вдалося оновити офер');
          this.snackbar.error('Не вдалося оновити офер');
          this.isSaving.set(false);
          return of(undefined);
        }),
      ),
    ),
  );

  constructor() {
    this.onAddRequest.subscribe();
    this.onUpdateRequest.subscribe();
  }

  public add(offer: NewOffer): void {
    this.addRequest.next(offer);
  }

  public update(offer: Offer): void {
    this.updateRequest.next(offer);
  }
}
