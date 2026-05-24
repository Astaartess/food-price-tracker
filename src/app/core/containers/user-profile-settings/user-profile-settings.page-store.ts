import { inject, Injectable, signal } from '@angular/core';
import { catchError, concatMap, Observable, of, Subject, switchMap, tap } from 'rxjs';
import { DbService } from '../../../database/db-service';
import { SnackbarService } from '../../services/snackbar.service';
import { DbData } from '../../../types/db-data';
import { UserProfileSettings } from '../../../types/user-profile-settings';
import { UserProfileSettingsStore } from '../../services/user-profile-settings.store';

const defaultUserProfileSettings: UserProfileSettings = {
  id: 1,
  defaultCurrency: 'UAH',
};

@Injectable()
export class UserProfileSettingsPageStore {
  private dbService = inject(DbService);
  private snackbar = inject(SnackbarService);
  private userProfileSettingsStore = inject(UserProfileSettingsStore);

  public isUploadDataFromFileLoading = signal(false);
  public uploadDataFromFileErrorMessage = signal<string | undefined>(undefined);
  public isDownloadDataLoading = signal(false);
  public downloadDataErrorMessage = signal<string | undefined>(undefined);

  private uploadDataFromFileRequest = new Subject<File>();
  private downloadDataRequest = new Subject<void>();

  private onUploadDataFromFile = this.uploadDataFromFileRequest.pipe(
    tap(() => this.isUploadDataFromFileLoading.set(true)),
    switchMap((file) =>
      this.getDataFromFile(file).pipe(
        concatMap((data) =>
          this.dbService.putAppData(data).pipe(
            tap(() => {
              this.isUploadDataFromFileLoading.set(false);
              this.uploadDataFromFileErrorMessage.set(undefined);
              this.userProfileSettingsStore.load();
              this.snackbar.success('Data uploaded successfully');
            }),
          ),
        ),
        catchError((error) => {
          this.uploadDataFromFileErrorMessage.set(error?.message || 'Failed to upload data');
          this.isUploadDataFromFileLoading.set(false);
          return of(undefined);
        }),
      ),
    ),
  );

  private onDownloadData = this.downloadDataRequest.pipe(
    tap(() => this.isDownloadDataLoading.set(true)),
    switchMap(() =>
      this.dbService.getAppData().pipe(
        concatMap((data) =>
          this.downloadDataAsJsonFile(data).pipe(
            tap(() => {
              this.isDownloadDataLoading.set(false);
              this.downloadDataErrorMessage.set(undefined);
              this.snackbar.success('Data downloaded successfully');
            }),
          ),
        ),
        catchError((error) => {
          this.downloadDataErrorMessage.set(error?.message || 'Failed to download data');
          this.isDownloadDataLoading.set(false);
          return of(undefined);
        }),
      ),
    ),
  );

  constructor() {
    this.onUploadDataFromFile.subscribe();
    this.onDownloadData.subscribe();
  }

  public uploadDataFromFile(file: File | undefined): void {
    if (!file) {
      return;
    }

    this.uploadDataFromFileRequest.next(file);
  }

  public downloadData(): void {
    this.downloadDataRequest.next();
  }

  private getDataFromFile(file: File): Observable<DbData> {
    return new Observable<DbData>((observer) => {
      const reader = new FileReader();

      reader.onload = (event): void => {
        const fileContent = event.target?.result as string;
        try {
          const parsed = JSON.parse(fileContent) as Partial<DbData>;
          const data: DbData = {
            products: parsed.products ?? [],
            categories: parsed.categories ?? [],
            priceRecords: parsed.priceRecords ?? [],
            offers: parsed.offers ?? [],
            userProfileSettings:
              parsed.userProfileSettings && parsed.userProfileSettings.length > 0
                ? parsed.userProfileSettings
                : [defaultUserProfileSettings],
          };

          observer.next(data);
          observer.complete();
        } catch {
          observer.error(new Error('Failed to parse data from file'));
        }
      };

      reader.onerror = () => {
        observer.error(new Error('Failed to read file'));
      };

      reader.readAsText(file);
    });
  }

  private downloadDataAsJsonFile(data: DbData): Observable<void> {
    return new Observable<void>((observer) => {
      try {
        const dataJson = JSON.stringify(data, undefined, 2);
        const blob = new Blob([dataJson], { type: 'application/json' });
        const todayDate = new Date().toISOString().split('T')[0];
        const fileName = `check-price-data-${todayDate}.json`;

        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = fileName;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(blobUrl);

        observer.next();
        observer.complete();
      } catch (error) {
        observer.error(error);
      }
    });
  }
}
