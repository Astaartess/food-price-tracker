import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Offer } from '../../../../types/offer';
import { ShortDatePipe } from '../../../../shared/pipes/short-date.pipe';
import { DisplayNumberPipe } from '../../../../shared/pipes/display-number.pipe';

@Component({
  selector: 'app-offer-details-dialog',
  imports: [MatDialogModule, MatButtonModule, ShortDatePipe, DisplayNumberPipe],
  templateUrl: './offer-details-dialog.html',
  styleUrl: './offer-details-dialog.scss',
})
export class OfferDetailsDialog {
  protected offer = inject(MAT_DIALOG_DATA) as Offer;
}
