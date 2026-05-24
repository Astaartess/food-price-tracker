import { Injectable, signal } from '@angular/core';

@Injectable()
export class PageNotFoundStore {
  public title = signal('Сторінку не знайдено');
  public description = signal('Можливо, адреса змінилась або сторінка більше недоступна.');
}
