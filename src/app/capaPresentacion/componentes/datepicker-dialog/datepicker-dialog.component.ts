import { ChangeDetectionStrategy, Component, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
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

import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FormsModule } from '@angular/forms';

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
    FormsModule,
    TimepickerModule,
    BsDatepickerModule
  ],
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS },
  ],
})
export class DatepickerDialogComponent {
  dialogRef = inject<MatDialogRef<DatepickerDialogComponent>>(MatDialogRef);
  data = inject<DialogData>(MAT_DIALOG_DATA);

  currentTime = new Date();

  selectedDate: Date | null = null;
  selectedTime: Date = new Date();

  cancel(): void{
    this.dialogRef.close();
  }

  confirm() {
    const combineDateTime = this.combineDateAndTime(this.selectedDate, this.selectedTime);
    this.dialogRef.close(combineDateTime)
  }

  combineDateAndTime(date: Date | null, time : Date | null): string{
    if(!date || !time) return '';

    const combined = new Date(date);
    combined.setUTCHours(time.getHours(), time.getMinutes(), 0, 0);

    return combined.toISOString();
  }

}
