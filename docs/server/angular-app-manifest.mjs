
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/food-price-tracker/',
  locale: undefined,
  routes: [
  {
    "renderMode": 0,
    "redirectTo": "/food-price-tracker/products",
    "route": "/food-price-tracker"
  },
  {
    "renderMode": 0,
    "route": "/food-price-tracker/products"
  },
  {
    "renderMode": 0,
    "route": "/food-price-tracker/products/*"
  },
  {
    "renderMode": 0,
    "route": "/food-price-tracker/products/*/offers"
  },
  {
    "renderMode": 0,
    "route": "/food-price-tracker/products/*/offers/add"
  },
  {
    "renderMode": 0,
    "route": "/food-price-tracker/products/*/offers/*/edit"
  },
  {
    "renderMode": 0,
    "route": "/food-price-tracker/settings"
  },
  {
    "renderMode": 0,
    "redirectTo": "/food-price-tracker/settings",
    "route": "/food-price-tracker/backup"
  },
  {
    "renderMode": 0,
    "route": "/food-price-tracker/**"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 34804, hash: 'a1232d51bde6815fd08ea288a18314b01323d8a1fab1a6852c279fea1817c10c', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 17365, hash: '39b41403032fac4893c348d54832f5a9b651fcd84d067cb5e2a6c1d5197d8c2c', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-X4MKQFZJ.css': {size: 20430, hash: '1ivEEPB8BEE', text: () => import('./assets-chunks/styles-X4MKQFZJ_css.mjs').then(m => m.default)}
  },
};
