import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { PageNotFoundStore } from './page-not-found.store';

@Component({
  selector: 'app-page-not-found',
  imports: [RouterLink, MatButtonModule],
  templateUrl: './page-not-found.html',
  styleUrl: './page-not-found.scss',
  providers: [PageNotFoundStore],
})
export class PageNotFound {
  protected store = inject(PageNotFoundStore);
}
