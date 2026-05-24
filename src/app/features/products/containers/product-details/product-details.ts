import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { ProductDetailsStore } from './product-details.store';
import { ProductPriceStatistics } from '../product-price-statistics/product-price-statistics';

@Component({
  selector: 'app-product-details',
  imports: [ProductPriceStatistics, MatButton, RouterLink],
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss',
  providers: [ProductDetailsStore],
})
export class ProductDetails implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  protected store = inject(ProductDetailsStore);

  public ngOnInit(): void {
    this.activatedRoute.paramMap
      .pipe(
        map((params) => Number(params.get('id'))),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((id) => this.store.load(id));
  }

  protected goBack(event: Event): void {
    event.preventDefault();
    window.history.back();
  }
}
