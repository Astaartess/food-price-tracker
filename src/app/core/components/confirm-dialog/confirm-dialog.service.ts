import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog } from './confirm-dialog';

@Injectable({
  providedIn: 'root',
})
export class ConfirmDialogService {
  private dialog = inject(MatDialog);

  confirm(message: string) {
    return this.dialog
      .open(ConfirmDialog, {
        data: { message },
      })
      .afterClosed();
  }
}
