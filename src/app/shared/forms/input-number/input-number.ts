import { Component, computed, input } from '@angular/core';
import { BaseInput } from '../utils/base-input';
import { FieldTree, FormField } from '@angular/forms/signals';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';

@Component({
  selector: 'app-input-number',
  imports: [MatError, MatFormField, MatInput, MatLabel, FormField],
  templateUrl: './input-number.html',
  styleUrl: './input-number.scss',
})
export class InputNumber extends BaseInput<number | null> {
  public label = input<string>();
  public field = input.required<FieldTree<number | null>>();

  protected formField = computed(() => this.field() as FieldTree<number>);

  protected minValue = computed(() => this.fieldState().min?.());

  protected isMinErrorShown = computed(() => {
    const minValue = this.minValue();
    if (typeof minValue !== 'number') return false;
    const fieldState = this.fieldState();
    const errors = fieldState.errors();
    return fieldState.touched() && fieldState.invalid() && !!errors.find((e) => e.kind === 'min');
  });
}
