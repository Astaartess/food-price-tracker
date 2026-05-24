import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of, Subject, switchMap, tap } from 'rxjs';
import { DbService } from '../../database/db-service';
import { CurrencyCode } from '../../types/currency-code';
import { UserProfileSettings } from '../../types/user-profile-settings';
import { SnackbarService } from './snackbar.service';

@Injectable({
  providedIn: 'root',
})
export class UserProfileSettingsStore {
  private dbService = inject(DbService);
  private snackbar = inject(SnackbarService);

  public settings = signal<UserProfileSettings | undefined>(undefined);
  public defaultCurrency = computed(() => this.settings()?.defaultCurrency ?? 'UAH');
  public isLoading = signal(false);
  public isSaving = signal(false);
  public errorMessage = signal<string | undefined>(undefined);

  private loadRequest = new Subject<void>();
  private setDefaultCurrencyRequest = new Subject<CurrencyCode>();

  private onLoadRequest: Observable<undefined> = this.loadRequest.pipe(
    tap(() => this.isLoading.set(true)),
    switchMap(() =>
      this.dbService.getUserProfileSettings().pipe(
        tap((settings) => {
          this.settings.set(settings);
          this.errorMessage.set(undefined);
          this.isLoading.set(false);
        }),
        map(() => undefined),
        catchError((error) => {
          this.errorMessage.set(error?.message || 'Failed to load settings');
          this.isLoading.set(false);
          return of(undefined);
        }),
      ),
    ),
  );

  private onSetDefaultCurrencyRequest: Observable<undefined> = this.setDefaultCurrencyRequest.pipe(
    tap(() => this.isSaving.set(true)),
    switchMap((currency) =>
      this.dbService.setDefaultCurrency(currency).pipe(
        tap((settings) => {
          this.settings.set(settings);
          this.errorMessage.set(undefined);
          this.isSaving.set(false);
          this.snackbar.success('Default currency updated');
        }),
        map(() => undefined),
        catchError((error) => {
          this.errorMessage.set(error?.message || 'Failed to save settings');
          this.isSaving.set(false);
          this.snackbar.error('Failed to save settings');
          return of(undefined);
        }),
      ),
    ),
  );

  constructor() {
    this.onLoadRequest.subscribe();
    this.onSetDefaultCurrencyRequest.subscribe();
  }

  public load(): void {
    this.loadRequest.next();
  }

  public setDefaultCurrency(currency: CurrencyCode): void {
    if (currency === this.defaultCurrency()) {
      return;
    }

    this.setDefaultCurrencyRequest.next(currency);
  }
}
