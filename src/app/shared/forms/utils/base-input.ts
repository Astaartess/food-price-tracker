import { computed, InputSignal } from '@angular/core';
import { FieldTree } from '@angular/forms/signals';

export abstract class BaseInput<Type> {
  public abstract label: InputSignal<string | undefined>;
  public abstract field: InputSignal<FieldTree<Type>>;

  protected fieldState = computed(() => {
    const state = this.field();
    return state();
  });

  protected isRequiredErrorShown = computed(() => {
    const fieldState = this.fieldState();
    const isTouched = fieldState.touched();
    const isInvalid = fieldState.invalid();
    const isRequired = fieldState.required();
    return isTouched && isInvalid && isRequired;
  });
}
