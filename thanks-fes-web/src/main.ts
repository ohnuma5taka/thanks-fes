import { enableProdMode } from '@angular/core';
import '@angular/compiler';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from '@/app/app.module';
import { env } from '@/environments/env';

if (env.mode === 'prod') {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
