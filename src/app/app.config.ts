import { APP_INITIALIZER, ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideIndexedDb } from 'ngx-indexed-db';
import { LOCALE_ID, isDevMode } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { firstValueFrom } from 'rxjs';

import { routes } from './app.routes';
import { dbConfig } from './database/db-config';
import { provideServiceWorker } from '@angular/service-worker';
import { DbService } from './database/db-service';

function seedDatabase(dbService: DbService): () => Promise<void> {
  return () => firstValueFrom(dbService.seedInitialData());
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideIndexedDb(dbConfig),
    { provide: LOCALE_ID, useValue: 'uk-UA' },
    {
      provide: APP_INITIALIZER,
      useFactory: seedDatabase,
      deps: [DbService],
      multi: true,
    },
    provideNativeDateAdapter(), provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
          }),
  ],
};
