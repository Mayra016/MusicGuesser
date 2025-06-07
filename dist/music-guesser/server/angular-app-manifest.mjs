
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: undefined,
  entryPointToBrowserMapping: {
  "src/app/Game/play-component/play-component.component.ts": [
    {
      "path": "chunk-WV5HAHJ2.js",
      "dynamicImport": false
    }
  ]
},
  assets: {
    'index.csr.html': {size: 1211, hash: '96bf51385cb1a6b92e6fceac87a5eafd0d6b96fe8a997e658b2835ef125df765', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1444, hash: '650ec5eb15ca86ca0ad1dfca4483a75c19373bdca2608de3851aa277baa18345', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-BZEHTMKQ.css': {size: 894, hash: '+mzxlWs3tvk', text: () => import('./assets-chunks/styles-BZEHTMKQ_css.mjs').then(m => m.default)}
  },
};
