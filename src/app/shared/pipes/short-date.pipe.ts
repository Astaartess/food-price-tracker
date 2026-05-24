import { Pipe, PipeTransform } from '@angular/core';
import { dateToShortDate } from '../../utils/date-to-short-date';

@Pipe({
  name: 'shortDate',
})
export class ShortDatePipe implements PipeTransform {
  public transform(date?: string | number | Date): string {
    if (!date) {
      return '--';
    }
    const d = typeof date === 'string' ? new Date(date) : date;
    return dateToShortDate(d);
  }
}
