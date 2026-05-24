import { Offer } from './offer';

export type NewOffer = Omit<Offer, 'id'>;
