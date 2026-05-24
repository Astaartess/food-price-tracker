import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';

const defaultSnackbarDurationMs = 3000;

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor(private snackbar: MatSnackBar) {}

  public success(message: string, durationMs?: number): MatSnackBarRef<unknown> {
    return this.openSnackbar(message, 'snackbar-success', durationMs);
  }

  public error(message: string, durationMs?: number): MatSnackBarRef<unknown> {
    return this.openSnackbar(message, 'snackbar-error', durationMs);
  }

  private openSnackbar(
    message: string,
    panelClass: string,
    durationMs?: number,
  ): MatSnackBarRef<unknown> {
    return this.snackbar.open(message, undefined, {
      panelClass, // see src/app/styles.scss
      duration: durationMs || defaultSnackbarDurationMs,
      verticalPosition: 'bottom',
    });
  }
}
