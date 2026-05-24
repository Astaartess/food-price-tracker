import { Routes } from '@angular/router';
import { ProductList } from './containers/product-list/product-list';
import { ProductDetails } from './containers/product-details/product-details';

export const productsRoutes: Routes = [
  {
    path: 'products',
    component: ProductList,
  },
  {
    path: 'products/:id',
    component: ProductDetails,
  },
];
