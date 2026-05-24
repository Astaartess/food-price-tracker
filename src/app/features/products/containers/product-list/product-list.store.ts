import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of, Subject, switchMap, tap } from 'rxjs';
import { DbService } from '../../../../database/db-service';
import { Product } from '../../../../types/product';

@Injectable()
export class ProductListStore {
  private dbService = inject(DbService);

  public products = signal<Product[]>([]);
  public searchTerm = signal('');
  public filteredProducts = computed(() => {
    const normalized = this.searchTerm().trim().toLowerCase();
    if (!normalized) {
      return this.products();
    }

    return this.products().filter((product) => product.name.toLowerCase().includes(normalized));
  });
  public isLoading = signal(false);
  public errorMessage = signal<string | undefined>(undefined);

  private loadRequest = new Subject<void>();

  private onLoadRequest: Observable<undefined> = this.loadRequest.pipe(
    tap(() => this.isLoading.set(true)),
    switchMap(() =>
      this.dbService.getAppData().pipe(
        tap((data) => {
          this.products.set(data.products);
          this.errorMessage.set(undefined);
          this.isLoading.set(false);
        }),
        map(() => undefined),
        catchError((error) => {
          this.errorMessage.set(error?.message || 'Failed to load products');
          this.isLoading.set(false);
          return of(undefined);
        }),
      ),
    ),
  );

  constructor() {
    this.onLoadRequest.subscribe();
  }

  public load(): void {
    this.loadRequest.next();
  }

  public setSearchTerm(value: string): void {
    this.searchTerm.set(value);
  }
}
