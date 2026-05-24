import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { form, min, required, maxLength, submit, FormField } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Datepicker } from '../../../../shared/forms/datepicker/datepicker';
import { InputNumber } from '../../../../shared/forms/input-number/input-number';
import { Input } from '../../../../shared/forms/input/input';
import { AddOfferStore } from './add-offer.store';
import { NewOffer } from '../../../../types/new-offer';
import { CurrencyCode } from '../../../../types/currency-code';
import { DbService } from '../../../../database/db-service';
import { Offer } from '../../../../types/offer';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-add-offer',
  imports: [FormField, MatButtonModule, MatFormFieldModule, MatSelectModule, Datepicker, InputNumber, Input],
  templateUrl: './add-offer.html',
  styleUrl: './add-offer.scss',
  providers: [AddOfferStore],
})
export class AddOffer implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private dbService = inject(DbService);
  protected addOfferStore = inject(AddOfferStore);

  protected productId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
  protected offerId = this.parseOfferId(this.activatedRoute.snapshot.paramMap.get('offerId'));
  protected isEditMode = this.offerId !== null;
  protected isOfferLoading = this.isEditMode;
  protected currencyOptions: CurrencyCode[] = ['UAH', 'USD'];

  protected readonly offerModel = signal({
    date: new Date(),
    price: null as null | number,
    currency: 'UAH' as CurrencyCode,
    store: '',
  });

  protected readonly offerForm = form(this.offerModel, (path) => {
    required(path.date);
    required(path.price);
    required(path.store);
    min(path.price, 0.01);
    maxLength(path.store, 50);
  });

  public ngOnInit(): void {
    if (this.offerId !== null && this.isEditMode) {
      this.dbService
        .getOfferById(this.offerId)
        .pipe(
          catchError((error) => {
            setTimeout(() => {
              this.isOfferLoading = false;
              this.addOfferStore.errorMessage.set(
                error?.message || 'Не вдалося завантажити офер для редагування',
              );
            });
            return of(undefined);
          }),
        )
        .subscribe((offer) => {
          setTimeout(() => {
            this.isOfferLoading = false;
            if (!offer) {
              this.addOfferStore.errorMessage.set('Офер для редагування не знайдено');
              return;
            }

            this.setOfferFormValue(offer);
          });
        });
    }
  }

  protected goBack(event: Event): void {
    event.preventDefault();
    window.history.back();
  }

  public async save(event: Event): Promise<void> {
    event.preventDefault();
    await submit(this.offerForm, async () => {
      if (this.offerForm().invalid()) return;

      const formValue = this.offerModel();
      const dateStr = formValue.date instanceof Date
        ? this.toIsoDate(formValue.date)
        : String(formValue.date);

      const offer: NewOffer = {
        productId: this.productId,
        price: Number(formValue.price),
        currency: formValue.currency,
        date: dateStr,
        store: formValue.store.trim(),
      };

      if (this.offerId !== null && this.isEditMode) {
        this.addOfferStore.update({ id: this.offerId, ...offer });
        return;
      }

      this.addOfferStore.add(offer);
    });
  }

  private setOfferFormValue(offer: Offer): void {
    this.offerModel.set({
      date: new Date(offer.date),
      price: offer.price,
      currency: offer.currency,
      store: offer.store,
    });
  }

  private toIsoDate(date: Date): string {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private parseOfferId(value: string | null): number | null {
    if (!value) {
      return null;
    }

    const parsed = Number(value);
    return Number.isNaN(parsed) ? null : parsed;
  }
}
