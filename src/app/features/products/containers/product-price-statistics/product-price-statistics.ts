import { Component, computed, inject, input, OnInit } from '@angular/core';
import { MatTab, MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { ProductPriceStatisticsStore } from './product-price-statistics.store';
import { LineChart } from '../../components/line-chart/line-chart';
import { getCurrencyOptions } from '../../../../utils/get-currency-options';
import { CurrencyCode } from '../../../../types/currency-code';

@Component({
  selector: 'app-product-price-statistics',
  imports: [LineChart, MatTabGroup, MatTab],
  templateUrl: './product-price-statistics.html',
  styleUrl: './product-price-statistics.scss',
  providers: [ProductPriceStatisticsStore],
})
export class ProductPriceStatistics implements OnInit {
  public productId = input.required<number>();

  protected stats = inject(ProductPriceStatisticsStore);
  protected currencyTabs = getCurrencyOptions();

  protected selectedCurrencyTabIndex = computed(() => {
    const idx = this.currencyTabs.findIndex((t) => t.value === this.stats.selectedCurrency());
    return idx >= 0 ? idx : 0;
  });

  public ngOnInit(): void {
    this.stats.load(this.productId());
  }

  protected setCurrency(event: MatTabChangeEvent): void {
    this.stats.setCurrency(event.tab.id as CurrencyCode);
  }
}
