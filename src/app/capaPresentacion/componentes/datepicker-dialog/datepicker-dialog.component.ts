import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  provideNativeDateAdapter,
  MAT_DATE_FORMATS,
  MAT_NATIVE_DATE_FORMATS,
} from '@angular/material/core';

export interface DialogData {
  selectedDate: Date;
}

@Component({
  selector: 'app-datepicker-dialog',
  standalone: true,
  templateUrl: './datepicker-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogActions,
    MatDialogContent,
    ReactiveFormsModule,
  ],
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS },
  ],
})
export class DatepickerDialogComponent {
  dialogRef = inject<MatDialogRef<DatepickerDialogComponent>>(MatDialogRef);
  data = inject<DialogData>(MAT_DIALOG_DATA);

  date = new FormControl(this.data.selectedDate || new Date());

  minDate: Date = new Date();

  confirmSelection() {
    const dateValue = this.date.value;

    if (dateValue) {
      const formattedDate = new Date(dateValue).toISOString().slice(0, 19).replace('T', ' ');
      this.dialogRef.close(formattedDate);
    } else {
      this.dialogRef.close(null);
    }
  }
}
