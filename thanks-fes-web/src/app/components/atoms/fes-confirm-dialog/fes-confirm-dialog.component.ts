import { ColorMode } from '@/app/core/models/color.model';
import { SnackbarService } from '@/app/core/services/snackbar.service';
import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export type ConfirmDialogData = {
  elementId: string;
  title: string;
  description: string;
  action: {
    close: {
      label: string;
    };
    confirm?: {
      label: string;
      colorMode: ColorMode;
    };
  };
};

export type ConfirmDialogAction<T> = {
  action: 'confirm' | 'cancel';
  data?: T;
};

@Component({
  selector: 'fes-confirm-dialog',
  templateUrl: './fes-confirm-dialog.component.html',
  styleUrls: ['./fes-confirm-dialog.component.scss'],
})
export class FesConfirmDialogComponent implements OnInit {
  @Input() dialogData: ConfirmDialogData;
  @Input() formGroup: FormGroup = new FormGroup({});
  @Input() loading: boolean;
  @Output() emitConfirm = new EventEmitter();

  constructor(
    private snackbar: SnackbarService,
    private dialogRef: MatDialogRef<FesConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private matDialogData: ConfirmDialogData
  ) {}

  get data() {
    return this.dialogData || this.matDialogData;
  }

  get colorMode() {
    return this.data.action.confirm
      ? this.data.action.confirm.colorMode
      : 'default';
  }

  get iconClass() {
    const icon =
      this.colorMode === 'alert'
        ? 'mdi-close-circle-outline'
        : 'mdi-check-circle-outline';
    const color =
      this.colorMode === 'alert' ? 'alert-color' : `${this.colorMode}-color`;
    return `${icon} ${color}`;
  }

  ngOnInit() {}

  cancel() {
    const action = { action: 'cancel' };
    this.dialogRef.close(action);
  }

  confirm() {
    if (this.formGroup.invalid) {
      Object.keys(this.formGroup.controls).forEach((key) =>
        this.formGroup.controls[key].markAllAsTouched()
      );
      const message = '入力情報に誤りがあります。';
      this.snackbar.error(message);
      return;
    }
    if (this.dialogData) {
      this.emitConfirm.emit();
    } else {
      const action = { action: 'confirm' };
      this.dialogRef.close(action);
    }
  }
}
