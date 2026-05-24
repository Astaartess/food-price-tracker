import { inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of, Subject, switchMap, tap } from 'rxjs';
import { DbService } from '../../../../database/db-service';
import { Product } from '../../../../types/product';

@Injectable()
export class ProductDetailsStore {
  private dbService = inject(DbService);

  public product = signal<Product | undefined>(undefined);
  public isLoading = signal(false);
  public errorMessage = signal<string | undefined>(undefined);

  private loadRequest = new Subject<number>();

  private onLoadRequest: Observable<undefined> = this.loadRequest.pipe(
    tap(() => this.isLoading.set(true)),
    switchMap((id) =>
      this.dbService.getProductById(id).pipe(
        tap((product) => {
          if (!product) {
            throw new Error('Товар не знайдено');
          }

          this.product.set(product);
          this.errorMessage.set(undefined);
          this.isLoading.set(false);
        }),
        map(() => undefined),
        catchError((error) => {
          this.errorMessage.set(error?.message || 'Помилка завантаження');
          this.isLoading.set(false);
          return of(undefined);
        }),
      ),
    ),
  );

  constructor() {
    this.onLoadRequest.subscribe();
  }

  public load(productId: number): void {
    this.loadRequest.next(productId);
  }
}
