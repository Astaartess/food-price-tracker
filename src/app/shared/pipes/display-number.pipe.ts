import { Pipe, PipeTransform } from '@angular/core';
import { displayNumber } from '../../utils/display-number';

@Pipe({
  name: 'displayNumber',
})
export class DisplayNumberPipe implements PipeTransform {
  transform(value?: number): string {
    if (typeof value === 'number') {
      return displayNumber(value);
    }
    return '--';
  }
}
