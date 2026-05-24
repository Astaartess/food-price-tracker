import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { OfferListStore } from './offer-list.store';
import { OfferDetailsDialog } from '../../components/offer-details-dialog/offer-details-dialog';
import { ConfirmDialogService } from '../../../../core/components/confirm-dialog/confirm-dialog.service';
import { ShortDatePipe } from '../../../../shared/pipes/short-date.pipe';
import { DisplayNumberPipe } from '../../../../shared/pipes/display-number.pipe';
import { Offer } from '../../../../types/offer';

@Component({
  selector: 'app-offer-list',
  imports: [
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatFormField,
    MatInput,
    MatLabel,
    ShortDatePipe,
    DisplayNumberPipe,
  ],
  templateUrl: './offer-list.html',
  styleUrl: './offer-list.scss',
  providers: [OfferListStore],
})
export class OfferList implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private dialog = inject(MatDialog);
  private confirmDialog = inject(ConfirmDialogService);

  protected store = inject(OfferListStore);
  protected productId = 0;
  protected tableColumns = ['store', 'price', 'currency', 'date', 'edit', 'remove'];

  public ngOnInit(): void {
    this.productId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.store.loadOffers(this.productId);
  }

  protected goBack(event: Event): void {
    event.preventDefault();
    window.history.back();
  }

  protected openOfferDetails(offer: Offer): void {
    this.dialog.open(OfferDetailsDialog, {
      data: offer,
      width: window.innerWidth <= 480 ? `${window.innerWidth * 0.9}px` : '420px',
      maxWidth: 'unset',
      position: { top: '10vh' },
    });
  }

  protected removeOffer(offer: Offer): void {
    this.confirmDialog
      .confirm(`Видалити офер від "${offer.store}" на суму ${offer.price} ${offer.currency}?`)
      .subscribe((result) => {
        if (result) {
          this.store.removeOffer(offer.id);
        }
      });
  }

  protected setDateFrom(event: Event): void {
    this.store.setDateFrom((event.target as HTMLInputElement).value);
  }

  protected setDateTo(event: Event): void {
    this.store.setDateTo((event.target as HTMLInputElement).value);
  }
}
