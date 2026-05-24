import { Routes } from '@angular/router';
import { UserProfileSettings } from './core/containers/user-profile-settings/user-profile-settings';
import { PageNotFound } from './core/containers/page-not-found/page-not-found';
import { productsRoutes } from './features/products/products-routes';
import { offersRoutes } from './features/offers/offers-routes';

export const routes: Routes = [
  ...productsRoutes,
  ...offersRoutes,
  {
    path: 'settings',
    component: UserProfileSettings,
  },
  {
    path: 'backup',
    redirectTo: 'settings',
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'products',
  },
  {
    path: '**',
    component: PageNotFound,
  },
];
