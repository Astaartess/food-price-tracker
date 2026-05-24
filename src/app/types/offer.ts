export interface Offer {
  id: number;
  productId: number;
  store: string;
  price: number;
  currency: 'UAH' | 'USD';
  date: string;
}
