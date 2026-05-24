import { Component, input } from '@angular/core';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerToggle,
} from '@angular/material/datepicker';
import { MatError, MatFormField, MatInput, MatLabel, MatSuffix } from '@angular/material/input';
import { FieldTree, FormField } from '@angular/forms/signals';
import { BaseInput } from '../utils/base-input';

@Component({
  selector: 'app-datepicker',
  imports: [
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    MatSuffix,
    FormField,
  ],
  templateUrl: './datepicker.html',
  styleUrl: './datepicker.scss',
})
export class Datepicker extends BaseInput<Date | string | number> {
  public label = input<string | undefined>('Дата');
  public field = input.required<FieldTree<Date | string | number>>();
}
