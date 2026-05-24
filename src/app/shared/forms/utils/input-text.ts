import { BaseInput } from './base-input';
import { computed } from '@angular/core';

export abstract class InputText extends BaseInput<string> {
  protected maxLengthValue = computed(() => {
    const fieldState = this.fieldState();
    return fieldState.maxLength?.();
  });

  protected isMaxLengthErrorShown = computed(() => {
    const maxLength = this.maxLengthValue();
    if (typeof maxLength !== 'number' || maxLength <= 0) {
      return false;
    }

    const fieldState = this.fieldState();
    const isTouched = fieldState.touched();
    const isInvalid = fieldState.invalid();
    const errors = fieldState.errors();
    const hasMaxLengthError = !!errors.find((error) => error.kind === 'maxLength');
    return isTouched && isInvalid && hasMaxLengthError;
  });
}
