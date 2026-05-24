import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { ProductListStore } from './product-list.store';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatFormField, MatInput, MatLabel],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
  providers: [ProductListStore],
})
export class ProductList implements OnInit {
  protected store = inject(ProductListStore);

  public ngOnInit(): void {
    this.store.load();
  }

  protected onSearch(event: Event): void {
    this.store.setSearchTerm((event.target as HTMLInputElement).value);
  }
}
