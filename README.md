# Check-Price (Food Price Tracker)

A personal web application for tracking grocery prices over time — add products, log prices from different stores, and visualize how prices change using interactive charts.

**Live demo:** https://astaartess.github.io/Check-Price/#/products
**Repo:** https://github.com/Astaartess/food-price-tracker

## Features

- Create, edit, and delete products, organized into categories
- Log price entries per product per store, with full history
- Sortable, paginated, filterable tables (Angular Material)
- Interactive price history charts (Chart.js), including correct handling of gaps in data (`spanGaps`)
- Track special offers/discounts (store, discount %, validity period)
- Installable as a Progressive Web App (PWA) with offline support

## Tech Stack

- **Angular** (standalone components) + **TypeScript**
- **Angular Material** — UI components (tables, forms, dialogs, cards)
- **RxJS** + **Angular Signals** — reactive state
- **IndexedDB** (via `ngx-indexed-db`) — fully local storage, no backend required
- **Chart.js** — price history visualization
- **date-fns** — date handling
- **Angular Service Worker** — PWA / offline support

## What I built

The entire app end-to-end, including:

- Angular project setup, routing, and folder structure
- IndexedDB schema design (`products`, `categories`, `priceRecords`, `offers` object stores) and versioning/migrations
- CRUD services for products, categories, price history, and offers
- Material-based UI (tables with sorting/pagination/filtering, forms, dialogs)
- Chart.js integration for price trend visualization
- PWA configuration (manifest, service worker, offline mode)
- GitHub Pages deployment, including fixing hash-based routing and `base-href` configuration

## Planned but not yet implemented

Being upfront about scope — these were designed but not built yet:

- Automatic price scraping from real store websites (currently all prices are entered manually)
- Push notifications on price drops
- Cross-store price comparison
- Aggregate analytics (average/min/max price, month-over-month change)

## Running locally

This project was generated with [Angular CLI](https://github.com/angular/angular-cli).

```bash
npm install
ng serve
```

Navigate to `http://localhost:4200/`. The app will reload automatically on file changes.

```bash
ng build      # production build, output in dist/
ng test       # unit tests (Vitest)
```

