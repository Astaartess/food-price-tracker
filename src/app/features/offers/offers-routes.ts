import { Routes } from '@angular/router';
import { OfferList } from './containers/offer-list/offer-list';
import { AddOffer } from './containers/add-offer/add-offer';

export const offersRoutes: Routes = [
  {
    path: 'products/:id/offers',
    component: OfferList,
  },
  {
    path: 'products/:id/offers/add',
    component: AddOffer,
  },
  {
    path: 'products/:id/offers/:offerId/edit',
    component: AddOffer,
  },
];
