import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class SnackbarService {
  constructor(private snackBar: MatSnackBar) {}

  default(message: string) {
    const data = { type: 'default', message };
    this.snackBar.open(message, '×', { data, panelClass: 'default' });
  }
  success(message: string) {
    const data = { type: 'success', message };
    this.snackBar.open(message, '×', { data, panelClass: 'success' });
  }
  info(message: string) {
    const data = { type: 'info', message };
    this.snackBar.open(message, '×', { data, panelClass: 'info' });
  }
  error(message: string) {
    const data = { type: 'error', message };
    this.snackBar.open(message, '×', { data, panelClass: 'error' });
  }
}
